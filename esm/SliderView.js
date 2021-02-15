var Container = createjs.Container;
var Point = createjs.Point;
import { SliderEvent, SliderEventType } from "./SliderEvent";
import { SliderViewOption } from "./SliderViewOption";
/**
 * スライダー用クラスです
 *
 * 使用上の注意 :
 * オブジェクトのサイズの計測にgetBounds関数を使用しています。
 * shapeおよびContainerクラスでは、getBoundsの自動計測が効かない場合があります。
 * setBounds関数でサイズをあらかじめ与えてください。
 */
export class SliderView extends Container {
    /**
     * @param {SliderViewOption} option
     */
    constructor(option) {
        super();
        this.isHorizontal = true;
        this.dragStartPos = new createjs.Point();
        this.isDragging = false; // 現在スライド中か否か
        /**
         * スライダーのドラッグを開始する
         * @param {Object} e
         */
        this.startMove = (e) => {
            const evt = e;
            this.isDragging = true;
            const target = evt.currentTarget;
            const localPos = this.globalToLocal(evt.stageX, evt.stageY);
            this.dragStartPos = new Point(localPos.x - target.x, localPos.y - target.y);
            this.stage.addEventListener("pressmove", this.moveSlider);
            this.stage.addEventListener("pressup", this.moveSliderFinish);
        };
        /**
         * スライダーのドラッグ中の処理
         * @param e
         */
        this.moveSlider = (e) => {
            const evt = e;
            const mousePos = this.limitSliderButtonPosition(evt);
            this.updateParts(mousePos);
            this._rate = this.changePixelToRate(mousePos);
            this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE, this.rate));
        };
        /**
         * スライダーのドラッグ終了時の処理
         * @param	e
         */
        this.moveSliderFinish = (e) => {
            this.isDragging = false;
            this.stage.removeEventListener("pressmove", this.moveSlider);
            this.stage.removeEventListener("pressup", this.moveSliderFinish);
            this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE_FINISH, this.rate));
        };
        /**
         * このインスタンスを破棄する。
         * @param	e
         */
        this.dispose = (e) => {
            this.onDisposeFunction(e);
        };
        this.init(option);
    }
    /**
     * 初期化処理
     * @param {SliderViewOption} option
     */
    init(option) {
        option = SliderViewOption.init(option);
        this.base = option.base;
        this._bar = this.initBarAndMask(option.bar);
        this.slideButton = option.button;
        this._barMask = this.initBarAndMask(option.mask);
        if (this._bar && this._barMask)
            this._bar.mask = this._barMask;
        this._minPosition = option.minPosition;
        this._maxPosition = option.maxPosition;
        this.isHorizontal = option.isHorizontal;
        this._rate = option.rate;
        this.changeRate(this._rate);
    }
    addChildMe(obj) {
        if (!obj)
            return;
        if (obj.parent)
            obj.parent.removeChild(obj);
        this.addChild(obj);
    }
    /**
     * スライダーの位置を変更する
     * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
     */
    changeRate(rate) {
        //ドラッグ中は外部からの操作を無視する。
        if (this.isDragging)
            return;
        this._rate = rate;
        const pos = this.changeRateToPixel(this._rate);
        this.updateParts(pos);
        this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE, this.rate));
    }
    /**
     * スライダーボタンの位置を制限する関数
     * @return 制限で切り落とされたスライダーボタンの座標値
     */
    limitSliderButtonPosition(evt) {
        let mousePos = this.getMousePosition(this, evt);
        mousePos = Math.min(this._maxPosition, mousePos);
        mousePos = Math.max(this._minPosition, mousePos);
        return mousePos;
    }
    /**
     * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する
     * moveSliderの内部処理
     * @param	mousePos
     */
    updateParts(mousePos) {
        //バーマスクがなければ、バー自体を伸縮する
        if (this._bar && !this._barMask) {
            this.setSize(this._bar, Math.max(2.0, mousePos - this._minPosition));
        }
        //バーマスクがあれば、マスクを伸縮する。
        if (this._barMask) {
            this.setSize(this._barMask, mousePos - this.getPosition(this._barMask));
        }
        //ボタンの位置を更新する。
        if (this._slideButton) {
            this.setPosition(this._slideButton, mousePos);
        }
    }
    /**
     * スライダーの地をクリックした際の処理
     * その位置までスライダーをジャンプする
     * @param {createjs.MouseEvent} evt
     */
    onPressBase(evt) {
        this.dragStartPos = new Point();
        this.moveSlider(evt);
        this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE_FINISH, this.rate));
    }
    /**
     * スライダーの割合から、スライダーの位置を取得する
     * @param	rate
     * @return
     */
    changeRateToPixel(rate) {
        let pix = ((this._maxPosition - this._minPosition) * rate) / SliderView.MAX_RATE +
            this._minPosition;
        pix = Math.max(pix, this._minPosition);
        pix = Math.min(pix, this._maxPosition);
        return pix;
    }
    /**
     * スライダーの座標から、スライダーの割合を取得する
     * @param	pixel
     * @return
     */
    changePixelToRate(pixel) {
        const min = this._minPosition;
        const max = this._maxPosition;
        let rate = ((pixel - min) / (max - min)) * SliderView.MAX_RATE;
        rate = Math.max(rate, 0.0);
        rate = Math.min(rate, SliderView.MAX_RATE);
        return rate;
    }
    /**
     * ディスプレイオブジェクトからスクロール方向の座標値を取り出す
     * @param	displayObj
     * @return
     */
    getPosition(displayObj) {
        if (this.isHorizontal) {
            return displayObj.x;
        }
        else {
            return displayObj.y;
        }
    }
    /**
     * ディスプレイオブジェクトにスクロール方向の座標地を設定する
     * @param	displayObj
     * @param	position
     */
    setPosition(displayObj, position) {
        if (!displayObj)
            return;
        if (this.isHorizontal) {
            displayObj.x = position;
        }
        else {
            displayObj.y = position;
        }
    }
    /**
     * スクロール方向のマウス座標を取得する
     * limitSliderButtonPosition内の処理
     * @param	displayObj
     * @return
     */
    getMousePosition(displayObj, evt) {
        const localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);
        if (this.isHorizontal) {
            return localPos.x - this.dragStartPos.x;
        }
        else {
            return localPos.y - this.dragStartPos.y;
        }
    }
    /**
     * スクロール方向の高さ、もしくは幅を取得する
     * @param	displayObj
     * @return
     */
    getSize(displayObj) {
        const size = displayObj.getBounds();
        if (this.isHorizontal) {
            return size.width * displayObj.scaleX;
        }
        else {
            return size.height * displayObj.scaleY;
        }
    }
    /**
     * スクロール方向の高さ、もしくは幅を設定する
     * @param {createjs.DisplayObject} displayObj
     * @param {number} amount
     */
    setSize(displayObj, amount) {
        const size = displayObj.getBounds();
        if (this.isHorizontal) {
            displayObj.scaleX = amount / size.width;
        }
        else {
            displayObj.scaleY = amount / size.height;
        }
    }
    set base(value) {
        if (!value)
            return;
        this._base = value;
        this._base.mouseEnabled = true;
        this._base.addEventListener("click", e => {
            this.onPressBase(e);
        });
        this.addChildMe(value);
    }
    initBarAndMask(value) {
        if (value == null)
            return;
        value.mouseEnabled = false;
        this.addChildMe(value);
        return value;
    }
    set slideButton(value) {
        if (!value)
            return;
        this._slideButton = value;
        this._slideButton.addEventListener("mousedown", this.startMove);
        this.addChildMe(value);
    }
    get rate() {
        return this._rate;
    }
    /**
     * 全てのDisplayObjectとEventListenerを解除する。
     * @param {Event} e
     */
    onDisposeFunction(e) {
        this.removeAllEventListeners();
        this._base.removeAllEventListeners();
        this._slideButton.removeAllEventListeners();
        this.removeAllChildren();
    }
}
SliderView.MAX_RATE = 100.0;

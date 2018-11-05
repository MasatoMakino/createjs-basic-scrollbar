var Container = createjs.Container;
var Point = createjs.Point;
import { SliderEvent, SliderEventType } from "./SliderEvent";
import { SliderViewOption } from "./SliderViewOption";
/**
 * スライダー用クラスです
 *
 * 使用上の注意
 *
 * オブジェクトのサイズの計測にgetBounds関数を使用しています。
 * shapeおよびContainerクラスでは、getBoundsの自動計測が効かない場合があるため
 * setBounds関数でサイズをあらかじめ与えてください。
 */
export class SliderView extends Container {
    /**
     * コンストラクタ
     * @param {SliderViewOption} option
     */
    constructor(option) {
        super();
        this.isHorizontal = true;
        // protected isReverse: Boolean = false;
        this.dragStartPos = new createjs.Point();
        this.isDragging = false; // 現在スライド中か否か
        /**
         * スライダーのドラッグを開始する
         * @param	evt
         */
        this.startMove = (e) => {
            const evt = e;
            this.isDragging = true;
            const target = evt.currentTarget;
            let localPos = this.globalToLocal(evt.stageX, evt.stageY);
            this.dragStartPos = new Point(localPos.x - target.x, localPos.y - target.y);
            this.stage.addEventListener("pressmove", this.moveSlider);
            this.stage.addEventListener("pressup", this.moveSliderFinish);
        };
        /**
         * スライダーのドラッグ中の処理
         * @param	evt
         */
        this.moveSlider = (e) => {
            const evt = e;
            let mousePos = this.limitSliderButtonPosition(evt);
            this.updateParts(mousePos);
            this._rate = this.changePixexToRate(mousePos);
            this.dispatchSliderEvent(SliderEventType.CHANGE);
        };
        /**
         * スライダーのドラッグ終了時の処理
         * @param	evt
         */
        this.moveSliderFinish = (e) => {
            this.isDragging = false;
            this.stage.removeEventListener("pressmove", this.moveSlider);
            this.stage.removeEventListener("pressup", this.moveSliderFinish);
            this.dispatchSliderEvent(SliderEventType.CHANGE_FINISH);
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
     */
    init(option) {
        option = SliderViewOption.init(option);
        this.bar = option.bar;
        this.slideButton = option.button;
        this.barMask = option.mask;
        this.base = option.base;
        this._minPosition = option.minPosition;
        this._maxPosition = option.maxPosition;
        this.isHorizontal = option.isHorizontal;
        this._rate = option.rate;
        this.swapBaseChildren();
        this.changeRate(this._rate);
    }
    /**
     * パーツの重なり順を適正化する。
     */
    swapBaseChildren() {
        this.addChildMe(this._base);
        this.addChildMe(this._bar);
        this.addChildMe(this._slideButton);
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
        this.updateSliderPositions();
        this.dispatchSliderEvent(SliderEventType.CHANGE);
    }
    /**
     * スライダーの位置を調整する。
     * changeRate関数の内部関数
     */
    updateSliderPositions() {
        const pos = this.changeRateToPixcel(this._rate);
        //各MCの位置、幅を調整
        this.updateParts(pos);
    }
    /**
     * スライダーボタンの位置を制限する関数
     * @return 制限で切り落とされたスライダーボタンの座標値
     */
    limitSliderButtonPosition(evt) {
        let mousePos = this.getMousePosition(this, evt);
        mousePos = this._maxPosition < mousePos ? this._maxPosition : mousePos;
        /*Math.min( _maxPosition, mousePos );*/
        mousePos = this._minPosition > mousePos ? this._minPosition : mousePos;
        /*Math.max( _minPosition, mousePos );*/
        return mousePos;
    }
    /**
     * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する
     * moveSliderの内部処理
     * @param	mousePos
     */
    updateParts(mousePos) {
        if (this._bar && !this._barMask)
            this.setSize(this._bar, Math.max(2.0, mousePos - this._minPosition));
        if (this._barMask) {
            this.setSize(this._barMask, mousePos - this.getPosition(this._barMask));
        }
        if (this._slideButton) {
            this.setPosition(this._slideButton, mousePos);
        }
    }
    /**
     * スライダーの変更に関するイベントを発行する
     * @param {SliderEventType} type
     */
    dispatchSliderEvent(type) {
        const e = new SliderEvent(type, this.rate);
        this.dispatchEvent(e);
    }
    /**
     * スライダーの地をクリックした際の処理
     * その位置までスライダーをジャンプする
     * @param {createjs.MouseEvent} evt
     */
    onPressBase(evt) {
        this.dragStartPos = new Point();
        this.moveSlider(evt);
        this.dispatchSliderEvent(SliderEventType.CHANGE_FINISH);
    }
    /**
     * スライダーの割合から、スライダーの位置を取得する
     * @param	rate
     * @return
     */
    changeRateToPixcel(rate) {
        let currentPix = ((this._maxPosition - this._minPosition) * rate) / SliderView.MAX_RATE +
            this._minPosition;
        currentPix =
            currentPix > this._minPosition ? currentPix : this._minPosition;
        /*Math.max( currentPix, _minPosition );*/
        currentPix =
            currentPix < this._maxPosition ? currentPix : this._maxPosition;
        /*Math.min( currentPix, _maxPosition );*/
        return currentPix;
    }
    /**
     * スライダーのX座標から、スライダーの割合を取得する
     * @param	pixel
     * @return
     */
    changePixexToRate(pixel) {
        let currentRate = ((pixel - this._minPosition) / (this._maxPosition - this._minPosition)) *
            SliderView.MAX_RATE;
        currentRate = currentRate > 0.0 ? currentRate : 0.0;
        /*Math.max( currentRate, 0.0 );*/
        currentRate =
            currentRate < SliderView.MAX_RATE ? currentRate : SliderView.MAX_RATE;
        /*Math.min( currentRate, SliderView.MAX_RATE );*/
        return currentRate;
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
        let localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);
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
    get base() {
        return this._base;
    }
    set bar(value) {
        if (!value)
            return;
        this._bar = value;
        if (this._barMask)
            this._bar.mask = this._barMask;
        this._bar.mouseEnabled = false;
        // this._bar.mouseChildren = false;
        this.addChildMe(value);
    }
    set slideButton(value) {
        if (!value)
            return;
        this._slideButton = value;
        this._slideButton.addEventListener("mousedown", this.startMove);
        this.addChildMe(value);
    }
    set barMask(value) {
        if (!value)
            return;
        this._barMask = value;
        if (this._bar)
            this._bar.mask = this._barMask;
        this._barMask.mouseEnabled = false;
        this.addChildMe(value);
    }
    set minPosition(value) {
        this._minPosition = value;
    }
    set maxPosition(value) {
        this._maxPosition = value;
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

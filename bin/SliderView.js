var Container = createjs.Container;
var Point = createjs.Point;
import { SliderEvent, SliderEventType } from "./SliderEvent";
/**
 * ui.slider.SliderView
 *
 * スライダーの汎用クラス
 *
 * 初期設定
 *   1.ベース、バー、ボタン、ベースマスクとその可動範囲をinit関数で設定する。
 *   2.初期値をrateで指定する。
 *
 * 使用上の注意
 *
 * オブジェクトのサイズの計測にgetBounds関数を使用しています。
 * shapeおよびContainerクラスでは、getBoundsの自動計測が効かない場合があるため
 * setBounds関数でサイズをあらかじめ与えてください。
 *
 * @author m_makino
 * @since 2017/05/31 16:09
 */
export class SliderView extends Container {
    ///////////////////////////
    //	Methods
    ///////////////////////////
    /**
     * コンストラクタ
     * @param {SliderViewInitOption} option
     */
    constructor(option) {
        super();
        this.dragStartPos = new createjs.Point();
        this.isDragging = false; // 現在スライド中か否か
        this.isHorizontal = true;
        this.isReverse = false;
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
            //現在のスライダー位置を算出
            let mousePos = this.limitSliderButtonPosition(evt);
            //各MCの位置、幅を調整
            this.updateParts(mousePos);
            //レートに反映
            this._rate = this.changePixexToRate(mousePos);
            //イベントを発行
            this.dispathSliderEvent(SliderEventType.CHANGE);
        };
        /**
         * スライダーのドラッグ終了時の処理
         * @param	evt
         */
        this.moveSliderFinish = (e) => {
            const evt = e;
            this.isDragging = false;
            this.stage.removeEventListener("pressmove", this.moveSlider);
            this.stage.removeEventListener("pressup", this.moveSliderFinish);
            this.dispathSliderEvent(SliderEventType.CHANGE_FINISH);
        };
        /**
         * スライダーの地をクリックしたときの処理
         * その位置までスライダーをジャンプする
         * @param	evt
         */
        this.pressBase = (evt) => {
            this.onPressBaseFunction(evt);
        };
        ///////////////////////////
        //	dispose
        ///////////////////////////
        /**
         * オブジェクトの廃棄処理
         * @param	e
         */
        this.dispose = (e) => {
            this.onDisposeFunction(e);
        };
        this.addEventListener("removed", this.dispose);
        this.init(option);
    }
    /**
     * 初期化処理
     */
    init(option) {
        option = SliderViewInitOption.init(option);
        this.bar = option.bar;
        this.slideButton = option.button;
        this.barMask = option.mask;
        this.base = option.base;
        this._minPosition = option.minPosition;
        this._maxPosition = option.maxPosition;
        this.isHorizontal = option.isHorizontal;
        this.isReverse = option.isReverse;
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
        if (obj) {
            if (obj.parent)
                obj.parent.removeChild(obj);
            this.addChild(obj);
        }
    }
    /**
     * スライダーの位置を変更する
     * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
     */
    changeRate(rate) {
        if (this.isDragging)
            return;
        if (!this.isReverse)
            this._rate = rate;
        else
            this._rate = SliderView.MAX_RATE - rate;
        this.updateSliderPositions();
        //イベントを発行
        this.dispathSliderEvent(SliderEventType.CHANGE);
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
            if (!this.isReverse)
                this.setSize(this._barMask, mousePos - this.getPosition(this._barMask));
            else
                this.setSize(this._barMask, this.getPosition(this._barMask) - mousePos);
        }
        if (this._slideButton)
            this.setPosition(this._slideButton, mousePos);
    }
    /**
     * スライダーの変更に関するイベントを発行する
     * @param	type
     */
    dispathSliderEvent(type) {
        let sliderEvent = new SliderEvent(type);
        let currentRate = this._rate;
        if (this.isReverse)
            currentRate = SliderView.MAX_RATE - this._rate;
        sliderEvent.rate = currentRate;
        this.dispatchEvent(sliderEvent);
    }
    onPressBaseFunction(evt) {
        this.dragStartPos = new Point();
        this.moveSlider(evt);
        this.dispathSliderEvent(SliderEventType.CHANGE_FINISH);
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
     * @param	displayObj
     * @return
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
    ///////////////////////////
    //	getter / setter
    ///////////////////////////
    set base(value) {
        if (!value)
            return;
        this._base = value;
        this._base.mouseEnabled = true;
        this._base.addEventListener("click", this.pressBase);
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
    onDisposeFunction(e) {
        this.removeEventListener("removed", this.dispose);
        this._base.removeEventListener("click", this.pressBase);
        this._slideButton.removeEventListener("mousedown", this.startMove);
        this._base = null;
        this._bar = null;
        this._barMask = null;
        this._slideButton = null;
    }
}
SliderView.MAX_RATE = 100.0;
/**
 * スライダーを初期化する際のオプション
 */
export class SliderViewInitOption {
    static init(option) {
        if (option.rate == null) {
            option.rate = 0.0;
        }
        if (option.isHorizontal == null) {
            option.isHorizontal = true;
        }
        if (option.isReverse == null) {
            option.isReverse = false;
        }
        this.check(option);
        return option;
    }
    static check(option) {
        const checkBounds = (displayObject) => {
            if (displayObject) {
                if (displayObject.getBounds() === null) {
                    throw new Error("初期化オプションで指定されたShapeにバウンディングボックスが存在しません。Shapeを利用する場合はsetBounds関数を利用してバウンディングボックスを手動で設定してください。");
                }
                if (displayObject.parent) {
                    console.warn("初期化オプションで指定されたパーツがすでに別の親にaddChildされています。SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。");
                }
            }
        };
        checkBounds(option.base);
        checkBounds(option.button);
        checkBounds(option.mask);
        checkBounds(option.bar);
    }
}

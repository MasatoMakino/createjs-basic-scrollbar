import { SliderEventType } from "./SliderEvent";
import { SliderView } from "./SliderView";
/**
 * スクロールバーを表すクラスです。
 *
 * このクラスは、スライダーに以下の機能を追加したものです。
 *
 * 		1.コンテンツサイズに合わせた、スクロールバーの伸縮
 * 		2.スクロールバーの伸縮にあわせた、移動範囲の制限
 * 		3.スクロールバーの伸縮にあわせた、移動値の取得
 *
 * 初期設定の注意
 * 		 スクロール対象とマスクは同一の親をもつこと。
 * 		 ローカル、グローバルの座標変換は行っていないので別の親をもつとスクロールが破たんします。
 * ...
 * @author m_makino
 * @since 2017/05/31 16:09
 */
export class ScrollBarView extends SliderView {
    constructor(option, scrollOption) {
        super(option);
        this.autoHide = false;
        /**
         * スライダーイベントに応じてコンテンツをスクロールする
         * @param {Object} e
         */
        this.updateContentsPosition = (e) => {
            const evt = e;
            this.updateContentsPositionWithRate(evt.rate);
        };
        ScrollBarViewInitOption.check(scrollOption);
        this.setTargetContents(scrollOption.targetContents);
        this.setContentsMask(scrollOption.contentsMask);
        this.changeRate(option.rate);
    }
    ///////////////////////////
    //	Methods
    ///////////////////////////
    /**
     * 初期化処理
     * @param {SliderViewInitOption} option
     */
    init(option) {
        super.init(option);
        this.initSliderButtonSize();
    }
    ///////////////////////////
    //	SliderButtonの移動範囲制限
    ///////////////////////////
    /**
     * スライダーボタンの位置を制限する関数
     * @return 制限で切り落とされたスライダーボタンの座標値
     */
    limitSliderButtonPosition(evt) {
        let mousePos = this.getMousePosition(this, evt);
        let sliderSize = this.slideButtonSize;
        mousePos = Math.min(this._maxPosition - sliderSize / 2, mousePos);
        mousePos = Math.max(this._minPosition + sliderSize / 2, mousePos);
        return mousePos;
    }
    ///////////////////////////
    //	ピクセル位置 <-> 割合の相互変換
    ///////////////////////////
    /**
     * スライダーの割合から、スライダーの位置を取得する
     * @param	rate
     * @return
     */
    changeRateToPixcel(rate) {
        let buttonSize = this.slideButtonSize;
        let currentMax = this._maxPosition - buttonSize / 2;
        let currentMin = this._minPosition + buttonSize / 2;
        let currentPix = ((currentMax - currentMin) * rate) / SliderView.MAX_RATE + currentMin;
        currentPix = Math.max(currentPix, currentMin);
        currentPix = Math.min(currentPix, currentMax);
        return currentPix;
    }
    /**
     * スライダーの座標から、スライダーの割合を取得する
     * @param	pixel
     * @return
     */
    changePixexToRate(pixel) {
        let buttonSize = this.slideButtonSize;
        let currentMax = this._maxPosition - buttonSize / 2;
        let currentMin = this._minPosition + buttonSize / 2;
        let currentRate = ((pixel - currentMin) / (currentMax - currentMin)) * SliderView.MAX_RATE;
        currentRate = Math.max(currentRate, 0.0);
        currentRate = Math.min(currentRate, SliderView.MAX_RATE);
        return currentRate;
    }
    ///////////////////////////
    //	スライドバーのサイズ更新
    ///////////////////////////
    get slideButtonSize() {
        this.updateSlideButtonSize();
        return this.getSize(this._slideButton);
    }
    /**
     * スクロールバーのボタンサイズ及び位置を更新する。
     * コンテンツサイズが変更された場合の更新にも利用する。
     */
    initSliderButtonSize() {
        if (!this._slideButton || !this._targetContents || !this._contentsMask) {
            return;
        }
        this.updateSlideButtonSize();
        this.initSliderPosition();
        if (this.hasEventListener(SliderEventType.CHANGE))
            return;
        this.addEventListener(SliderEventType.CHANGE, this.updateContentsPosition);
    }
    initSliderPosition() {
        let zeroPos = this.getPosition(this._contentsMask);
        let contentsPos = this.getPosition(this._targetContents);
        let posDif = zeroPos - contentsPos;
        let sizeDif = this.getSize(this._targetContents) - this.getSize(this._contentsMask);
        this.changeRate((posDif / sizeDif) * SliderView.MAX_RATE);
    }
    updateSlideButtonSize() {
        if (!this._targetContents || !this._contentsMask || !this._slideButton) {
            return;
        }
        let fullSize = this._maxPosition - this._minPosition;
        let contentsSize = this.getSize(this._targetContents);
        let maskSize = this.getSize(this._contentsMask);
        let sliderSize = (fullSize * maskSize) / contentsSize;
        if (sliderSize > fullSize) {
            sliderSize = fullSize;
        }
        this.setSize(this._slideButton, sliderSize);
        //autoHideの条件に一致するかを判定し、表示を切り替える。
        this._slideButton.visible = this._slideButton.mouseEnabled = !this.isHide;
        // buttonMode = useHandCursor = !isHide;
        // _slideButton.buttonMode = this._slideButton.useHandCursor = !isHide;
    }
    /**
     * autoHideの条件に一致するかを判定する
     */
    get isHide() {
        //autoHideが設定されていない場合は常に表示
        if (!this.autoHide)
            return false;
        let fullSize = this._maxPosition - this._minPosition;
        let contentsSize = this.getSize(this._targetContents);
        let maskSize = this.getSize(this._contentsMask);
        //マスク、コンテンツ、スクロール幅のいずれかが0以下の場合スライダーを隠す
        if (contentsSize < 0 || maskSize < 0 || fullSize < 0) {
            return true;
        }
        //マスクサイズとコンテンツサイズが同一の場合スライダーを隠す
        return this.getSize(this._slideButton) == fullSize;
    }
    /**
     * rate値を元にコンテンツをスクロールする。
     * @param {number} rate
     */
    updateContentsPositionWithRate(rate) {
        const zeroPos = this.getPosition(this._contentsMask);
        const nextPos = zeroPos -
            (rate / SliderView.MAX_RATE) *
                (this.getSize(this._targetContents) - this.getSize(this._contentsMask));
        this.setPosition(this._targetContents, nextPos);
    }
    onPressBaseFunction(evt) {
        if (this.isHide)
            return;
        super.onPressBaseFunction(evt);
    }
    ///////////////////////////
    //	getter / setter
    ///////////////////////////
    get targetContents() {
        return this._targetContents;
    }
    setTargetContents(value) {
        this._targetContents = value;
        this.initSliderButtonSize();
    }
    get contentsMask() {
        return this._contentsMask;
    }
    setContentsMask(value) {
        this._contentsMask = value;
        this.initSliderButtonSize();
    }
    onDisposeFunction(e) {
        this.removeEventListener(SliderEventType.CHANGE, this.updateContentsPosition);
        this._targetContents = null;
        this._contentsMask = null;
        super.onDisposeFunction(e);
    }
}
/**
 * スクロールバーの初期化時に必須となる項目をまとめたオブジェクト
 * スクロール対象とスクロールエリアのマスクを指定する。
 */
export class ScrollBarViewInitOption {
    static check(option) {
        if (option.contentsMask.parent != option.contentsMask.parent) {
            console.warn("ScrollBarView : スクロールするコンテンツと、そのマスクは同一の親を持っている必要があります。", option.targetContents, option.contentsMask);
        }
    }
}

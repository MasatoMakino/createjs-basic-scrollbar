import DisplayObject = createjs.DisplayObject;
import { SliderEvent, SliderEventType } from "./SliderEvent";
import { SliderView, SliderViewInitOption } from "./SliderView";

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
  protected _targetContents: DisplayObject;
  protected _contentsMask: DisplayObject;
  public autoHide: Boolean = false;

  constructor(
    option: SliderViewInitOption,
    scrollOption: ScrollBarViewInitOption
  ) {
    super(option);

    if (scrollOption.contentsMask.parent != scrollOption.contentsMask.parent) {
      console.warn(
        "ScrollBarView : スクロールするコンテンツと、そのマスクは同一の親を持っている必要があります。",
        scrollOption.targetContents,
        scrollOption.contentsMask
      );
    }
    this.setTargetContents(scrollOption.targetContents);
    this.setContentsMask(scrollOption.contentsMask);

    if (this._rate) {
      this.updateContentsPositionWithRate(this._rate);
    }
  }

  ///////////////////////////
  //	Methods
  ///////////////////////////

  /**
   * 初期化処理
   * @param {SliderViewInitOption} option
   */
  protected init(option: SliderViewInitOption): void {
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
  protected limitSliderButtonPosition(evt: createjs.MouseEvent): number {
    let mousePos: number = this.getMousePosition(this, evt);
    let sliderSize: number = this.slideButtonSize;

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
  protected changeRateToPixcel(rate: number): number {
    let buttonSize: number = this.slideButtonSize;
    let currentMax: number = this._maxPosition - buttonSize / 2;
    let currentMin: number = this._minPosition + buttonSize / 2;

    let currentPix: number =
      ((currentMax - currentMin) * rate) / SliderView.MAX_RATE + currentMin;
    currentPix = Math.max(currentPix, currentMin);
    currentPix = Math.min(currentPix, currentMax);
    return currentPix;
  }

  /**
   * スライダーの座標から、スライダーの割合を取得する
   * @param	pixel
   * @return
   */
  protected changePixexToRate(pixel: number): number {
    let buttonSize: number = this.slideButtonSize;
    let currentMax: number = this._maxPosition - buttonSize / 2;
    let currentMin: number = this._minPosition + buttonSize / 2;

    let currentRate: number =
      ((pixel - currentMin) / (currentMax - currentMin)) * SliderView.MAX_RATE;
    currentRate = Math.max(currentRate, 0.0);
    currentRate = Math.min(currentRate, SliderView.MAX_RATE);
    return currentRate;
  }

  ///////////////////////////
  //	スライドバーのサイズ更新
  ///////////////////////////

  get slideButtonSize(): number {
    this.updateSlideButtonSize();
    return this.getSize(this._slideButton);
  }

  /**
   * スクロールバーのボタンサイズ及び位置を更新する。
   * コンテンツサイズが変更された場合の更新にも利用する。
   */
  public initSliderButtonSize(): void {
    if (this._slideButton && this._targetContents && this._contentsMask) {
      this.updateSlideButtonSize();
      this.initSliderPosition();
      this.addEventListener(
        SliderEventType.CHANGE,
        this.updateContentsPosition
      );
    }
  }

  protected initSliderPosition(): void {
    let zeroPos: number = this.getPosition(this._contentsMask);
    let contentsPos: number = this.getPosition(this._targetContents);

    let posDif: number = zeroPos - contentsPos;
    let sizeDif: number =
      this.getSize(this._targetContents) - this.getSize(this._contentsMask);

    this.changeRate((posDif / sizeDif) * SliderView.MAX_RATE);
  }

  protected updateSlideButtonSize(): void {
    let fullSize: number = this._maxPosition - this._minPosition;

    let contentsSize: number = this.getSize(this._targetContents);
    let maskSize: number = this.getSize(this._contentsMask);

    let sliderSize: number = (fullSize * maskSize) / contentsSize;
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
  protected get isHide(): boolean {
    //autoHideが設定されていない場合は常に表示
    if (!this.autoHide) return false;

    let fullSize: number = this._maxPosition - this._minPosition;
    let contentsSize: number = this.getSize(this._targetContents);
    let maskSize: number = this.getSize(this._contentsMask);

    //マスク、コンテンツ、スクロール幅のいずれかが0以下の場合スライダーを隠す
    if (contentsSize < 0 || maskSize < 0 || fullSize < 0) {
      return true;
    }

    //マスクサイズとコンテンツサイズが同一の場合スライダーを隠す
    return this.getSize(this._slideButton) == fullSize;
  }

  /**
   * スライダーイベントに応じてコンテンツをスクロールする
   * @param {Object} e
   */
  public updateContentsPosition = (e: Object) => {
    const evt = e as SliderEvent;
    this.updateContentsPositionWithRate(evt.rate);
  };

  /**
   * rate値を元にコンテンツをスクロールする。
   * @param {number} rate
   */
  protected updateContentsPositionWithRate(rate: number): void {
    const zeroPos: number = this.getPosition(this._contentsMask);
    const nextPos: number =
      zeroPos -
      (rate / SliderView.MAX_RATE) *
        (this.getSize(this._targetContents) - this.getSize(this._contentsMask));
    this.setPosition(this._targetContents, nextPos);
  }

  protected onPressBaseFunction(evt: createjs.MouseEvent): void {
    if (this.isHide) return;
    super.onPressBaseFunction(evt);
  }

  ///////////////////////////
  //	getter / setter
  ///////////////////////////

  public get targetContents(): DisplayObject {
    return this._targetContents;
  }

  protected setTargetContents(value: DisplayObject) {
    this._targetContents = value;
    this.initSliderButtonSize();
  }

  public get contentsMask(): DisplayObject {
    return this._contentsMask;
  }

  protected setContentsMask(value: DisplayObject) {
    this._contentsMask = value;
    this.initSliderButtonSize();
  }

  protected onDisposeFunction(e?: Event): void {
    this.removeEventListener(
      SliderEventType.CHANGE,
      this.updateContentsPosition
    );
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
  targetContents: DisplayObject; //スクロールバーによって操作されるコンテンツ
  contentsMask: DisplayObject; //スクロールバーが対象とするコンテンツが表示されるエリア
}

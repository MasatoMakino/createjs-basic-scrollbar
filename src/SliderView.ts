import Container = createjs.Container;
import DisplayObject = createjs.DisplayObject;
import Point = createjs.Point;
import Shape = createjs.Shape;
import { SliderEvent, SliderEventType } from "./SliderEvent";

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
  protected _base: DisplayObject; // スライダーの地
  protected _bar?: DisplayObject; // スライドにあわせて表示されるバー
  protected _barMask?: Shape; // バーのマスク
  protected _slideButton: DisplayObject; // スライドボタン

  protected _minPosition: number; // スライダーボタンの座標の最小値
  protected _maxPosition: number; // スライダーボタンの座標の最大値

  protected dragStartPos: createjs.Point = new createjs.Point();

  protected _rate: number; // 現在のスライダーの位置の割合 MIN 0.0 ~ MAX 100.0
  public static readonly MAX_RATE: number = 100.0;

  protected isDragging: Boolean = false; // 現在スライド中か否か
  public isHorizontal: Boolean = true;
  public isReverse: Boolean = false;

  /**
   * コンストラクタ
   * @param {SliderViewInitOption} option
   */
  constructor(option: SliderViewInitOption) {
    super();
    this.addEventListener("removed", this.dispose);
    this.init(option);
  }

  /**
   * 初期化処理
   */
  protected init(option: SliderViewInitOption): void {
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
  private swapBaseChildren(): void {
    this.addChildMe(this._base);
    this.addChildMe(this._bar);
    this.addChildMe(this._slideButton);
  }

  private addChildMe(obj: DisplayObject): void {
    if (obj) {
      if (obj.parent) obj.parent.removeChild(obj);
      this.addChild(obj);
    }
  }

  /**
   * スライダーの位置を変更する
   * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
   */
  public changeRate(rate: number): void {
    if (this.isDragging) return;

    if (!this.isReverse) this._rate = rate;
    else this._rate = SliderView.MAX_RATE - rate;

    this.updateSliderPositions();

    //イベントを発行
    this.dispathSliderEvent(SliderEventType.CHANGE);
  }
  /**
   * スライダーの位置を調整する。
   * changeRate関数の内部関数
   */
  private updateSliderPositions(): void {
    const pos: number = this.changeRateToPixcel(this._rate);
    //各MCの位置、幅を調整
    this.updateParts(pos);
  }

  /**
   * スライダーのドラッグを開始する
   * @param	evt
   */
  private startMove = (e: Object) => {
    const evt = e as createjs.MouseEvent;

    this.isDragging = true;
    const target: DisplayObject = evt.currentTarget as DisplayObject;

    let localPos = this.globalToLocal(evt.stageX, evt.stageY);
    this.dragStartPos = new Point(localPos.x - target.x, localPos.y - target.y);

    this.stage.addEventListener("pressmove", this.moveSlider);
    this.stage.addEventListener("pressup", this.moveSliderFinish);
  };

  /**
   * スライダーのドラッグ中の処理
   * @param	evt
   */
  private moveSlider = (e: any) => {
    const evt = e as createjs.MouseEvent;
    //現在のスライダー位置を算出
    let mousePos: number = this.limitSliderButtonPosition(evt);

    //各MCの位置、幅を調整
    this.updateParts(mousePos);

    //レートに反映
    this._rate = this.changePixexToRate(mousePos);

    //イベントを発行
    this.dispathSliderEvent(SliderEventType.CHANGE);
  };

  /**
   * スライダーボタンの位置を制限する関数
   * @return 制限で切り落とされたスライダーボタンの座標値
   */
  protected limitSliderButtonPosition(evt: createjs.MouseEvent): number {
    let mousePos: number = this.getMousePosition(this, evt);
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
  private updateParts(mousePos: number): void {
    if (this._bar && !this._barMask)
      this.setSize(this._bar, Math.max(2.0, mousePos - this._minPosition));
    if (this._barMask) {
      if (!this.isReverse)
        this.setSize(this._barMask, mousePos - this.getPosition(this._barMask));
      else
        this.setSize(this._barMask, this.getPosition(this._barMask) - mousePos);
    }
    if (this._slideButton) this.setPosition(this._slideButton, mousePos);
  }

  /**
   * スライダーの変更に関するイベントを発行する
   * @param	type
   */
  protected dispathSliderEvent(type: SliderEventType): void {
    let sliderEvent: SliderEvent = new SliderEvent(type);
    let currentRate: number = this._rate;
    if (this.isReverse) currentRate = SliderView.MAX_RATE - this._rate;
    sliderEvent.rate = currentRate;
    this.dispatchEvent(sliderEvent);
  }

  /**
   * スライダーのドラッグ終了時の処理
   * @param	evt
   */
  protected moveSliderFinish = (e: Object) => {
    const evt = e as createjs.MouseEvent;
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
  protected pressBase = (evt: Object) => {
    this.onPressBaseFunction(evt as createjs.MouseEvent);
  };

  protected onPressBaseFunction(evt: createjs.MouseEvent): void {
    this.dragStartPos = new Point();
    this.moveSlider(evt);
    this.dispathSliderEvent(SliderEventType.CHANGE_FINISH);
  }

  /**
   * スライダーの割合から、スライダーの位置を取得する
   * @param	rate
   * @return
   */
  protected changeRateToPixcel(rate: number): number {
    let currentPix: number =
      ((this._maxPosition - this._minPosition) * rate) / SliderView.MAX_RATE +
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
  protected changePixexToRate(pixel: number): number {
    let currentRate: number =
      ((pixel - this._minPosition) / (this._maxPosition - this._minPosition)) *
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
  protected getPosition(displayObj: DisplayObject): number {
    if (this.isHorizontal) {
      return displayObj.x;
    } else {
      return displayObj.y;
    }
  }

  /**
   * ディスプレイオブジェクトにスクロール方向の座標地を設定する
   * @param	displayObj
   * @param	position
   */
  protected setPosition(displayObj: DisplayObject, position: number): void {
    if (this.isHorizontal) {
      displayObj.x = position;
    } else {
      displayObj.y = position;
    }
  }

  /**
   * スクロール方向のマウス座標を取得する
   * limitSliderButtonPosition内の処理
   * @param	displayObj
   * @return
   */
  protected getMousePosition(
    displayObj: DisplayObject,
    evt: createjs.MouseEvent
  ): number {
    let localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);

    if (this.isHorizontal) {
      return localPos.x - this.dragStartPos.x;
    } else {
      return localPos.y - this.dragStartPos.y;
    }
  }

  /**
   * スクロール方向の高さ、もしくは幅を取得する
   * @param	displayObj
   * @return
   */
  protected getSize(displayObj: DisplayObject): number {
    const size = displayObj.getBounds();
    if (this.isHorizontal) {
      return size.width * displayObj.scaleX;
    } else {
      return size.height * displayObj.scaleY;
    }
  }

  /**
   * スクロール方向の高さ、もしくは幅を設定する
   * @param	displayObj
   * @return
   */
  protected setSize(displayObj: DisplayObject, amount: number): void {
    const size = displayObj.getBounds();

    if (this.isHorizontal) {
      displayObj.scaleX = amount / size.width;
    } else {
      displayObj.scaleY = amount / size.height;
    }
  }

  ///////////////////////////
  //	getter / setter
  ///////////////////////////

  public set base(value: DisplayObject) {
    if (!value) return;
    this._base = value;
    this._base.mouseEnabled = true;
    this._base.addEventListener("click", this.pressBase);
    this.addChildMe(value);
  }

  public get base(): DisplayObject {
    return this._base;
  }

  public set bar(value: DisplayObject) {
    if (!value) return;

    this._bar = value;
    if (this._barMask) this._bar.mask = this._barMask;
    this._bar.mouseEnabled = false;
    // this._bar.mouseChildren = false;
    this.addChildMe(value);
  }

  public set slideButton(value: DisplayObject) {
    if (!value) return;

    this._slideButton = value;
    this._slideButton.addEventListener("mousedown", this.startMove);
    this.addChildMe(value);
  }

  public set barMask(value: Shape) {
    if (!value) return;

    this._barMask = value;
    if (this._bar) this._bar.mask = this._barMask;
    this._barMask.mouseEnabled = false;
    this.addChildMe(value);
  }

  public set minPosition(value: number) {
    this._minPosition = value;
  }

  public set maxPosition(value: number) {
    this._maxPosition = value;
  }

  public get rate() {
    return this._rate;
  }

  /**
   * オブジェクトの廃棄処理
   * @param	e
   */
  public dispose = (e?: any) => {
    this.onDisposeFunction(e as Event);
  };

  protected onDisposeFunction(e?: Event): void {
    this.removeEventListener("removed", this.dispose);

    this._base.removeEventListener("click", this.pressBase);
    this._slideButton.removeEventListener("mousedown", this.startMove);

    this._base = null;
    this._bar = null;
    this._barMask = null;
    this._slideButton = null;
  }
}

/**
 * スライダーを初期化する際のオプション
 */
export class SliderViewInitOption {
  minPosition: number; //スライダーボタンの座標の最小値
  maxPosition: number; //スライダーボタンの座標の最大値
  rate?: number;
  base: DisplayObject; //スライダーの地
  button: DisplayObject; //スライドボタン
  mask?: Shape; //バーのマスク 既定値 null
  bar?: DisplayObject; //スライドにあわせて表示されるバー 既定値 null
  isHorizontal?: boolean; //水平スクロールか否か 既定値 true
  isReverse?: boolean; //反転スクロールか否か 既定値 false

  public static init(option: SliderViewInitOption): SliderViewInitOption {
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

  protected static check(option: SliderViewInitOption): void {
    const checkBounds = (displayObject?: DisplayObject) => {
      if (displayObject) {
        if (displayObject.getBounds() === null) {
          throw new Error(
            "初期化オプションで指定されたShapeにバウンディングボックスが存在しません。Shapeを利用する場合はsetBounds関数を利用してバウンディングボックスを手動で設定してください。"
          );
        }

        if (displayObject.parent) {
          console.warn(
            "初期化オプションで指定されたパーツがすでに別の親にaddChildされています。SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。"
          );
        }
      }
    };

    checkBounds(option.base);
    checkBounds(option.button);
    checkBounds(option.mask);
    checkBounds(option.bar);
  }
}

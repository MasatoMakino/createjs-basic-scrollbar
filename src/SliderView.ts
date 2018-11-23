import Container = createjs.Container;
import DisplayObject = createjs.DisplayObject;
import Point = createjs.Point;
import Shape = createjs.Shape;
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
  protected _base: DisplayObject; // スライダーの地
  protected _bar?: DisplayObject; // スライドにあわせて表示されるバー
  protected _barMask?: Shape; // バーのマスク
  protected _slideButton: DisplayObject; // スライドボタン

  protected _minPosition: number; // スライダーボタンの座標の最小値
  protected _maxPosition: number; // スライダーボタンの座標の最大値
  protected isHorizontal: boolean = true;

  protected dragStartPos: createjs.Point = new createjs.Point();
  /**
   * 現在のスライダーの位置の割合。
   * MIN 0.0 ~ SliderView.MAX_RATE。
   */
  private _rate: number;
  public static readonly MAX_RATE: number = 100.0;
  private isDragging: Boolean = false; // 現在スライド中か否か

  /**
   * @param {SliderViewOption} option
   */
  constructor(option: SliderViewOption) {
    super();
    this.init(option);
  }

  /**
   * 初期化処理
   * @param {SliderViewOption} option
   */
  protected init(option: SliderViewOption): void {
    option = SliderViewOption.init(option);

    this.base = option.base;
    this._bar = this.initBarAndMask(option.bar);
    this.slideButton = option.button;
    this._barMask = this.initBarAndMask(option.mask) as Shape;
    if (this._bar && this._barMask) this._bar.mask = this._barMask;

    this._minPosition = option.minPosition;
    this._maxPosition = option.maxPosition;
    this.isHorizontal = option.isHorizontal;
    this._rate = option.rate;

    this.changeRate(this._rate);
  }

  private addChildMe(obj: DisplayObject): void {
    if (!obj) return;
    if (obj.parent) obj.parent.removeChild(obj);
    this.addChild(obj);
  }

  /**
   * スライダーの位置を変更する
   * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
   */
  public changeRate(rate: number): void {
    //ドラッグ中は外部からの操作を無視する。
    if (this.isDragging) return;

    this._rate = rate;
    const pos: number = this.changeRateToPixel(this._rate);
    this.updateParts(pos);

    this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE, this.rate));
  }

  /**
   * スライダーのドラッグを開始する
   * @param {Object} e
   */
  private startMove = (e: Object) => {
    const evt = e as createjs.MouseEvent;

    this.isDragging = true;
    const target: DisplayObject = evt.currentTarget as DisplayObject;

    const localPos = this.globalToLocal(evt.stageX, evt.stageY);
    this.dragStartPos = new Point(localPos.x - target.x, localPos.y - target.y);

    this.stage.addEventListener("pressmove", this.moveSlider);
    this.stage.addEventListener("pressup", this.moveSliderFinish);
  };

  /**
   * スライダーのドラッグ中の処理
   * @param e
   */
  private moveSlider = (e: any) => {
    const evt = e as createjs.MouseEvent;
    const mousePos: number = this.limitSliderButtonPosition(evt);

    this.updateParts(mousePos);

    this._rate = this.changePixelToRate(mousePos);
    this.dispatchEvent(new SliderEvent(SliderEventType.CHANGE, this.rate));
  };

  /**
   * スライダーボタンの位置を制限する関数
   * @return 制限で切り落とされたスライダーボタンの座標値
   */
  protected limitSliderButtonPosition(evt: createjs.MouseEvent): number {
    let mousePos: number = this.getMousePosition(this, evt);
    mousePos = Math.min(this._maxPosition, mousePos);
    mousePos = Math.max(this._minPosition, mousePos);
    return mousePos;
  }

  /**
   * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する
   * moveSliderの内部処理
   * @param	mousePos
   */
  private updateParts(mousePos: number): void {
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
   * スライダーのドラッグ終了時の処理
   * @param	e
   */
  private moveSliderFinish = (e: Object) => {
    this.isDragging = false;
    this.stage.removeEventListener("pressmove", this.moveSlider);
    this.stage.removeEventListener("pressup", this.moveSliderFinish);
    this.dispatchEvent(
      new SliderEvent(SliderEventType.CHANGE_FINISH, this.rate)
    );
  };

  /**
   * スライダーの地をクリックした際の処理
   * その位置までスライダーをジャンプする
   * @param {createjs.MouseEvent} evt
   */
  protected onPressBase(evt: createjs.MouseEvent): void {
    this.dragStartPos = new Point();
    this.moveSlider(evt);
    this.dispatchEvent(
      new SliderEvent(SliderEventType.CHANGE_FINISH, this.rate)
    );
  }

  /**
   * スライダーの割合から、スライダーの位置を取得する
   * @param	rate
   * @return
   */
  protected changeRateToPixel(rate: number): number {
    let pix: number =
      ((this._maxPosition - this._minPosition) * rate) / SliderView.MAX_RATE +
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
  protected changePixelToRate(pixel: number): number {
    const min = this._minPosition;
    const max = this._maxPosition;
    let rate: number = ((pixel - min) / (max - min)) * SliderView.MAX_RATE;

    rate = Math.max(rate, 0.0);
    rate = Math.min(rate, SliderView.MAX_RATE);
    return rate;
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
    if (!displayObj) return;

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
    const localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);

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
   * @param {createjs.DisplayObject} displayObj
   * @param {number} amount
   */
  protected setSize(displayObj: DisplayObject, amount: number): void {
    const size = displayObj.getBounds();

    if (this.isHorizontal) {
      displayObj.scaleX = amount / size.width;
    } else {
      displayObj.scaleY = amount / size.height;
    }
  }

  private set base(value: DisplayObject) {
    if (!value) return;

    this._base = value;
    this._base.mouseEnabled = true;
    this._base.addEventListener("click", e => {
      this.onPressBase(e as createjs.MouseEvent);
    });
    this.addChildMe(value);
  }

  private initBarAndMask(value: DisplayObject): DisplayObject {
    if (value == null) return;
    value.mouseEnabled = false;
    this.addChildMe(value);
    return value;
  }

  private set slideButton(value: DisplayObject) {
    if (!value) return;

    this._slideButton = value;
    this._slideButton.addEventListener("mousedown", this.startMove);
    this.addChildMe(value);
  }

  get rate() {
    return this._rate;
  }

  /**
   * このインスタンスを破棄する。
   * @param	e
   */
  public dispose = (e?: any) => {
    this.onDisposeFunction(e as Event);
  };

  /**
   * 全てのDisplayObjectとEventListenerを解除する。
   * @param {Event} e
   */
  protected onDisposeFunction(e?: Event): void {
    this.removeAllEventListeners();
    this._base.removeAllEventListeners();
    this._slideButton.removeAllEventListeners();
    this.removeAllChildren();
  }
}

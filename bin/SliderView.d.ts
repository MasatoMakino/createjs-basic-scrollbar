/// <reference types="easeljs" />
import Container = createjs.Container;
import DisplayObject = createjs.DisplayObject;
import Shape = createjs.Shape;
import { SliderEventType } from "./SliderEvent";
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
export declare class SliderView extends Container {
    protected _base: DisplayObject;
    protected _bar?: DisplayObject;
    protected _barMask?: Shape;
    protected _slideButton: DisplayObject;
    protected _minPosition: number;
    protected _maxPosition: number;
    protected dragStartPos: createjs.Point;
    protected _rate: number;
    static readonly MAX_RATE: number;
    protected isDragging: Boolean;
    isHorizontal: Boolean;
    isReverse: Boolean;
    /**
     * コンストラクタ
     * @param {SliderViewOption} option
     */
    constructor(option: SliderViewOption);
    /**
     * 初期化処理
     */
    protected init(option: SliderViewOption): void;
    /**
     * パーツの重なり順を適正化する。
     */
    private swapBaseChildren;
    private addChildMe;
    /**
     * スライダーの位置を変更する
     * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
     */
    changeRate(rate: number): void;
    /**
     * スライダーの位置を調整する。
     * changeRate関数の内部関数
     */
    private updateSliderPositions;
    /**
     * スライダーのドラッグを開始する
     * @param	evt
     */
    private startMove;
    /**
     * スライダーのドラッグ中の処理
     * @param	evt
     */
    private moveSlider;
    /**
     * スライダーボタンの位置を制限する関数
     * @return 制限で切り落とされたスライダーボタンの座標値
     */
    protected limitSliderButtonPosition(evt: createjs.MouseEvent): number;
    /**
     * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する
     * moveSliderの内部処理
     * @param	mousePos
     */
    private updateParts;
    /**
     * スライダーの変更に関するイベントを発行する
     * @param	type
     */
    protected dispathSliderEvent(type: SliderEventType): void;
    /**
     * スライダーのドラッグ終了時の処理
     * @param	evt
     */
    protected moveSliderFinish: (e: Object) => void;
    /**
     * スライダーの地をクリックしたときの処理
     * その位置までスライダーをジャンプする
     * @param	evt
     */
    protected pressBase: (evt: Object) => void;
    protected onPressBaseFunction(evt: createjs.MouseEvent): void;
    /**
     * スライダーの割合から、スライダーの位置を取得する
     * @param	rate
     * @return
     */
    protected changeRateToPixcel(rate: number): number;
    /**
     * スライダーのX座標から、スライダーの割合を取得する
     * @param	pixel
     * @return
     */
    protected changePixexToRate(pixel: number): number;
    /**
     * ディスプレイオブジェクトからスクロール方向の座標値を取り出す
     * @param	displayObj
     * @return
     */
    protected getPosition(displayObj: DisplayObject): number;
    /**
     * ディスプレイオブジェクトにスクロール方向の座標地を設定する
     * @param	displayObj
     * @param	position
     */
    protected setPosition(displayObj: DisplayObject, position: number): void;
    /**
     * スクロール方向のマウス座標を取得する
     * limitSliderButtonPosition内の処理
     * @param	displayObj
     * @return
     */
    protected getMousePosition(displayObj: DisplayObject, evt: createjs.MouseEvent): number;
    /**
     * スクロール方向の高さ、もしくは幅を取得する
     * @param	displayObj
     * @return
     */
    protected getSize(displayObj: DisplayObject): number;
    /**
     * スクロール方向の高さ、もしくは幅を設定する
     * @param	displayObj
     * @return
     */
    protected setSize(displayObj: DisplayObject, amount: number): void;
    base: DisplayObject;
    bar: DisplayObject;
    slideButton: DisplayObject;
    barMask: Shape;
    minPosition: number;
    maxPosition: number;
    readonly rate: number;
    /**
     * オブジェクトの廃棄処理
     * @param	e
     */
    dispose: (e?: any) => void;
    protected onDisposeFunction(e?: Event): void;
}
//# sourceMappingURL=SliderView.d.ts.map
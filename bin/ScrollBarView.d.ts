/// <reference types="easeljs" />
import DisplayObject = createjs.DisplayObject;
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
export declare class ScrollBarView extends SliderView {
  protected _targetContents: DisplayObject;
  protected _contentsMask: DisplayObject;
  autoHide: Boolean;
  constructor(
    option: SliderViewInitOption,
    scrollOption: ScrollBarViewInitOption
  );
  /**
   * 初期化処理
   * @param {SliderViewInitOption} option
   */
  protected init(option: SliderViewInitOption): void;
  /**
   * スライダーボタンの位置を制限する関数
   * @return 制限で切り落とされたスライダーボタンの座標値
   */
  protected limitSliderButtonPosition(evt: createjs.MouseEvent): number;
  /**
   * スライダーの割合から、スライダーの位置を取得する
   * @param	rate
   * @return
   */
  protected changeRateToPixcel(rate: number): number;
  /**
   * スライダーの座標から、スライダーの割合を取得する
   * @param	pixel
   * @return
   */
  protected changePixexToRate(pixel: number): number;
  readonly slideButtonSize: number;
  /**
   * スクロールバーのボタンサイズ及び位置を更新する。
   * コンテンツサイズが変更された場合の更新にも利用する。
   */
  initSliderButtonSize(): void;
  protected initSliderPosition(): void;
  protected updateSlideButtonSize(): void;
  /**
   * autoHideの条件に一致するかを判定する
   */
  protected readonly isHide: boolean;
  /**
   * スライダーイベントに応じてコンテンツをスクロールする
   * @param {Object} e
   */
  updateContentsPosition: (e: Object) => void;
  /**
   * rate値を元にコンテンツをスクロールする。
   * @param {number} rate
   */
  protected updateContentsPositionWithRate(rate: number): void;
  protected onPressBaseFunction(evt: createjs.MouseEvent): void;
  readonly targetContents: DisplayObject;
  protected setTargetContents(value: DisplayObject): void;
  readonly contentsMask: DisplayObject;
  protected setContentsMask(value: DisplayObject): void;
  protected onDisposeFunction(e?: Event): void;
}
/**
 * スクロールバーの初期化時に必須となる項目をまとめたオブジェクト
 * スクロール対象とスクロールエリアのマスクを指定する。
 */
export declare class ScrollBarViewInitOption {
  targetContents: DisplayObject;
  contentsMask: DisplayObject;
}
//# sourceMappingURL=ScrollBarView.d.ts.map

/// <reference types="easeljs" />
/**
 * スライダーを初期化する際のオプション
 */
import DisplayObject = createjs.DisplayObject;
import Shape = createjs.Shape;
export declare class SliderViewOption {
  minPosition: number;
  maxPosition: number;
  rate?: number;
  base: DisplayObject;
  button: DisplayObject;
  mask?: Shape;
  bar?: DisplayObject;
  isHorizontal?: boolean;
  static init(option: SliderViewOption): SliderViewOption;
  protected static check(option: SliderViewOption): void;
  private static checkParts;
}
//# sourceMappingURL=SliderViewOption.d.ts.map

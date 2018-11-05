/**
 * スライダーを初期化する際のオプション
 */
import DisplayObject = createjs.DisplayObject;
import Shape = createjs.Shape;

export class SliderViewOption {
  minPosition: number; //スライダーボタンの座標の最小値
  maxPosition: number; //スライダーボタンの座標の最大値
  rate?: number;
  base: DisplayObject; //スライダーの地
  button: DisplayObject; //スライドボタン
  mask?: Shape; //バーのマスク 既定値 null
  bar?: DisplayObject; //スライドにあわせて表示されるバー 既定値 null
  isHorizontal?: boolean; //水平スクロールか否か 既定値 true
  isReverse?: boolean; //反転スクロールか否か 既定値 false

  public static init(option: SliderViewOption): SliderViewOption {
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

  protected static check(option: SliderViewOption): void {
    this.checkParts(option.base);
    this.checkParts(option.button);
    this.checkParts(option.mask);
    this.checkParts(option.bar);
  }

  private static checkParts(obj?: DisplayObject): void {
    if (obj == null) return;

    if (obj.getBounds() === null) {
      throw new Error(
        "初期化オプションで指定されたShapeにバウンディングボックスが存在しません。" +
          "Shapeを利用する場合はsetBounds関数を利用して" +
          "バウンディングボックスを手動で設定してください。"
      );
    }

    if (obj.parent) {
      console.warn(
        "初期化オプションで指定されたパーツがすでに別の親にaddChildされています。" +
          "SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。"
      );
    }
  }
}

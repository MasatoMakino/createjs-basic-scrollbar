export class SliderViewOption {
    static init(option) {
        if (option.rate == null) {
            option.rate = 0.0;
        }
        if (option.isHorizontal == null) {
            option.isHorizontal = true;
        }
        this.check(option);
        return option;
    }
    static check(option) {
        this.checkParts(option.base, "base");
        this.checkParts(option.button, "button");
        this.checkParts(option.mask, "mask");
        this.checkParts(option.bar, "bar");
    }
    static checkParts(obj, targetName) {
        if (obj == null)
            return;
        if (obj.getBounds() === null) {
            throw new Error(`SliderView : ${targetName} 初期化オプションで指定されたDisplayObjectにバウンディングボックスが存在しません。ShapeやContainerを利用する場合はsetBounds関数を利用してバウンディングボックスを手動で設定してください。`);
        }
        if (obj.parent) {
            console.warn("初期化オプションで指定されたパーツがすでに別の親にaddChildされています。" +
                "SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。");
        }
    }
}

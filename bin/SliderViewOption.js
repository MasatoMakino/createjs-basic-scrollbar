export class SliderViewOption {
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
        this.checkParts(option.base);
        this.checkParts(option.button);
        this.checkParts(option.mask);
        this.checkParts(option.bar);
    }
    static checkParts(obj) {
        if (obj == null)
            return;
        if (obj.getBounds() === null) {
            throw new Error("初期化オプションで指定されたShapeにバウンディングボックスが存在しません。" +
                "Shapeを利用する場合はsetBounds関数を利用して" +
                "バウンディングボックスを手動で設定してください。");
        }
        if (obj.parent) {
            console.warn("初期化オプションで指定されたパーツがすでに別の親にaddChildされています。" +
                "SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。");
        }
    }
}

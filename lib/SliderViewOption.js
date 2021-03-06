"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderViewOption = void 0;
var SliderViewOption = /** @class */ (function () {
    function SliderViewOption() {
    }
    SliderViewOption.init = function (option) {
        if (option.rate == null) {
            option.rate = 0.0;
        }
        if (option.isHorizontal == null) {
            option.isHorizontal = true;
        }
        this.check(option);
        return option;
    };
    SliderViewOption.check = function (option) {
        this.checkParts(option.base, "base");
        this.checkParts(option.button, "button");
        this.checkParts(option.mask, "mask");
        this.checkParts(option.bar, "bar");
    };
    SliderViewOption.checkParts = function (obj, targetName) {
        if (obj == null)
            return;
        if (obj.getBounds() === null) {
            throw new Error("SliderView : " + targetName + " \u521D\u671F\u5316\u30AA\u30D7\u30B7\u30E7\u30F3\u3067\u6307\u5B9A\u3055\u308C\u305FDisplayObject\u306B\u30D0\u30A6\u30F3\u30C7\u30A3\u30F3\u30B0\u30DC\u30C3\u30AF\u30B9\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002Shape\u3084Container\u3092\u5229\u7528\u3059\u308B\u5834\u5408\u306FsetBounds\u95A2\u6570\u3092\u5229\u7528\u3057\u3066\u30D0\u30A6\u30F3\u30C7\u30A3\u30F3\u30B0\u30DC\u30C3\u30AF\u30B9\u3092\u624B\u52D5\u3067\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
        }
        if (obj.parent) {
            console.warn("初期化オプションで指定されたパーツがすでに別の親にaddChildされています。" +
                "SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。");
        }
    };
    return SliderViewOption;
}());
exports.SliderViewOption = SliderViewOption;

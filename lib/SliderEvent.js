"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderEventType = exports.SliderEvent = void 0;
/**
 * スライダーが移動した際に発行されるイベントです。
 * 現状のスライダー位置を報告します。
 */
var SliderEvent = /** @class */ (function (_super) {
  __extends(SliderEvent, _super);
  function SliderEvent(type, rate, bubbles, cancelable) {
    if (bubbles === void 0) {
      bubbles = false;
    }
    if (cancelable === void 0) {
      cancelable = false;
    }
    var _this = _super.call(this, type, bubbles, cancelable) || this;
    _this.rate = rate;
    return _this;
  }
  SliderEvent.prototype.clone = function () {
    var evt = new SliderEvent(
      this.type,
      this.rate,
      this.bubbles,
      this.cancelable
    );
    return evt;
  };
  return SliderEvent;
})(createjs.Event);
exports.SliderEvent = SliderEvent;
var SliderEventType;
(function (SliderEventType) {
  SliderEventType["CHANGE"] = "event_slider_change";
  SliderEventType["CHANGE_FINISH"] = "event_slider_change_finish";
})(
  (SliderEventType = exports.SliderEventType || (exports.SliderEventType = {}))
);

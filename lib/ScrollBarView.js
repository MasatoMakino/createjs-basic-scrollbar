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
exports.ScrollBarViewInitOption = exports.ScrollBarView = void 0;
var SliderEvent_1 = require("./SliderEvent");
var SliderView_1 = require("./SliderView");
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
 */
var ScrollBarView = /** @class */ (function (_super) {
  __extends(ScrollBarView, _super);
  function ScrollBarView(option, scrollOption) {
    var _this = _super.call(this, option) || this;
    _this.autoHide = false;
    /**
     * スライダーイベントに応じてコンテンツをスクロールする
     * @param {Object} e
     */
    _this.updateContentsPosition = function (e) {
      var evt = e;
      _this.updateContentsPositionWithRate(evt.rate);
    };
    ScrollBarViewInitOption.check(scrollOption);
    _this.setTargetContents(scrollOption.targetContents);
    _this.setContentsMask(scrollOption.contentsMask);
    _this.changeRate(option.rate);
    return _this;
  }
  /**
   * 初期化処理
   * スライダーボタンの位置の初期化に加え、サイズの初期化も行う
   * @param {SliderViewOption} option
   */
  ScrollBarView.prototype.init = function (option) {
    _super.prototype.init.call(this, option);
    this.initSliderButtonSize();
  };
  /**
   * スライダーボタンの位置を制限する関数
   * @return 制限で切り落とされたスライダーボタンの座標値
   */
  ScrollBarView.prototype.limitSliderButtonPosition = function (evt) {
    var mousePos = this.getMousePosition(this, evt);
    var sliderSize = this.slideButtonSize;
    mousePos = Math.min(this._maxPosition - sliderSize / 2, mousePos);
    mousePos = Math.max(this._minPosition + sliderSize / 2, mousePos);
    return mousePos;
  };
  /**
   * スライダーの割合から、スライダーの位置を取得する
   * @param	rate
   * @return
   */
  ScrollBarView.prototype.changeRateToPixel = function (rate) {
    var buttonSize = this.slideButtonSize;
    var currentMax = this._maxPosition - buttonSize / 2;
    var currentMin = this._minPosition + buttonSize / 2;
    var currentPix =
      ((currentMax - currentMin) * rate) / SliderView_1.SliderView.MAX_RATE +
      currentMin;
    currentPix = Math.max(currentPix, currentMin);
    currentPix = Math.min(currentPix, currentMax);
    return currentPix;
  };
  /**
   * スライダーの座標から、スライダーの割合を取得する
   * @param	pixel
   * @return
   */
  ScrollBarView.prototype.changePixelToRate = function (pixel) {
    var buttonSize = this.slideButtonSize;
    var currentMax = this._maxPosition - buttonSize / 2;
    var currentMin = this._minPosition + buttonSize / 2;
    var currentRate =
      ((pixel - currentMin) / (currentMax - currentMin)) *
      SliderView_1.SliderView.MAX_RATE;
    currentRate = Math.max(currentRate, 0.0);
    currentRate = Math.min(currentRate, SliderView_1.SliderView.MAX_RATE);
    return currentRate;
  };
  Object.defineProperty(ScrollBarView.prototype, "slideButtonSize", {
    /**
     * スライダーボタンのサイズ。
     * @returns {number}
     */
    get: function () {
      this.updateSlideButtonSize();
      return this.getSize(this._slideButton);
    },
    enumerable: false,
    configurable: true,
  });
  /**
   * スクロールバーのボタンサイズ及び位置を更新する。
   * コンテンツサイズが変更された場合の更新にも利用する。
   */
  ScrollBarView.prototype.initSliderButtonSize = function () {
    if (!this._slideButton || !this._targetContents || !this._contentsMask) {
      return;
    }
    this.updateSlideButtonSize();
    this.initSliderPosition();
    if (this.hasEventListener(SliderEvent_1.SliderEventType.CHANGE)) return;
    this.addEventListener(
      SliderEvent_1.SliderEventType.CHANGE,
      this.updateContentsPosition
    );
  };
  ScrollBarView.prototype.initSliderPosition = function () {
    var zeroPos = this.getPosition(this._contentsMask);
    var contentsPos = this.getPosition(this._targetContents);
    var posDif = zeroPos - contentsPos;
    var sizeDif =
      this.getSize(this._targetContents) - this.getSize(this._contentsMask);
    this.changeRate((posDif / sizeDif) * SliderView_1.SliderView.MAX_RATE);
  };
  /**
   * スライダーボタンのサイズの伸縮を行う。
   */
  ScrollBarView.prototype.updateSlideButtonSize = function () {
    if (!this._targetContents || !this._contentsMask || !this._slideButton) {
      return;
    }
    var fullSize = this._maxPosition - this._minPosition;
    var contentsSize = this.getSize(this._targetContents);
    var maskSize = this.getSize(this._contentsMask);
    var sliderSize = (fullSize * maskSize) / contentsSize;
    if (sliderSize > fullSize) {
      sliderSize = fullSize;
    }
    this.setSize(this._slideButton, sliderSize);
    //autoHideの条件に一致するかを判定し、表示を切り替える。
    this._slideButton.visible = this._slideButton.mouseEnabled = !this.isHide;
  };
  Object.defineProperty(ScrollBarView.prototype, "isHide", {
    /**
     * autoHideの条件に一致するかを判定する
     */
    get: function () {
      //autoHideが設定されていない場合は常に表示
      if (!this.autoHide) return false;
      var fullSize = this._maxPosition - this._minPosition;
      var contentsSize = this.getSize(this._targetContents);
      var maskSize = this.getSize(this._contentsMask);
      //マスク、コンテンツ、スクロール幅のいずれかが0以下の場合スライダーを隠す
      if (contentsSize < 0 || maskSize < 0 || fullSize < 0) {
        return true;
      }
      //マスクサイズとコンテンツサイズが同一の場合スライダーを隠す
      return this.getSize(this._slideButton) == fullSize;
    },
    enumerable: false,
    configurable: true,
  });
  /**
   * rate値を元にコンテンツをスクロールする。
   * @param {number} rate
   */
  ScrollBarView.prototype.updateContentsPositionWithRate = function (rate) {
    var zeroPos = this.getPosition(this._contentsMask);
    var nextPos =
      zeroPos -
      (rate / SliderView_1.SliderView.MAX_RATE) *
        (this.getSize(this._targetContents) - this.getSize(this._contentsMask));
    this.setPosition(this._targetContents, nextPos);
  };
  ScrollBarView.prototype.onPressBase = function (evt) {
    if (this.isHide) return;
    _super.prototype.onPressBase.call(this, evt);
  };
  Object.defineProperty(ScrollBarView.prototype, "targetContents", {
    get: function () {
      return this._targetContents;
    },
    enumerable: false,
    configurable: true,
  });
  ScrollBarView.prototype.setTargetContents = function (value) {
    this._targetContents = value;
    this.initSliderButtonSize();
  };
  Object.defineProperty(ScrollBarView.prototype, "contentsMask", {
    get: function () {
      return this._contentsMask;
    },
    enumerable: false,
    configurable: true,
  });
  ScrollBarView.prototype.setContentsMask = function (value) {
    this._contentsMask = value;
    this.initSliderButtonSize();
  };
  ScrollBarView.prototype.onDisposeFunction = function (e) {
    this.removeEventListener(
      SliderEvent_1.SliderEventType.CHANGE,
      this.updateContentsPosition
    );
    this._targetContents = null;
    this._contentsMask = null;
    _super.prototype.onDisposeFunction.call(this, e);
  };
  return ScrollBarView;
})(SliderView_1.SliderView);
exports.ScrollBarView = ScrollBarView;
/**
 * スクロールバーの初期化時に必須となる項目をまとめたオブジェクト
 * スクロール対象とスクロールエリアのマスクを指定する。
 */
var ScrollBarViewInitOption = /** @class */ (function () {
  function ScrollBarViewInitOption() {}
  ScrollBarViewInitOption.check = function (option) {
    if (option.contentsMask.parent != option.contentsMask.parent) {
      console.warn(
        "ScrollBarView : スクロールするコンテンツと、そのマスクは表示ツリー上で同一の親Containerを持っている必要があります。",
        option.targetContents,
        option.contentsMask
      );
    }
    if (option.targetContents.getBounds() === null) {
      throw new Error(
        "ScrollBarView : 初期化オプションで指定されたtargetContentsにバウンディングボックスが存在しません。" +
          "ShapeやContainerを利用する場合はsetBounds関数を利用して" +
          "バウンディングボックスを手動で設定してください。"
      );
    }
    if (option.contentsMask.getBounds() === null) {
      throw new Error(
        "ScrollBarView : 初期化オプションで指定されたcontentsMaskにバウンディングボックスが存在しません。" +
          "Shapeを利用する場合はsetBounds関数を利用して" +
          "バウンディングボックスを手動で設定してください。"
      );
    }
  };
  return ScrollBarViewInitOption;
})();
exports.ScrollBarViewInitOption = ScrollBarViewInitOption;

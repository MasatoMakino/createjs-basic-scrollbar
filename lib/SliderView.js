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
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
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
exports.SliderView = void 0;
var Container = createjs.Container;
var Point = createjs.Point;
var SliderEvent_1 = require("./SliderEvent");
var SliderViewOption_1 = require("./SliderViewOption");
/**
 * スライダー用クラスです
 *
 * 使用上の注意 :
 * オブジェクトのサイズの計測にgetBounds関数を使用しています。
 * shapeおよびContainerクラスでは、getBoundsの自動計測が効かない場合があります。
 * setBounds関数でサイズをあらかじめ与えてください。
 */
var SliderView = /** @class */ (function (_super) {
  __extends(SliderView, _super);
  /**
   * @param {SliderViewOption} option
   */
  function SliderView(option) {
    var _this = _super.call(this) || this;
    _this.isHorizontal = true;
    _this.dragStartPos = new createjs.Point();
    _this.isDragging = false; // 現在スライド中か否か
    /**
     * スライダーのドラッグを開始する
     * @param {Object} e
     */
    _this.startMove = function (e) {
      var evt = e;
      _this.isDragging = true;
      var target = evt.currentTarget;
      var localPos = _this.globalToLocal(evt.stageX, evt.stageY);
      _this.dragStartPos = new Point(
        localPos.x - target.x,
        localPos.y - target.y
      );
      _this.stage.addEventListener("pressmove", _this.moveSlider);
      _this.stage.addEventListener("pressup", _this.moveSliderFinish);
    };
    /**
     * スライダーのドラッグ中の処理
     * @param e
     */
    _this.moveSlider = function (e) {
      var evt = e;
      var mousePos = _this.limitSliderButtonPosition(evt);
      _this.updateParts(mousePos);
      _this._rate = _this.changePixelToRate(mousePos);
      _this.dispatchEvent(
        new SliderEvent_1.SliderEvent(
          SliderEvent_1.SliderEventType.CHANGE,
          _this.rate
        )
      );
    };
    /**
     * スライダーのドラッグ終了時の処理
     * @param	e
     */
    _this.moveSliderFinish = function (e) {
      _this.isDragging = false;
      _this.stage.removeEventListener("pressmove", _this.moveSlider);
      _this.stage.removeEventListener("pressup", _this.moveSliderFinish);
      _this.dispatchEvent(
        new SliderEvent_1.SliderEvent(
          SliderEvent_1.SliderEventType.CHANGE_FINISH,
          _this.rate
        )
      );
    };
    /**
     * このインスタンスを破棄する。
     * @param	e
     */
    _this.dispose = function (e) {
      _this.onDisposeFunction(e);
    };
    _this.init(option);
    return _this;
  }
  /**
   * 初期化処理
   * @param {SliderViewOption} option
   */
  SliderView.prototype.init = function (option) {
    option = SliderViewOption_1.SliderViewOption.init(option);
    this.base = option.base;
    this._bar = this.initBarAndMask(option.bar);
    this.slideButton = option.button;
    this._barMask = this.initBarAndMask(option.mask);
    if (this._bar && this._barMask) this._bar.mask = this._barMask;
    this._minPosition = option.minPosition;
    this._maxPosition = option.maxPosition;
    this.isHorizontal = option.isHorizontal;
    this._rate = option.rate;
    this.changeRate(this._rate);
  };
  SliderView.prototype.addChildMe = function (obj) {
    if (!obj) return;
    if (obj.parent) obj.parent.removeChild(obj);
    this.addChild(obj);
  };
  /**
   * スライダーの位置を変更する
   * @param	rate	スライダーの位置 MIN 0.0 ~ MAX 100.0
   */
  SliderView.prototype.changeRate = function (rate) {
    //ドラッグ中は外部からの操作を無視する。
    if (this.isDragging) return;
    this._rate = rate;
    var pos = this.changeRateToPixel(this._rate);
    this.updateParts(pos);
    this.dispatchEvent(
      new SliderEvent_1.SliderEvent(
        SliderEvent_1.SliderEventType.CHANGE,
        this.rate
      )
    );
  };
  /**
   * スライダーボタンの位置を制限する関数
   * @return 制限で切り落とされたスライダーボタンの座標値
   */
  SliderView.prototype.limitSliderButtonPosition = function (evt) {
    var mousePos = this.getMousePosition(this, evt);
    mousePos = Math.min(this._maxPosition, mousePos);
    mousePos = Math.max(this._minPosition, mousePos);
    return mousePos;
  };
  /**
   * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する
   * moveSliderの内部処理
   * @param	mousePos
   */
  SliderView.prototype.updateParts = function (mousePos) {
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
  };
  /**
   * スライダーの地をクリックした際の処理
   * その位置までスライダーをジャンプする
   * @param {createjs.MouseEvent} evt
   */
  SliderView.prototype.onPressBase = function (evt) {
    this.dragStartPos = new Point();
    this.moveSlider(evt);
    this.dispatchEvent(
      new SliderEvent_1.SliderEvent(
        SliderEvent_1.SliderEventType.CHANGE_FINISH,
        this.rate
      )
    );
  };
  /**
   * スライダーの割合から、スライダーの位置を取得する
   * @param	rate
   * @return
   */
  SliderView.prototype.changeRateToPixel = function (rate) {
    var pix =
      ((this._maxPosition - this._minPosition) * rate) / SliderView.MAX_RATE +
      this._minPosition;
    pix = Math.max(pix, this._minPosition);
    pix = Math.min(pix, this._maxPosition);
    return pix;
  };
  /**
   * スライダーの座標から、スライダーの割合を取得する
   * @param	pixel
   * @return
   */
  SliderView.prototype.changePixelToRate = function (pixel) {
    var min = this._minPosition;
    var max = this._maxPosition;
    var rate = ((pixel - min) / (max - min)) * SliderView.MAX_RATE;
    rate = Math.max(rate, 0.0);
    rate = Math.min(rate, SliderView.MAX_RATE);
    return rate;
  };
  /**
   * ディスプレイオブジェクトからスクロール方向の座標値を取り出す
   * @param	displayObj
   * @return
   */
  SliderView.prototype.getPosition = function (displayObj) {
    if (this.isHorizontal) {
      return displayObj.x;
    } else {
      return displayObj.y;
    }
  };
  /**
   * ディスプレイオブジェクトにスクロール方向の座標地を設定する
   * @param	displayObj
   * @param	position
   */
  SliderView.prototype.setPosition = function (displayObj, position) {
    if (!displayObj) return;
    if (this.isHorizontal) {
      displayObj.x = position;
    } else {
      displayObj.y = position;
    }
  };
  /**
   * スクロール方向のマウス座標を取得する
   * limitSliderButtonPosition内の処理
   * @param	displayObj
   * @return
   */
  SliderView.prototype.getMousePosition = function (displayObj, evt) {
    var localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);
    if (this.isHorizontal) {
      return localPos.x - this.dragStartPos.x;
    } else {
      return localPos.y - this.dragStartPos.y;
    }
  };
  /**
   * スクロール方向の高さ、もしくは幅を取得する
   * @param	displayObj
   * @return
   */
  SliderView.prototype.getSize = function (displayObj) {
    var size = displayObj.getBounds();
    if (this.isHorizontal) {
      return size.width * displayObj.scaleX;
    } else {
      return size.height * displayObj.scaleY;
    }
  };
  /**
   * スクロール方向の高さ、もしくは幅を設定する
   * @param {createjs.DisplayObject} displayObj
   * @param {number} amount
   */
  SliderView.prototype.setSize = function (displayObj, amount) {
    var size = displayObj.getBounds();
    if (this.isHorizontal) {
      displayObj.scaleX = amount / size.width;
    } else {
      displayObj.scaleY = amount / size.height;
    }
  };
  Object.defineProperty(SliderView.prototype, "base", {
    set: function (value) {
      var _this = this;
      if (!value) return;
      this._base = value;
      this._base.mouseEnabled = true;
      this._base.addEventListener("click", function (e) {
        _this.onPressBase(e);
      });
      this.addChildMe(value);
    },
    enumerable: false,
    configurable: true,
  });
  SliderView.prototype.initBarAndMask = function (value) {
    if (value == null) return;
    value.mouseEnabled = false;
    this.addChildMe(value);
    return value;
  };
  Object.defineProperty(SliderView.prototype, "slideButton", {
    set: function (value) {
      if (!value) return;
      this._slideButton = value;
      this._slideButton.addEventListener("mousedown", this.startMove);
      this.addChildMe(value);
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(SliderView.prototype, "rate", {
    get: function () {
      return this._rate;
    },
    enumerable: false,
    configurable: true,
  });
  /**
   * 全てのDisplayObjectとEventListenerを解除する。
   * @param {Event} e
   */
  SliderView.prototype.onDisposeFunction = function (e) {
    this.removeAllEventListeners();
    this._base.removeAllEventListeners();
    this._slideButton.removeAllEventListeners();
    this.removeAllChildren();
  };
  SliderView.MAX_RATE = 100.0;
  return SliderView;
})(Container);
exports.SliderView = SliderView;

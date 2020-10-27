/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demoSrc/demo.js":
/*!*************************!*\
  !*** ./demoSrc/demo.js ***!
  \*************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ */ \"./esm/index.js\");\n\n\nconst onDomContentsLoaded = () => {\n  //ステージ更新処理\n  const updateStage = () => {\n    stage.update();\n  }; //stageの初期化\n\n\n  const canvas = document.getElementById(\"appCanvas\");\n  const stage = new createjs.Stage(canvas);\n  createjs.Ticker.timingMode = createjs.Ticker.RAF;\n  createjs.Ticker.on(\"tick\", updateStage);\n  initSlider(stage);\n  initScrollBar(stage);\n};\n\nconst getSliderBase = (w, h, color) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(color);\n  g.moveTo(0, 0).lineTo(w, 0).lineTo(w, h).lineTo(0, 0).endFill();\n  shape.setBounds(0, 0, w, h);\n  return shape;\n};\n\nconst getSliderMask = (w, h) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(\"rgba( 255, 0, 255, 0.0)\");\n  g.drawRect(0, 0, w, h);\n  shape.setBounds(0, 0, w, h);\n  return shape;\n};\n\nconst getSliderButton = (w, h, color) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(color);\n  g.drawRect(-8, 0, 16, h);\n  shape.setBounds(-8, 0, 16, h);\n  return shape;\n};\n/**\n * スライダーの実装サンプル\n * @param stage\n */\n\n\nconst initSlider = stage => {\n  const SLIDER_W = 200;\n  const SLIDER_H = 64;\n  const slider = new ___WEBPACK_IMPORTED_MODULE_0__.SliderView({\n    base: getSliderBase(SLIDER_W, SLIDER_H, \"#00f\"),\n    bar: getSliderBase(SLIDER_W, SLIDER_H, \"#0ff\"),\n    button: getSliderButton(SLIDER_W, SLIDER_H, \"rgba( 255, 255, 0, 0.5)\"),\n    mask: getSliderMask(SLIDER_W, SLIDER_H),\n    minPosition: 0,\n    maxPosition: SLIDER_W,\n    rate: 25.0\n  });\n  slider.addEventListener(___WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE, e => {\n    console.log(e.rate);\n  });\n  stage.addChild(slider);\n  slider.x = 200;\n  slider.y = 200;\n};\n\nconst getScrollBarBase = (w, h, color) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(color);\n  g.drawRect(0, 0, w, h);\n  shape.setBounds(0, 0, w, h);\n  return shape;\n};\n\nconst getScrollBarButton = (width, color) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(color);\n  g.drawRect(-width / 2, -width / 2, width, width);\n  shape.setBounds(-width / 2, -width / 2, width, width);\n  shape.x = width / 2;\n  return shape;\n};\n\nconst getScrollBarContents = (color, w, h, container) => {\n  const shape = new createjs.Shape();\n  const g = shape.graphics;\n  g.beginFill(color);\n  g.drawRect(0, 0, w, h);\n  shape.setBounds(0, 0, w, h);\n  container.addChild(shape);\n  return shape;\n};\n\nconst getScrollBarOption = (contentsW, scrollBarH, container) => {\n  return {\n    targetContents: getScrollBarContents(\"#f0f\", contentsW, scrollBarH * 2, container),\n    contentsMask: getScrollBarContents(\"rgba(0,0,255,0.3)\", contentsW, scrollBarH, container)\n  };\n};\n/**\n * スクロールバーの実装サンプル\n * @param stage\n */\n\n\nconst initScrollBar = stage => {\n  const SCROLLBAR_W = 16;\n  const SCROLLBAR_H = 360;\n  const SCROLLBAR_Y = 120;\n  const CONTENTS_W = 240;\n  const container = new createjs.Container();\n  stage.addChild(container);\n  container.x = 800;\n  container.y = SCROLLBAR_Y;\n  const scrollbar = new ___WEBPACK_IMPORTED_MODULE_0__.ScrollBarView({\n    base: getScrollBarBase(SCROLLBAR_W, SCROLLBAR_H, \"#00f\"),\n    button: getScrollBarButton(SCROLLBAR_W, \"#ff0\"),\n    minPosition: 0,\n    maxPosition: SCROLLBAR_H,\n    rate: 30.0,\n    isHorizontal: false\n  }, getScrollBarOption(CONTENTS_W, SCROLLBAR_H, container));\n  stage.addChild(scrollbar);\n  scrollbar.x = container.x + CONTENTS_W;\n  scrollbar.y = SCROLLBAR_Y;\n};\n/**\n * DOMContentLoaded以降に初期化処理を実行する\n */\n\n\nif (document.readyState !== \"loading\") {\n  onDomContentsLoaded();\n} else {\n  document.addEventListener(\"DOMContentLoaded\", onDomContentsLoaded);\n}\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./demoSrc/demo.js?");

/***/ }),

/***/ "./esm/ScrollBarView.js":
/*!******************************!*\
  !*** ./esm/ScrollBarView.js ***!
  \******************************/
/*! namespace exports */
/*! export ScrollBarView [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ScrollBarViewInitOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ScrollBarView\": () => /* binding */ ScrollBarView,\n/* harmony export */   \"ScrollBarViewInitOption\": () => /* binding */ ScrollBarViewInitOption\n/* harmony export */ });\n/* harmony import */ var _SliderEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SliderEvent */ \"./esm/SliderEvent.js\");\n/* harmony import */ var _SliderView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SliderView */ \"./esm/SliderView.js\");\n\n\n/**\n * スクロールバーを表すクラスです。\n *\n * このクラスは、スライダーに以下の機能を追加したものです。\n *\n * \t\t1.コンテンツサイズに合わせた、スクロールバーの伸縮\n * \t\t2.スクロールバーの伸縮にあわせた、移動範囲の制限\n * \t\t3.スクロールバーの伸縮にあわせた、移動値の取得\n *\n * 初期設定の注意\n * \t\t スクロール対象とマスクは同一の親をもつこと。\n * \t\t ローカル、グローバルの座標変換は行っていないので別の親をもつとスクロールが破たんします。\n */\n\nclass ScrollBarView extends _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView {\n  constructor(option, scrollOption) {\n    super(option);\n    this.autoHide = false;\n    /**\n     * スライダーイベントに応じてコンテンツをスクロールする\n     * @param {Object} e\n     */\n\n    this.updateContentsPosition = e => {\n      const evt = e;\n      this.updateContentsPositionWithRate(evt.rate);\n    };\n\n    ScrollBarViewInitOption.check(scrollOption);\n    this.setTargetContents(scrollOption.targetContents);\n    this.setContentsMask(scrollOption.contentsMask);\n    this.changeRate(option.rate);\n  }\n  /**\n   * 初期化処理\n   * スライダーボタンの位置の初期化に加え、サイズの初期化も行う\n   * @param {SliderViewOption} option\n   */\n\n\n  init(option) {\n    super.init(option);\n    this.initSliderButtonSize();\n  }\n  /**\n   * スライダーボタンの位置を制限する関数\n   * @return 制限で切り落とされたスライダーボタンの座標値\n   */\n\n\n  limitSliderButtonPosition(evt) {\n    let mousePos = this.getMousePosition(this, evt);\n    const sliderSize = this.slideButtonSize;\n    mousePos = Math.min(this._maxPosition - sliderSize / 2, mousePos);\n    mousePos = Math.max(this._minPosition + sliderSize / 2, mousePos);\n    return mousePos;\n  }\n  /**\n   * スライダーの割合から、スライダーの位置を取得する\n   * @param\trate\n   * @return\n   */\n\n\n  changeRateToPixel(rate) {\n    const buttonSize = this.slideButtonSize;\n    const currentMax = this._maxPosition - buttonSize / 2;\n    const currentMin = this._minPosition + buttonSize / 2;\n    let currentPix = (currentMax - currentMin) * rate / _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView.MAX_RATE + currentMin;\n    currentPix = Math.max(currentPix, currentMin);\n    currentPix = Math.min(currentPix, currentMax);\n    return currentPix;\n  }\n  /**\n   * スライダーの座標から、スライダーの割合を取得する\n   * @param\tpixel\n   * @return\n   */\n\n\n  changePixelToRate(pixel) {\n    const buttonSize = this.slideButtonSize;\n    const currentMax = this._maxPosition - buttonSize / 2;\n    const currentMin = this._minPosition + buttonSize / 2;\n    let currentRate = (pixel - currentMin) / (currentMax - currentMin) * _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView.MAX_RATE;\n    currentRate = Math.max(currentRate, 0.0);\n    currentRate = Math.min(currentRate, _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView.MAX_RATE);\n    return currentRate;\n  }\n  /**\n   * スライダーボタンのサイズ。\n   * @returns {number}\n   */\n\n\n  get slideButtonSize() {\n    this.updateSlideButtonSize();\n    return this.getSize(this._slideButton);\n  }\n  /**\n   * スクロールバーのボタンサイズ及び位置を更新する。\n   * コンテンツサイズが変更された場合の更新にも利用する。\n   */\n\n\n  initSliderButtonSize() {\n    if (!this._slideButton || !this._targetContents || !this._contentsMask) {\n      return;\n    }\n\n    this.updateSlideButtonSize();\n    this.initSliderPosition();\n    if (this.hasEventListener(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE)) return;\n    this.addEventListener(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE, this.updateContentsPosition);\n  }\n\n  initSliderPosition() {\n    const zeroPos = this.getPosition(this._contentsMask);\n    const contentsPos = this.getPosition(this._targetContents);\n    const posDif = zeroPos - contentsPos;\n    const sizeDif = this.getSize(this._targetContents) - this.getSize(this._contentsMask);\n    this.changeRate(posDif / sizeDif * _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView.MAX_RATE);\n  }\n  /**\n   * スライダーボタンのサイズの伸縮を行う。\n   */\n\n\n  updateSlideButtonSize() {\n    if (!this._targetContents || !this._contentsMask || !this._slideButton) {\n      return;\n    }\n\n    const fullSize = this._maxPosition - this._minPosition;\n    const contentsSize = this.getSize(this._targetContents);\n    const maskSize = this.getSize(this._contentsMask);\n    let sliderSize = fullSize * maskSize / contentsSize;\n\n    if (sliderSize > fullSize) {\n      sliderSize = fullSize;\n    }\n\n    this.setSize(this._slideButton, sliderSize); //autoHideの条件に一致するかを判定し、表示を切り替える。\n\n    this._slideButton.visible = this._slideButton.mouseEnabled = !this.isHide;\n  }\n  /**\n   * autoHideの条件に一致するかを判定する\n   */\n\n\n  get isHide() {\n    //autoHideが設定されていない場合は常に表示\n    if (!this.autoHide) return false;\n    const fullSize = this._maxPosition - this._minPosition;\n    const contentsSize = this.getSize(this._targetContents);\n    const maskSize = this.getSize(this._contentsMask); //マスク、コンテンツ、スクロール幅のいずれかが0以下の場合スライダーを隠す\n\n    if (contentsSize < 0 || maskSize < 0 || fullSize < 0) {\n      return true;\n    } //マスクサイズとコンテンツサイズが同一の場合スライダーを隠す\n\n\n    return this.getSize(this._slideButton) == fullSize;\n  }\n  /**\n   * rate値を元にコンテンツをスクロールする。\n   * @param {number} rate\n   */\n\n\n  updateContentsPositionWithRate(rate) {\n    const zeroPos = this.getPosition(this._contentsMask);\n    const nextPos = zeroPos - rate / _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView.MAX_RATE * (this.getSize(this._targetContents) - this.getSize(this._contentsMask));\n    this.setPosition(this._targetContents, nextPos);\n  }\n\n  onPressBase(evt) {\n    if (this.isHide) return;\n    super.onPressBase(evt);\n  }\n\n  get targetContents() {\n    return this._targetContents;\n  }\n\n  setTargetContents(value) {\n    this._targetContents = value;\n    this.initSliderButtonSize();\n  }\n\n  get contentsMask() {\n    return this._contentsMask;\n  }\n\n  setContentsMask(value) {\n    this._contentsMask = value;\n    this.initSliderButtonSize();\n  }\n\n  onDisposeFunction(e) {\n    this.removeEventListener(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE, this.updateContentsPosition);\n    this._targetContents = null;\n    this._contentsMask = null;\n    super.onDisposeFunction(e);\n  }\n\n}\n/**\n * スクロールバーの初期化時に必須となる項目をまとめたオブジェクト\n * スクロール対象とスクロールエリアのマスクを指定する。\n */\n\nclass ScrollBarViewInitOption {\n  static check(option) {\n    if (option.contentsMask.parent != option.contentsMask.parent) {\n      console.warn(\"ScrollBarView : スクロールするコンテンツと、そのマスクは表示ツリー上で同一の親Containerを持っている必要があります。\", option.targetContents, option.contentsMask);\n    }\n\n    if (option.targetContents.getBounds() === null) {\n      throw new Error(\"ScrollBarView : 初期化オプションで指定されたtargetContentsにバウンディングボックスが存在しません。\" + \"ShapeやContainerを利用する場合はsetBounds関数を利用して\" + \"バウンディングボックスを手動で設定してください。\");\n    }\n\n    if (option.contentsMask.getBounds() === null) {\n      throw new Error(\"ScrollBarView : 初期化オプションで指定されたcontentsMaskにバウンディングボックスが存在しません。\" + \"Shapeを利用する場合はsetBounds関数を利用して\" + \"バウンディングボックスを手動で設定してください。\");\n    }\n  }\n\n}\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./esm/ScrollBarView.js?");

/***/ }),

/***/ "./esm/SliderEvent.js":
/*!****************************!*\
  !*** ./esm/SliderEvent.js ***!
  \****************************/
/*! namespace exports */
/*! export SliderEvent [provided] [no usage info] [missing usage info prevents renaming] */
/*! export SliderEventType [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SliderEvent\": () => /* binding */ SliderEvent,\n/* harmony export */   \"SliderEventType\": () => /* binding */ SliderEventType\n/* harmony export */ });\n/**\n * スライダーが移動した際に発行されるイベントです。\n * 現状のスライダー位置を報告します。\n */\nclass SliderEvent extends createjs.Event {\n  constructor(type, rate, bubbles = false, cancelable = false) {\n    super(type, bubbles, cancelable);\n    this.rate = rate;\n  }\n\n  clone() {\n    const evt = new SliderEvent(this.type, this.rate, this.bubbles, this.cancelable);\n    return evt;\n  }\n\n}\nvar SliderEventType;\n\n(function (SliderEventType) {\n  SliderEventType[\"CHANGE\"] = \"event_slider_change\";\n  SliderEventType[\"CHANGE_FINISH\"] = \"event_slider_change_finish\";\n})(SliderEventType || (SliderEventType = {}));\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./esm/SliderEvent.js?");

/***/ }),

/***/ "./esm/SliderView.js":
/*!***************************!*\
  !*** ./esm/SliderView.js ***!
  \***************************/
/*! namespace exports */
/*! export SliderView [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SliderView\": () => /* binding */ SliderView\n/* harmony export */ });\n/* harmony import */ var _SliderEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SliderEvent */ \"./esm/SliderEvent.js\");\n/* harmony import */ var _SliderViewOption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SliderViewOption */ \"./esm/SliderViewOption.js\");\nvar Container = createjs.Container;\nvar Point = createjs.Point;\n\n\n/**\n * スライダー用クラスです\n *\n * 使用上の注意 :\n * オブジェクトのサイズの計測にgetBounds関数を使用しています。\n * shapeおよびContainerクラスでは、getBoundsの自動計測が効かない場合があります。\n * setBounds関数でサイズをあらかじめ与えてください。\n */\n\nclass SliderView extends Container {\n  /**\n   * @param {SliderViewOption} option\n   */\n  constructor(option) {\n    super();\n    this.isHorizontal = true;\n    this.dragStartPos = new createjs.Point();\n    this.isDragging = false; // 現在スライド中か否か\n\n    /**\n     * スライダーのドラッグを開始する\n     * @param {Object} e\n     */\n\n    this.startMove = e => {\n      const evt = e;\n      this.isDragging = true;\n      const target = evt.currentTarget;\n      const localPos = this.globalToLocal(evt.stageX, evt.stageY);\n      this.dragStartPos = new Point(localPos.x - target.x, localPos.y - target.y);\n      this.stage.addEventListener(\"pressmove\", this.moveSlider);\n      this.stage.addEventListener(\"pressup\", this.moveSliderFinish);\n    };\n    /**\n     * スライダーのドラッグ中の処理\n     * @param e\n     */\n\n\n    this.moveSlider = e => {\n      const evt = e;\n      const mousePos = this.limitSliderButtonPosition(evt);\n      this.updateParts(mousePos);\n      this._rate = this.changePixelToRate(mousePos);\n      this.dispatchEvent(new _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEvent(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE, this.rate));\n    };\n    /**\n     * スライダーのドラッグ終了時の処理\n     * @param\te\n     */\n\n\n    this.moveSliderFinish = e => {\n      this.isDragging = false;\n      this.stage.removeEventListener(\"pressmove\", this.moveSlider);\n      this.stage.removeEventListener(\"pressup\", this.moveSliderFinish);\n      this.dispatchEvent(new _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEvent(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE_FINISH, this.rate));\n    };\n    /**\n     * このインスタンスを破棄する。\n     * @param\te\n     */\n\n\n    this.dispose = e => {\n      this.onDisposeFunction(e);\n    };\n\n    this.init(option);\n  }\n  /**\n   * 初期化処理\n   * @param {SliderViewOption} option\n   */\n\n\n  init(option) {\n    option = _SliderViewOption__WEBPACK_IMPORTED_MODULE_1__.SliderViewOption.init(option);\n    this.base = option.base;\n    this._bar = this.initBarAndMask(option.bar);\n    this.slideButton = option.button;\n    this._barMask = this.initBarAndMask(option.mask);\n    if (this._bar && this._barMask) this._bar.mask = this._barMask;\n    this._minPosition = option.minPosition;\n    this._maxPosition = option.maxPosition;\n    this.isHorizontal = option.isHorizontal;\n    this._rate = option.rate;\n    this.changeRate(this._rate);\n  }\n\n  addChildMe(obj) {\n    if (!obj) return;\n    if (obj.parent) obj.parent.removeChild(obj);\n    this.addChild(obj);\n  }\n  /**\n   * スライダーの位置を変更する\n   * @param\trate\tスライダーの位置 MIN 0.0 ~ MAX 100.0\n   */\n\n\n  changeRate(rate) {\n    //ドラッグ中は外部からの操作を無視する。\n    if (this.isDragging) return;\n    this._rate = rate;\n    const pos = this.changeRateToPixel(this._rate);\n    this.updateParts(pos);\n    this.dispatchEvent(new _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEvent(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE, this.rate));\n  }\n  /**\n   * スライダーボタンの位置を制限する関数\n   * @return 制限で切り落とされたスライダーボタンの座標値\n   */\n\n\n  limitSliderButtonPosition(evt) {\n    let mousePos = this.getMousePosition(this, evt);\n    mousePos = Math.min(this._maxPosition, mousePos);\n    mousePos = Math.max(this._minPosition, mousePos);\n    return mousePos;\n  }\n  /**\n   * 各MCの位置、サイズをマウスポインタの位置に合わせて更新する\n   * moveSliderの内部処理\n   * @param\tmousePos\n   */\n\n\n  updateParts(mousePos) {\n    //バーマスクがなければ、バー自体を伸縮する\n    if (this._bar && !this._barMask) {\n      this.setSize(this._bar, Math.max(2.0, mousePos - this._minPosition));\n    } //バーマスクがあれば、マスクを伸縮する。\n\n\n    if (this._barMask) {\n      this.setSize(this._barMask, mousePos - this.getPosition(this._barMask));\n    } //ボタンの位置を更新する。\n\n\n    if (this._slideButton) {\n      this.setPosition(this._slideButton, mousePos);\n    }\n  }\n  /**\n   * スライダーの地をクリックした際の処理\n   * その位置までスライダーをジャンプする\n   * @param {createjs.MouseEvent} evt\n   */\n\n\n  onPressBase(evt) {\n    this.dragStartPos = new Point();\n    this.moveSlider(evt);\n    this.dispatchEvent(new _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEvent(_SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType.CHANGE_FINISH, this.rate));\n  }\n  /**\n   * スライダーの割合から、スライダーの位置を取得する\n   * @param\trate\n   * @return\n   */\n\n\n  changeRateToPixel(rate) {\n    let pix = (this._maxPosition - this._minPosition) * rate / SliderView.MAX_RATE + this._minPosition;\n    pix = Math.max(pix, this._minPosition);\n    pix = Math.min(pix, this._maxPosition);\n    return pix;\n  }\n  /**\n   * スライダーの座標から、スライダーの割合を取得する\n   * @param\tpixel\n   * @return\n   */\n\n\n  changePixelToRate(pixel) {\n    const min = this._minPosition;\n    const max = this._maxPosition;\n    let rate = (pixel - min) / (max - min) * SliderView.MAX_RATE;\n    rate = Math.max(rate, 0.0);\n    rate = Math.min(rate, SliderView.MAX_RATE);\n    return rate;\n  }\n  /**\n   * ディスプレイオブジェクトからスクロール方向の座標値を取り出す\n   * @param\tdisplayObj\n   * @return\n   */\n\n\n  getPosition(displayObj) {\n    if (this.isHorizontal) {\n      return displayObj.x;\n    } else {\n      return displayObj.y;\n    }\n  }\n  /**\n   * ディスプレイオブジェクトにスクロール方向の座標地を設定する\n   * @param\tdisplayObj\n   * @param\tposition\n   */\n\n\n  setPosition(displayObj, position) {\n    if (!displayObj) return;\n\n    if (this.isHorizontal) {\n      displayObj.x = position;\n    } else {\n      displayObj.y = position;\n    }\n  }\n  /**\n   * スクロール方向のマウス座標を取得する\n   * limitSliderButtonPosition内の処理\n   * @param\tdisplayObj\n   * @return\n   */\n\n\n  getMousePosition(displayObj, evt) {\n    const localPos = displayObj.globalToLocal(evt.stageX, evt.stageY);\n\n    if (this.isHorizontal) {\n      return localPos.x - this.dragStartPos.x;\n    } else {\n      return localPos.y - this.dragStartPos.y;\n    }\n  }\n  /**\n   * スクロール方向の高さ、もしくは幅を取得する\n   * @param\tdisplayObj\n   * @return\n   */\n\n\n  getSize(displayObj) {\n    const size = displayObj.getBounds();\n\n    if (this.isHorizontal) {\n      return size.width * displayObj.scaleX;\n    } else {\n      return size.height * displayObj.scaleY;\n    }\n  }\n  /**\n   * スクロール方向の高さ、もしくは幅を設定する\n   * @param {createjs.DisplayObject} displayObj\n   * @param {number} amount\n   */\n\n\n  setSize(displayObj, amount) {\n    const size = displayObj.getBounds();\n\n    if (this.isHorizontal) {\n      displayObj.scaleX = amount / size.width;\n    } else {\n      displayObj.scaleY = amount / size.height;\n    }\n  }\n\n  set base(value) {\n    if (!value) return;\n    this._base = value;\n    this._base.mouseEnabled = true;\n\n    this._base.addEventListener(\"click\", e => {\n      this.onPressBase(e);\n    });\n\n    this.addChildMe(value);\n  }\n\n  initBarAndMask(value) {\n    if (value == null) return;\n    value.mouseEnabled = false;\n    this.addChildMe(value);\n    return value;\n  }\n\n  set slideButton(value) {\n    if (!value) return;\n    this._slideButton = value;\n\n    this._slideButton.addEventListener(\"mousedown\", this.startMove);\n\n    this.addChildMe(value);\n  }\n\n  get rate() {\n    return this._rate;\n  }\n  /**\n   * 全てのDisplayObjectとEventListenerを解除する。\n   * @param {Event} e\n   */\n\n\n  onDisposeFunction(e) {\n    this.removeAllEventListeners();\n\n    this._base.removeAllEventListeners();\n\n    this._slideButton.removeAllEventListeners();\n\n    this.removeAllChildren();\n  }\n\n}\nSliderView.MAX_RATE = 100.0;\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./esm/SliderView.js?");

/***/ }),

/***/ "./esm/SliderViewOption.js":
/*!*********************************!*\
  !*** ./esm/SliderViewOption.js ***!
  \*********************************/
/*! namespace exports */
/*! export SliderViewOption [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SliderViewOption\": () => /* binding */ SliderViewOption\n/* harmony export */ });\nclass SliderViewOption {\n  static init(option) {\n    if (option.rate == null) {\n      option.rate = 0.0;\n    }\n\n    if (option.isHorizontal == null) {\n      option.isHorizontal = true;\n    }\n\n    this.check(option);\n    return option;\n  }\n\n  static check(option) {\n    this.checkParts(option.base, \"base\");\n    this.checkParts(option.button, \"button\");\n    this.checkParts(option.mask, \"mask\");\n    this.checkParts(option.bar, \"bar\");\n  }\n\n  static checkParts(obj, targetName) {\n    if (obj == null) return;\n\n    if (obj.getBounds() === null) {\n      throw new Error(`SliderView : ${targetName} 初期化オプションで指定されたDisplayObjectにバウンディングボックスが存在しません。ShapeやContainerを利用する場合はsetBounds関数を利用してバウンディングボックスを手動で設定してください。`);\n    }\n\n    if (obj.parent) {\n      console.warn(\"初期化オプションで指定されたパーツがすでに別の親にaddChildされています。\" + \"SliderViewおよびScrollBarViewの構成パーツはインスタンスにaddChildされることを前提としています。\");\n    }\n  }\n\n}\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./esm/SliderViewOption.js?");

/***/ }),

/***/ "./esm/index.js":
/*!**********************!*\
  !*** ./esm/index.js ***!
  \**********************/
/*! namespace exports */
/*! export ScrollBarView [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/ScrollBarView.js .ScrollBarView */
/*! export ScrollBarViewInitOption [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/ScrollBarView.js .ScrollBarViewInitOption */
/*! export SliderEvent [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/SliderEvent.js .SliderEvent */
/*! export SliderEventType [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/SliderEvent.js .SliderEventType */
/*! export SliderView [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/SliderView.js .SliderView */
/*! export SliderViewOption [provided] [no usage info] [missing usage info prevents renaming] -> ./esm/SliderViewOption.js .SliderViewOption */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.d, __webpack_require__.r, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SliderEvent\": () => /* reexport safe */ _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEvent,\n/* harmony export */   \"SliderEventType\": () => /* reexport safe */ _SliderEvent__WEBPACK_IMPORTED_MODULE_0__.SliderEventType,\n/* harmony export */   \"SliderView\": () => /* reexport safe */ _SliderView__WEBPACK_IMPORTED_MODULE_1__.SliderView,\n/* harmony export */   \"ScrollBarView\": () => /* reexport safe */ _ScrollBarView__WEBPACK_IMPORTED_MODULE_2__.ScrollBarView,\n/* harmony export */   \"ScrollBarViewInitOption\": () => /* reexport safe */ _ScrollBarView__WEBPACK_IMPORTED_MODULE_2__.ScrollBarViewInitOption,\n/* harmony export */   \"SliderViewOption\": () => /* reexport safe */ _SliderViewOption__WEBPACK_IMPORTED_MODULE_3__.SliderViewOption\n/* harmony export */ });\n/* harmony import */ var _SliderEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SliderEvent */ \"./esm/SliderEvent.js\");\n/* harmony import */ var _SliderView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SliderView */ \"./esm/SliderView.js\");\n/* harmony import */ var _ScrollBarView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ScrollBarView */ \"./esm/ScrollBarView.js\");\n/* harmony import */ var _SliderViewOption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SliderViewOption */ \"./esm/SliderViewOption.js\");\n\n\n\n\n\n//# sourceURL=webpack://createjs-basic-scrollbar/./esm/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./demoSrc/demo.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
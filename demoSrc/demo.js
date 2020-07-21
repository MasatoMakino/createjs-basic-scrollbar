import { SliderEventType, ScrollBarView, SliderView } from "../";

const onDomContentsLoaded = () => {
  //FPSメーターの生成と配置
  const stats = new Stats();
  stats.showPanel(0);
  stats.domElement.style.cssText =
    "position:absolute; z-index:999; top:0; left:0;";

  document.body.appendChild(stats.domElement);

  //ステージ更新処理
  const updateStage = () => {
    stats.begin();
    stage.update();
    stats.end();
  };

  //stageの初期化
  const canvas = document.getElementById("appCanvas");
  const stage = new createjs.Stage(canvas);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", updateStage);

  initSlider(stage);
  initScrollBar(stage);
};

const getSliderBase = (w, h, color) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill(color);
  g.moveTo(0, 0).lineTo(w, 0).lineTo(w, h).lineTo(0, 0).endFill();

  shape.setBounds(0, 0, w, h);
  return shape;
};

const getSliderMask = (w, h) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill("rgba( 255, 0, 255, 0.0)");
  g.drawRect(0, 0, w, h);
  shape.setBounds(0, 0, w, h);
  return shape;
};

const getSliderButton = (w, h, color) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill(color);
  g.drawRect(-8, 0, 16, h);
  shape.setBounds(-8, 0, 16, h);
  return shape;
};

/**
 * スライダーの実装サンプル
 * @param stage
 */
const initSlider = (stage) => {
  const SLIDER_W = 200;
  const SLIDER_H = 64;

  const slider = new SliderView({
    base: getSliderBase(SLIDER_W, SLIDER_H, "#00f"),
    bar: getSliderBase(SLIDER_W, SLIDER_H, "#0ff"),
    button: getSliderButton(SLIDER_W, SLIDER_H, "rgba( 255, 255, 0, 0.5)"),
    mask: getSliderMask(SLIDER_W, SLIDER_H),
    minPosition: 0,
    maxPosition: SLIDER_W,
    rate: 25.0,
  });

  slider.addEventListener(SliderEventType.CHANGE, (e) => {
    console.log(e.rate);
  });
  stage.addChild(slider);
  slider.x = 200;
  slider.y = 200;
};

const getScrollBarBase = (w, h, color) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill(color);
  g.drawRect(0, 0, w, h);
  shape.setBounds(0, 0, w, h);
  return shape;
};

const getScrollBarButton = (width, color) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill(color);
  g.drawRect(-width / 2, -width / 2, width, width);
  shape.setBounds(-width / 2, -width / 2, width, width);
  shape.x = width / 2;
  return shape;
};

const getScrollBarContents = (color, w, h, container) => {
  const shape = new createjs.Shape();
  const g = shape.graphics;
  g.beginFill(color);
  g.drawRect(0, 0, w, h);
  shape.setBounds(0, 0, w, h);
  container.addChild(shape);
  return shape;
};

const getScrollBarOption = (contentsW, scrollBarH, container) => {
  return {
    targetContents: getScrollBarContents(
      "#f0f",
      contentsW,
      scrollBarH * 2,
      container
    ),
    contentsMask: getScrollBarContents(
      "rgba(0,0,255,0.3)",
      contentsW,
      scrollBarH,
      container
    ),
  };
};

/**
 * スクロールバーの実装サンプル
 * @param stage
 */
const initScrollBar = (stage) => {
  const SCROLLBAR_W = 16;
  const SCROLLBAR_H = 360;
  const SCROLLBAR_Y = 120;
  const CONTENTS_W = 240;

  const container = new createjs.Container();
  stage.addChild(container);
  container.x = 800;
  container.y = SCROLLBAR_Y;

  const scrollbar = new ScrollBarView(
    {
      base: getScrollBarBase(SCROLLBAR_W, SCROLLBAR_H, "#00f"),
      button: getScrollBarButton(SCROLLBAR_W, "#ff0"),
      minPosition: 0,
      maxPosition: SCROLLBAR_H,
      rate: 30.0,
      isHorizontal: false,
    },
    getScrollBarOption(CONTENTS_W, SCROLLBAR_H, container)
  );

  stage.addChild(scrollbar);
  scrollbar.x = container.x + CONTENTS_W;
  scrollbar.y = SCROLLBAR_Y;
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
if (document.readyState !== "loading") {
  onDomContentsLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDomContentsLoaded);
}

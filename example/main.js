export { SliderEvent, SliderEventType } from "./SliderEvent.js";
export { SliderView, SliderViewInitOption } from "./SliderView.js";
export { ScrollBarView, ScrollBarViewInitOption } from "./ScrollBarView.js";

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
  const canvas = document.getElementById("textCanvas");
  canvas.width = 1280;
  canvas.height = 480;
  const stage = new createjs.Stage(canvas);
  createjs.Ticker.on("tick", updateStage);

  //スライダーの実装サンプル

  const sliderContainer = new createjs.Container();
  stage.addChild(sliderContainer);
  sliderContainer.x = 200;
  sliderContainer.y = 200;

  const SLIDER_W = 200;
  const SLIDER_H = 64;
  const getSliderBase = color => {
    const shape = new createjs.Shape();
    const g = shape.graphics;
    g.beginFill(color);
    g.moveTo(0, 0)
      .lineTo(SLIDER_W, 0)
      .lineTo(SLIDER_W, SLIDER_H)
      .lineTo(0, 0)
      .endFill();
    sliderContainer.addChild(shape);
    return shape;
  };

  const getButton = color => {
    const shape = new createjs.Shape();
    const g = shape.graphics;
    g.beginFill(color);
    g.drawRect(-8, 0, 16, SLIDER_H);

    sliderContainer.addChild(shape);
    return shape;
  };

  const sliderBase = getSliderBase("#00f");
  const sliderBar = getSliderBase("#0ff");
  const sliderButton = getButton("#ff0");

  const slider = new SliderView({
    base: sliderBase,
    bar: sliderBar,
    button: sliderButton,
    minPosition: 0,
    maxPosition: SLIDER_W
  });

  slider.addEventListener(SliderEventType.CHANGE, e => {
    console.log(e.rate);
  });
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
if (document.readyState !== "loading") {
  onDomContentsLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDomContentsLoaded);
}

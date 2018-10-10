import { SliderEvent, SliderEventType } from "../bin/index.js";
import { SliderView, SliderViewInitOption } from "../bin/index.js";
import { ScrollBarView, ScrollBarViewInitOption } from "../bin/index.js";

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

  initSlider(stage);
};

/**
 * スライダーの実装サンプル
 * @param stage
 */
const initSlider = stage => {
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

    shape.setBounds(0, 0, SLIDER_W, SLIDER_H);
    return shape;
  };

  const getSliderMask = () => {
    const shape = new createjs.Shape();
    const g = shape.graphics;
    g.beginFill("rgba( 255, 0, 255, 0.0)");
    g.drawRect(0, 0, SLIDER_W, SLIDER_H);
    shape.setBounds(0, 0, SLIDER_W, SLIDER_H);
    return shape;
  };

  const getButton = color => {
    const shape = new createjs.Shape();
    const g = shape.graphics;
    g.beginFill(color);
    g.drawRect(-8, 0, 16, SLIDER_H);
    shape.setBounds(-8, 0, 16, SLIDER_H);
    return shape;
  };

  const slider = new SliderView({
    base: getSliderBase("#00f"),
    bar: getSliderBase("#0ff"),
    button: getButton("rgba( 255, 255, 0, 0.5)"),
    mask: getSliderMask(),
    minPosition: 0,
    maxPosition: SLIDER_W,
    rate: 50.0
  });

  slider.addEventListener(SliderEventType.CHANGE, e => {
    console.log(e.rate);
  });
  stage.addChild(slider);
  slider.x = 200;
  slider.y = 200;
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
if (document.readyState !== "loading") {
  onDomContentsLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDomContentsLoaded);
}

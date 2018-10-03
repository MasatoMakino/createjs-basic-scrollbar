import { CreatejsCacheUtil } from "./createjs-text-cache.js";

const onDomContentsLoaded = () => {
  //FPSメーターの生成と配置
  const stats = new Stats();
  stats.showPanel(0);
  stats.domElement.style.cssText =
    "position:absolute; z-index:999; top:0; left:0;";

  document.body.appendChild(stats.domElement);

  // 生成する文字列の長さ
  const l = 3;
  // 生成する文字列に含める文字セット
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";
  const cl = c.length;
  let r = "";
  for (let i = 0; i < l; i++) {
    r += c[Math.floor(Math.random() * cl)];
  }

  //ステージ更新処理
  const updateStage = () => {
    if (texts) {
      for (let text of texts) {
        CreatejsCacheUtil.cacheText(text, r);
      }
    }
    stats.begin();
    stage.update();
    stats.end();
  };

  //Create.jsのグローバル設定
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Text.prototype.snapToPixel = false;

  //stageの初期化
  const canvas = document.getElementById("textCanvas");
  canvas.width = 1280;
  canvas.height = 480;
  const stage = new createjs.Stage(canvas);
  createjs.Ticker.on("tick", updateStage);

  //Textオブジェクトの配置
  const texts = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 80; j++) {
      const text = new createjs.Text("", "16px Meiryo", "#000");
      text.x = i * 36;
      text.y = j * 20;
      CreatejsCacheUtil.cacheText(text, "TXT");
      stage.addChild(text);
      texts.push(text);
    }
  }
};

/**
 * DOMContentLoaded以降に初期化処理を実行する
 */
if (document.readyState !== "loading") {
  onDomContentsLoaded();
} else {
  document.addEventListener("DOMContentLoaded", onDomContentsLoaded);
}

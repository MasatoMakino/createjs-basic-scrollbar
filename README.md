# createjs-basic-scrollbar

Scrollbar library for CreateJS.

[![Maintainability](https://api.codeclimate.com/v1/badges/cad7f4840c95696dd163/maintainability)](https://codeclimate.com/github/MasatoMakino/createjs-basic-scrollbar/maintainability)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## Demo

[Demo Page](https://masatomakino.github.io/createjs-basic-scrollbar/demo/)

## Getting Started

### Install

createjs-basic-scrollbar depend on [CreateJS / EaselJS](https://github.com/CreateJS/EaselJS)

```bash
npm install easeljs --save-dev
```

or load script files in html.

```html
<script src="https://code.createjs.com/1.0.0/easeljs.min.js"></script>
```

and

```bash
npm install https://github.com/MasatoMakino/createjs-basic-scrollbar.git --save-dev
```

### Add slider

```js
const slider = new SliderView({
  base: new createjs.Bitmap("base.jpg"),
  button: new createjs.Bitmap("button.jpg"),
  minPosition: 0,
  maxPosition: 240
});
stage.addChild(slider);
```

[API documents](https://masatomakino.github.io/createjs-basic-scrollbar/api/)

see also [demo script](https://masatomakino.github.io/createjs-basic-scrollbar/demo/main.js).

## License

createjs-basic-scrollbar is [MIT licensed](LICENSE).

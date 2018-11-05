/**
 * スライダーが移動した際に発行されるイベントです。
 * 現状のスライダー位置を報告します。
 */
export class SliderEvent extends createjs.Event {
    constructor(type, rate, bubbles = false, cancelable = false) {
        super(type, bubbles, cancelable);
        this.rate = rate;
    }
    clone() {
        const evt = new SliderEvent(this.type, this.rate, this.bubbles, this.cancelable);
        return evt;
    }
}
export var SliderEventType;
(function (SliderEventType) {
    SliderEventType["CHANGE"] = "event_slider_change";
    SliderEventType["CHANGE_FINISH"] = "event_slider_change_finish";
})(SliderEventType || (SliderEventType = {}));

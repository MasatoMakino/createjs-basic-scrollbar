/**
 * ...
 * @author m_makino
 */
export class SliderEvent extends createjs.Event {
    constructor(type, bubbles = false, cancelable = false) {
        super(type, bubbles, cancelable);
    }
    clone() {
        let evt = new SliderEvent(this.type, this.bubbles, this.cancelable);
        evt.rate = this.rate;
        return evt;
    }
}
export var SliderEventType;
(function (SliderEventType) {
    SliderEventType["CHANGE"] = "event_slider_change";
    SliderEventType["CHANGE_FINISH"] = "event_slider_change_finish";
})(SliderEventType || (SliderEventType = {}));

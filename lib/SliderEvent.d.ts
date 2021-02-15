/// <reference types="createjs-lib" />
/**
 * スライダーが移動した際に発行されるイベントです。
 * 現状のスライダー位置を報告します。
 */
export declare class SliderEvent extends createjs.Event {
    rate: number;
    constructor(type: SliderEventType, rate: number, bubbles?: boolean, cancelable?: boolean);
    clone(): createjs.Event;
}
export declare enum SliderEventType {
    CHANGE = "event_slider_change",
    CHANGE_FINISH = "event_slider_change_finish"
}
//# sourceMappingURL=SliderEvent.d.ts.map
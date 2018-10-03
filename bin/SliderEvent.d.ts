/// <reference types="createjs-lib" />
/**
 * ...
 * @author m_makino
 */
export declare class SliderEvent extends createjs.Event {
  rate: number;
  constructor(type: SliderEventType, bubbles?: boolean, cancelable?: boolean);
  clone(): createjs.Event;
}
export declare enum SliderEventType {
  CHANGE = "event_slider_change",
  CHANGE_FINISH = "event_slider_change_finish"
}
//# sourceMappingURL=SliderEvent.d.ts.map

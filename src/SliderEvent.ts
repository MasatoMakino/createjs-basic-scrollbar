/**
 * スライダーが移動した際に発行されるイベントです。
 * 現状のスライダー位置を報告します。
 */
export class SliderEvent extends createjs.Event {
  public rate: number;

  constructor(
    type: SliderEventType,
    bubbles: boolean = false,
    cancelable: boolean = false
  ) {
    super(type as string, bubbles, cancelable);
  }

  public clone(): createjs.Event {
    let evt = new SliderEvent(
      this.type as SliderEventType,
      this.bubbles,
      this.cancelable
    );
    evt.rate = this.rate;
    return evt as createjs.Event;
  }
}

export enum SliderEventType {
  CHANGE = "event_slider_change",
  CHANGE_FINISH = "event_slider_change_finish"
}

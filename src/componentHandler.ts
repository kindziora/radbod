
import {dom} from "./dom";

export class componentHandler{

    private _dom: dom;
   // private _eventHandler: eventHandler;

    construct(area: HTMLElement){
       this._dom = new dom(area);
      // this._eventHandler = new eventHandler();
    }


}
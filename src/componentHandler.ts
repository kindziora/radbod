
import {domHandler} from "./dom";

export class componentHandler{

    private _dom: domHandler;
   // private _eventHandler: eventHandler;

    construct(area: HTMLElement){
       this._dom = new domHandler(area);
      // this._eventHandler = new eventHandler();
    }


}
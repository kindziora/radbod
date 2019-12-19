
import dom  from "./dom";
import eventHandler  from "./eventHandler";
import dataStore  from "./datastore";


class kjs{

    private _dom: dom;
    private _eventHandler: eventHandler;

    construct(area: HTMLElement){
       this._dom = new dom(area);
       this._eventHandler = new eventHandler();
    }


}
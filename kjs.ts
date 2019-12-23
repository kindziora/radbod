
import {domHandler} from "./domHandler";
import eventHandler from "./eventHandler";
import dataStore from "./datastore";


class kjs{

    private _dom: domHandler;
    private _eventHandler: eventHandler;

    construct(area: HTMLElement){
       this._dom = new domHandler(area);
       this._eventHandler = new eventHandler();
    }


}
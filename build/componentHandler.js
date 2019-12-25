import { domHandler } from "./domHandler";
export class componentHandler {
    // private _eventHandler: eventHandler;
    construct(area) {
        this._dom = new domHandler(area);
        // this._eventHandler = new eventHandler();
    }
}

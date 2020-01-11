import { dom } from "./dom";
export class componentHandler {
    // private _eventHandler: eventHandler;
    construct(area) {
        this._dom = new dom(area);
        // this._eventHandler = new eventHandler();
    }
}

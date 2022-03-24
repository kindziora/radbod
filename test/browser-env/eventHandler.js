import { eventHandler } from '../build/src/eventHandler.js';

export class testEventHandler {


    constructor() {

        this.eventHandler = new eventHandler();

        let id = this.eventHandler.addEvent("user formular", "element-1", "onclick", function() {
            console.log("hallo welt");
        });

        console.log(id, this.eventHandler.event["user formular"]["element-1"]);


        this.eventHandler.getFunction(id)();

        this.eventHandler.removeEvent(id);

        console.log(this.eventHandler, this.eventHandler.event["user formular"]["element-1"]["onclick"][0]);

    }


}
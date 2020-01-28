import { dom } from '../build/dom.js';
import { dataHandler } from '../build/dataHandler.js';
import { eventHandler } from '../build/eventHandler.js';
import { store } from '../build/store.js';

import browserEnv from 'browser-env';
browserEnv();

export class compileViews {

    constructor(component) {
        this.dataH = new dataHandler(new eventHandler());
        this.maindiv = document.createElement("div");
        this.maindiv.innerHTML = component.html.trim();
        this.domHandler = new dom(this.maindiv, component.components, component.data.call(this.dataH));
        
    }

    compile() {

    }


}
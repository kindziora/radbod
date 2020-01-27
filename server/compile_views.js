import {dom} from '../build/dom.js';
import browserEnv from 'browser-env';
browserEnv();

export class compileViews{

    constructor(html){
        this.maindiv = document.createElement("div");
        this.maindiv.innerHTML = html;
        this.domHandler = new dom(this.maindiv);
        
    }


}
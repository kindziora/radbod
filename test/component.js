import { dataHandler } from '../build/dataHandler.js';
import { eventHandler } from '../build/eventHandler.js';
import { store } from '../build/store.js';
import {domHandler} from '../build/domHandler.js';
import {component} from '../build/component.js';

let widget = {
  "debug": "on",
  "window": {
    "title": "Sample Konfabulator Widget",
    "name": "main_window",
    "width": 500,
    "height": 500,
    "range" : {
      w: 20
    }
  },
  "image": {
    "src": "Images/Sun.png",
    "name": "sun1",
    "hOffset": 250,
    "vOffset": 250,
    "alignment": "center"
  },
  "text": {
    "data": "Click Here",
    "size": 36,
    "style": "bold",
    "name": "text1",
    "hOffset": 250,
    "vOffset": 100,
    "alignment": "center",
    "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
  },
  "$glossary" : store
};


let dataH = new dataHandler(new eventHandler());
 
let widgetStore = dataH.createStore("widget", widget);
  

import { dataHandler } from '../build/dataHandler.js';
import { eventHandler } from '../build/eventHandler.js';
import { store } from '../build/store.js';
import { testDomHandler } from './domHandler.js';
import { component } from '../build/component.js';

let dataH = new dataHandler(new eventHandler());

let user = {
  "userdata": {
    "title": "Sample Konfabulator Widget",
    "usermail": "ak@sdsd.de",
    "username": "alexander",
    "password": "xyz",
    "width": 500,
    "height": 500,
    "range": {
      w: 20
    }
  },
  "address": {
    "src": "Images/Sun.png",
    "name": "sun1",
    "hOffset": 250,
    "vOffset": 250,
    "alignment": "center"
  },
  "contracts": {
    "data": "Click Here",
    "size": 36,
    "style": "bold",
    "name": "text1",
    "hOffset": 250,
    "vOffset": 100,
    "alignment": "center",
    "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
  },
  "$glossary": store
};

let actions = {
  "userdata/username": {
    click() {
      console.log(arguments);
    },
    keyup() {

    },
    "keyup~element-3"() { //address specific element in dom

    }
  }
};


let userStore = dataH.createStore("user", user);

let testDom = (new testDomHandler()).domHandler;

let myComponent = new component(testDom, userStore, actions);

let elements = testDom.getBestMatchingElements("userdata/username");

elements[0].$el.click();

console.log(myComponent.store.events.event);
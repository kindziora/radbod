import { component } from "../../../build/component.js";
import {dom} from '../../../build/dom.js';
import { eventHandler } from '../../../build/eventHandler.js';
import { dataHandler } from '../../../build/dataHandler.js';
import { loginHTML } from './view/login.js';


import browserEnv from 'browser-env';
browserEnv();

//////THIS WOULD MANAGE THE APP/////////////////////////////////////////////
let events = new eventHandler();
let dataH = new dataHandler(events);

///////CREATE DATASTORE/////////////////////////////////////////////////////
let userStore = dataH.createStore("user", { "username": "AlexKindziora", "age": 32, "mail": "kindziora@live.de" });
////////////////////////////////////////////////////////////////////////////

let form = document.createElement("div");
form.setAttribute("data-name", "userform");
form.innerHTML = loginHTML(userStore.data);
class card extends component { }

let domHTML = new dom(form, {});
////////////////////////////////////////////////////////////////////////////

////////CUSTOM EXTENSIONS OF DEFAULT COMPONENT COULD HAPPEN HERE////////////
class login extends component { }
////////////////////////////////////////////////////////////////////////////

///////EXPORT USEABLE COMPONENT/////////////////////////////////////////////
export const loginForm = new login(domHTML, userStore, {
    "/": {
        change(sender, dataStore) {
            console.log("SYNC", arguments);
            return dataStore;
        }
    },
    "/$user/username": {
        click(sender, dataStore) {
            console.log(arguments);
            dataStore.username = "halli hallo";
            return dataStore;
        }
    }
});
////////////////////////////////////////////////////////////////////////////
let elements = loginForm.dom.getBestMatchingElements("/$user/username");

//console.log("value", elements[0].$el.value);

elements[0].$el.click();

console.log(loginForm.dom._area.outerHTML, loginForm.dom);
import { component } from "../../../build/component.js";
import { domHandler } from "../../../build/domHandler.js";
import { eventHandler } from '../../../build/eventHandler.js';
import { dataHandler } from '../../../build/dataHandler.js';
class login extends component {
}
let events = new eventHandler();
let dataH = new dataHandler(events);
let dom = new domHandler();
let userStore = dataH.createStore("user", {});
export const loginForm = new login(dom, userStore, {});

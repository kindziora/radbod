import {dom} from '../build/dom.js';
import browserEnv from 'browser-env';
browserEnv();

let el = document.createElement("div"); 
el.innerHTML = '<form method="post" ><h1 data-name="/$user/name">Payment form <b>${user.name}</b></h1><p>Required fields are followed by <strong><abbr title="required">*</abbr></strong>.</p>${user}</form>';


let els = Array.from(el.querySelectorAll("[data-name]"));

let views = {};

for(let e of els){
  e.setAttribute("data-view", "viewxyz");
  views["viewxyz"] = e.innerHTML;
}
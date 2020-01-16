import {dom} from '../build/dom.js';
import browserEnv from 'browser-env';
browserEnv();

let el = document.createElement("div");
el.innerHTML = '<form method="post" ><h1 data-name="/$user/name">Payment form <b>${data.value.name}</b></h1><p>Required fields are followed by <strong><abbr title="required">*</abbr></strong>.</p>${data.value}</form>';

let d = new dom(el);

let views = {};
for(let i in d.element){
  let e = d.element[i];
  if(!e.$el.hasAttribute("data-view")){
    e.$el.setAttribute("data-view", e.id);
    e.setTemplate(eval('(data)=>`'+ e.$el.innerHTML +'`'));
    console.log(e.template({value: {name: 234234}}));
  }
  
}
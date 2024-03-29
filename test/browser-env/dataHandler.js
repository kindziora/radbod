import { dataHandler } from '../../build/dataHandler.js';
import { eventHandler } from '../../build/eventHandler.js';
import { store } from '../../build/store.js';

let glossary = {
  "title": "example glossary",
  "$widget": store,
  "GlossDiv": {
    "title": "S",
    "GlossList": {
      "GlossEntry": {
        "ID": "SGML",
        "SortAs": "SGML",
        "GlossTerm": "Standard Generalized Markup Language",
        "Acronym": "SGML",
        "Abbrev": "ISO 8879:1986",
        "GlossDef": {
          "para": "A meta-markup language, used to create markup languages such as DocBook.",
          "GlossSeeAlso": [
            "GML",
            "XML"
          ]
        },
        "GlossSee": "markup"
      }
    }
  },
  "GlossSeeAlsoxxx": [
    "GML",
    "XML",
    "ooo"
  ]

};


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
dataH.events.addEvent("widget", "widget", "pre_change", function() {

  return "prepare value ";
});

dataH.events.addEvent("widget", "widget", "change", function() {

  return "proccess 1";
});

dataH.events.addEvent("widget", "widget", "change", function() {
  console.log(arguments);
  return "proccess 2";
});

dataH.events.addEvent("widget", "widget", "post_change", function() {

 
  return "after";
});

dataH.createStore("widget", widget);
dataH.createStore("glossary", glossary);

//console.log(dataH.store.widget.data.window);
 
//dataH.getStore('widget').data.window.range.w = "hello";
//dataH.store.widget.data.window.range.y = "ffx";

console.log(dataH.store.glossary.data);
dataH.store.glossary.data.title = "halli hallo";

//console.log(dataH.store.glossary.data);
//dataH.store.widget.data.window.o = {xx: "ffx"}; // does not spread
//dataH.store.widget.data.window.o = {xx: "fxxxxfx"}; // does not spread

//console.log(dataH.store.widget.data);
//console.log(dataH.store.glossary.data);

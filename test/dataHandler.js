import { dataHandler } from '../build/dataHandler.js';
import { eventHandler } from '../build/eventHandler.js';

let glossary = {
  "title": "example glossary",
  "$widget": {},
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
  "$glossary" : {
    "title" : ""
  }
};



let dataH = new dataHandler(new eventHandler());
dataH.events.addEvent("widget", "widget", "pre_change", function() {

  console.log("PRE", arguments);

  return "prepare value ";
});

dataH.events.addEvent("widget", "widget", "change", function() {
  console.log("ACTION", arguments);

  return "proccess 1";
});

dataH.events.addEvent("widget", "widget", "change", function() {
  console.log("ACTION", arguments);

  return "proccess 2";
});

dataH.events.addEvent("widget", "widget", "post_change", function() {
  console.log("POST", arguments);

 
  return "after";
});

dataH.createStore("widget", widget);
dataH.createStore("glossary", glossary);

dataH.store.widget.data.window.range.w = "hello";

dataH.getStore('widget').data.window.range.w = "hello";
//dataH.store.widget.data.window.range.y = "ffx";

//dataH.store.widget.data.window.o = {xx: "ffx"}; // does not spread
//dataH.store.widget.data.window.o = {xx: "fxxxxfx"}; // does not spread

console.log(dataH.store.glossary.data.$widget);
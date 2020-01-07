import { dataHandler } from '../build/dataHandler.js';

let glossary = {
  "title": "example glossary",
  "$widget": {
    "window": {
      "title": "Sample Konfabulator Widget",
      "name": "main_window",
      "width": 500,
      "height": 500
    }
  },
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
    "height": 500
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

let dataH = new dataHandler();

dataH.createStore("widget", widget);
dataH.createStore("glossary", glossary);
dataH.store.widget.data.window.title ="hello";
console.log(dataH.store.glossary.data.$widget);
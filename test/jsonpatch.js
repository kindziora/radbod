import fastJsonPatch from 'fast-json-patch';

export * from '../node_modules/fast-json-patch/index.mjs';


let jsonOne = {
    "glossary": {
      "title": "example glossary",
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
    }
  };


let jsonTwo = {
    "glossary": {
      "title": "example glossary",
      "GlossDiv": {
        "title": "S",
        "GlossList": {
          "GlossEntry": {
            "ID": "SGML",
            "SortAs": "SGMLxxx",
            "GlossTerm": "Standard Generalized Markup Language",
            "Acronymxxx": "SGML",
            "Abbrev": "ISO 8879:1986",
            "GlossDef": {
              "para": "A meta-markup language, used to create markup languages such as DocBook. asdasd",
              "GlossSeeAlso": [
                "GML",
                "XML",
                "xxx"
              ]
            },
            "GlossSee": "markup"
          }
        }
      },
      "GlossSeeAlsoxxx": [
        "GML",
        "XML"
      ]
    }
  };

  console.log(fastJsonPatch.compare(jsonOne,jsonTwo));
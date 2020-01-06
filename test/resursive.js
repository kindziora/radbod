
function step(sub, pre, paths){ 
  if(pre !=="")
    paths.push(pre);
  for(let i in sub){
    if(typeof sub[i] === "object"){
       step(sub[i], pre + "/" + i, paths);
    }else{
      paths.push(pre + "/" + i);
    }
  } 
  return paths;
}

let jsonTwo = {
"glossary": {
  "$user": { name : "ak" },
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
let all = [];
let ii = step(jsonTwo, "", []);
console.log(ii);



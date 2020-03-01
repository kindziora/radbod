const regex = /[>|}]([\s\w]*?)[<|$]/igm;
const fetchTranslationCalls = /\${_t\(([\s\S]*?)\)/igm;

import { getFiles } from './files.js';

import {mergeDeep} from './merge.js';

import { promises as fs } from 'fs';
import defltYdx from 'yandex-translate-async';
const htmlProperty = /"html":".*?",/gmi;

let YandexTranslate = defltYdx.default;

const yc = new YandexTranslate({
  apiKey:
    '<< YOUR YANDEX API KEY HERE >>'
});

/**
 * 
 * @param {*} folder 
 */
export async function loadAllTranslations(folder){
let translations = {};
  for await (const file of getFiles(folder || './test/todoMVC/src/')) {
     if(/\.json$/.test(file) && file.indexOf("i18n") >-1){
      let content = await fs.readFile(file, 'utf8');
      let existingTranslation = JSON.parse(content);
      
      translations = mergeDeep(translations, existingTranslation);
    }

  }
  
  return translations;
}

export async function writeTranslationBundle(folder, bundleName) {
 let translations = await loadAllTranslations(folder.replace("public/build/dev", "src"));
 await fs.mkdir(folder+ "/i18n/", { recursive: true });

 await fs.writeFile(folder+ "/i18n/" + bundleName, `export const translations = ${JSON.stringify(translations)}`);

}

export async function createFolderAndFiles(file) {
   
  let folder = file.split("/");
  let fname = folder.pop().replace(".html", ".js"); 
  let content;

  await fs.mkdir(folder.join("/") + "/i18n/", { recursive: true });

  try{
   content = await fs.readFile(folder.join("/") + "/i18n/" + fname, 'utf8');

  }catch(e){
    console.log(e); 
    await fs.writeFile(folder.join("/") + "/i18n/" + fname, `export const translations = ${JSON.stringify({en_EN : {}})}`);
  }

}


async function writeToJSFile(file, content, enriched) {
  let strP = JSON.stringify({ html : enriched});

  let inject = `${strP.substring(1, strP.length-1)},`;

  let newFileData = content.replace(htmlProperty, inject);

  let matches = Array.from(newFileData.matchAll(fetchTranslationCalls))
  .map((e)=>e[1][0] ==="'" ||e[1][0] ==='"' ? e[1].substr(1, e[1].length-2): e[1][0]);
  
  let text = {en_EN : {}};

  for(let m = 0; m < matches.length;m++){
    text.en_EN[matches[m]] = matches[m];
  }

  let filenameParts = file.replace("public/build/dev/", "src/").split("/");
  let filename = filenameParts.pop().replace(".js", ".json");
  let transFile = filenameParts.join("/") + "/i18n/" + filename;

  let existingTranslation = {en_EN : {}};
  
  try{
    let content = await fs.readFile(transFile, 'utf8');
    
    existingTranslation = JSON.parse(content);
   

  }catch(e){
    console.log(e); 
  }
 
  text = mergeDeep(text, existingTranslation);
 
  await fs.mkdir(transFile.replace("src/", "public/build/dev/").replace(filename, ""), { recursive: true });

  await fs.writeFile(transFile.replace("src/", "public/build/dev/").replace(".json", ".js"), `export const translations = ${JSON.stringify(text)}`);
  

  let folder = transFile.split("/");
  folder.pop();

  await fs.mkdir(folder.join("/"), { recursive: true });

  await fs.writeFile(transFile, JSON.stringify(text, null, 1));

  return await fs.writeFile(file, newFileData);
}

export async function internationalize(folder) {

  for await (const file of getFiles(folder || './test/todoMVC/public/build/dev/')) {
     if(!/\.js$/.test(file) || file.indexOf("i18n") >-1)continue;

     console.log("internationalize", file);
    try {
      let component = await import(file + "?=c" + new Date());

      let content = await fs.readFile(file, 'utf8');
      let n = Object.keys(component)[0];
      component = component[n];

      if (component.html || component.views) {
        await writeToJSFile(file, content, inject_translateFunc(component.html));
      }
     

    } catch (e) {
      console.log(e);
    }

  }

 await writeTranslationBundle(folder, "app_translations.js");

}

export function extract_text(str) {
  let m;

  let text = {};

  while ((m = regex.exec(str)) !== null) {

    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    m.forEach((match, groupIndex) => {
      if (groupIndex == 1 && match.trim() !== "")
        text[match.trim()] = match.trim();
    });

  }
  return text;
}

export function inject_translateFunc(str) {
  return str.replace(regex, function (match, string) {
    let cleared = string.replace(/\r?\n|\r/gm, "").trim();
    return cleared !== "" ? match.replace(string.replace(/\r?\n|\r/gm, "").trim(), "${_t('" + string.replace(/\r?\n|\r/gm, "").trim() + "')}") : match;
  });
}

/**
    * 
    * @param {*} textObject 
    */
function encodeTextKeys(textObject) {
  let enc = [];
  for (let i in textObject) {
    enc.push(textObject[i]);
  }
  return enc.join("~");
}

/**
 * 
 * @param {*} textObject 
 * @param {*} translationsFromFile 
 */
function decodeTextKeys(textObject, translationsFile) {
  let dec = {};
  let l = 0;
  textObject = textObject.join().split("~");
  for (let i in translationsFile) {
    dec[i] = textObject[l];
    l++;
  }
  return JSON.stringify(dec, null, '\t');
}

export async function writeTranslationFile(str, translationFilePath) {

  let translationFilePathA = translationFilePath.split("/");

  let text = extract_text(str);

  let translationsFromFile = text;

  try {
    let content = await fs.readFile(translationFilePath, 'utf8');
    Object.assign(translationsFromFile, JSON.parse(content));
  } catch (e) {
    console.log(e);
  }

  await fs.mkdir(translationFilePathA.join("/"), { recursive: true });
  await fs.writeFile(translationFilePath, JSON.parse(stringify));

}

export async function translateFile(sourceFilePath, translatedFilePath) {
  let translatedFilePathA = translatedFilePath.split("/");
  let destfilename = translatedFilePathA.pop();
  let destlanguage = destfilename.split(".")[0];

  let sourceFilePathA = sourceFilePath.split("/");
  let srcfilename = sourceFilePathA.pop();
  let srclanguage = srcfilename.split(".")[0];

  try {
    let content = await fs.readFile(sourceFilePath, 'utf8');
    let translationsFromFile = JSON.parse(content);

    let output = await yc.translate(encodeTextKeys(translationsFromFile), {
      langIn: srclanguage.split('_')[0],
      langOut: destlanguage.split('_')[0]
    });

    await fs.writeFile(translatedFilePath, decodeTextKeys(output, translationsFromFile));

  } catch (e) {
    console.log(e);
  }
}
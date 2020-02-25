const regex = /[>|}]([\s\S]*?)[<|$]/igm;

import { promises as fs } from 'fs';
import defltYdx from 'yandex-translate-async';
const htmlProperty = /"html":".*?",/gmi;

let YandexTranslate = defltYdx.default;

const yc = new YandexTranslate({
  apiKey:
    '<< YOUR YANDEX API KEY HERE >>'
});


async function writeToJSFile(file, content, enriched) {
  let newFileData = content.replace(htmlProperty, `html : ${enriched},
  `);

  return await fs.writeFile(file, newFileData);
}

export async function internationalize(folder) {

  for await (const file of getFiles(folder || './test/todoMVC/public/build/dev/')) {

    try {
      let component = await import(file);

      let content = await fs.readFile(file, 'utf8');
      let n = Object.keys(component)[0];
      component = component[n];

      if (component.html || component.views) {
        await writeToJSFile(file, component.html, inject_translateFunc(component.html));
      }

    } catch (e) {
      console.log(e);
    }

  }

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

import path from 'path';
import { promises as fs } from 'fs';

const __dirname = path.resolve();
const template = /<template.*>([^]+)<\/template>/igm;
const script = /<script.*>([^]+)<\/script>/igm;
const scriptLang = /<script.*language\=\"([A-Za-z0-9 _]*)\"/igm;
const openeningBracketObject = /export.*?\s({)/gim;
const style = /<style.*>([^]+)<\/style>/igm;


export async function extract(content) {
    return { html: template.exec(content)[1], js: script.exec(content)[1], css: style.exec(content)[1] };
}

/**
 * 
 * @param {*} script 
 * @param {*} codeToInject 
 */
async function injectCode(script, codeToInject) {
    let find = Array.from(openeningBracketObject.exec(script))[0];
    return script.replace(find, find + codeToInject);
}

export async function merge() {

}

export async function transpile() {

}

async function getName(filepath) {
    return filepath.split("/").pop().split('.')[0];
}

async function getBuildLocation(filepath) {
    return filepath.replace("src", "public/build/dev");
}
async function getSrcLocation(filepath) {
    return filepath.replace("public/build/dev", "src");
}
export async function buildFile(file, ready) {

    console.log("BUILD: try to build " + file);

    let content = await fs.readFile(file, 'utf8');

    let { html, js, css } = await extract(content);
    let slang = scriptLang.exec(content)[1];

    let inject = `
         html : '${html.replace(/\s/ig, " ").replace(/  +/ig, " ")}',
         style : '${css.replace(/\s/ig, " ").replace(/  +/ig, " ")}}',
         `;

    let newFile = await injectCode(js, inject);
    let fileBuilt = await getBuildLocation(file);
    fileBuilt = fileBuilt.replace("html", slang);

    let error = await fs.writeFile(fileBuilt, newFile);

    if (error) console.log(error);

    let compoN;
    try {
        compoN = await import(fileBuilt);
        ready(compoN);
    } catch (e) {
        if (e.code === "ERR_MODULE_NOT_FOUND") {
            let nf = await getSrcLocation(e.stack.match(/Cannot find module (.*) imported/i)[1] + ".html");
            console.log("BUILD: found import try to build " + nf);

            let subFile = await buildFile(nf, ready);
        } else {
            console.log(e);
        }
    }








}



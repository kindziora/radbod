
import path from 'path';
import { promises as fs } from 'fs';

const __dirname = path.resolve();
const template = /<template.*>([^]+)<\/template>/igm;
const script = /<script.*>([^]+)<\/script>/igm;
const scriptLang = /<script.*language\=\"([A-Za-z0-9 _]*)\"/igm;
const openeningBracketObject = /export.*?\s({)/gim;
const importStatement = /import(.*?)from\s+"(.*?)";/ig;
const style = /<style.*>([^]+)<\/style>/igm;

export async function extract(content) {
    return { html: Array.from(content.matchAll(template))[0][1], js: Array.from(content.matchAll(script))[0][1], css: Array.from(content.matchAll(style))[0][1] };
}

/**
 * 
 * @param {*} script 
 * @param {*} codeToInject 
 */
async function injectCode(script, codeToInject) {
    let find = Array.from(script.matchAll(openeningBracketObject))[0][0];
    return script.replace(find, find + codeToInject);
}

/**
 * 
 * @param {*} script 
 * @param {*} extension 
 */
async function replaceImports(script, extension) {
    return script.replace(importStatement, 'import \$1 from "\$2.' + extension + '";')
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
    let slang = Array.from(content.matchAll(scriptLang))[0][1];
    
    let inject = `
         html : '${html.replace(/\s/ig, " ").replace(/  +/ig, " ")}',
         style : '${css.replace(/\s/ig, " ").replace(/  +/ig, " ")}}',
         `;


    let replacedImports =  await replaceImports(js, slang);
    let newFile = await injectCode(replacedImports, inject);

    let fileBuilt = await getBuildLocation(file);
    fileBuilt = fileBuilt.replace("html", slang);

    let error = await fs.writeFile(fileBuilt, newFile);

    if (error) console.log(error);

    let compoN;
    try {
        compoN = await import(fileBuilt);
        await ready(compoN);
        return true;
    } catch (e) {
        if (e.code === "ERR_MODULE_NOT_FOUND") {
            let nf = await getSrcLocation(e.stack.match(/Cannot find module (.*) imported/i)[1].replace('.js', '.html'));
            console.log("BUILD: found import try to build " + nf);

            let subFile = await buildFile(nf, function(sub){
                console.log("SUBLOADING WITHOUT CB");
            });
            compoN = await import(fileBuilt);
            await ready(compoN);
        } else {
            console.log(e);
        }
    }








}



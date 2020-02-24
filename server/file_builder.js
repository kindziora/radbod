
import path from 'path';
import { promises as fs } from 'fs';
 
const __dirname = path.resolve();
const template = /<template.*>([^]+)?<\/template>/igm;
const script = /<script.*>([^]+)?<\/script>/igm;
const scriptLang = /<script.*language\=\"([A-Za-z0-9 _]*)\"/igm;
const openeningBracketObject = /export.*?\s({)/gim;
const importStatement = /import(.*?)from\s+("|')(.*?)("|');/ig;
const style = /<style.*>([^]+)?<\/style>/igm;

let options = { buildPath: "public/build/dev" };

export async function extract(content) {

    let html = Array.from(content.matchAll(template))[0][1];
    content = content.replace(html, "");
    let js = Array.from(content.matchAll(script))[0][1];
    content = content.replace(js, "");
    let css = Array.from(content.matchAll(style))[0][1];
    
    return { html, js, css};
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
    return script.replace(importStatement, 'import \$1 from "\$3.' + extension + '";');
}

async function getName(filepath) {
    return filepath.split("/").pop().split('.')[0];
}

async function getBuildLocation(filepath) {
    return filepath.replace("src", options.buildPath);
}
async function getSrcLocation(filepath) {
    return filepath.replace(options.buildPath, "src");
}
export async function buildFile(file, opts) {
    options = opts ? opts : options;

    if(file.indexOf(".") ==-1){
        file = file+ ".html";
    }

    console.log("BUILD: try to build " + file);

    let content = await fs.readFile(file, 'utf8');

    if(!Array.from(content.matchAll(template))[0]){
        console.log("no template tag in single file component: ", file)
        return;
    };
    
    let { html, js, css } = await extract(content);
    let slang = Array.from(content.matchAll(scriptLang))[0][1];

    let inject = `
         html : '${JSON.stringify(html.replace(/\s/ig, " ").replace(/  +/ig, " ").replace(/'/g, '"').trim())}',
         style : '${JSON.stringify(css.replace(/\s/ig, " ").replace(/  +/ig, " ").replace(/'/g, '"').trim())}',`;

    let replacedImports = await replaceImports(js, slang);
    let newFile = await injectCode(replacedImports, inject);

    let fileBuilt = await getBuildLocation(file);
    fileBuilt = fileBuilt.replace("html", slang);

    let bpath = fileBuilt.split("/");
    bpath.pop();

    await fs.mkdir(bpath.join("/"), { recursive: true });
    
    await fs.writeFile(fileBuilt, newFile);

    return {fileBuilt, newFile, slang};

}


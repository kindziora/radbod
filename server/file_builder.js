
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const template = /<template.*>([^]+)<\/template>/igm;
const script = /<script.*>([^]+)<\/script>/igm;
const scriptLang = /<script(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/igm;
const openeningBracketObject = /export.*?\s({)/gim;
const style = /<style.*>([^]+)<\/style>/igm;


export function extract(content){
    return {html : Array.from(template.exec(content))[1], js: Array.from(script.exec(content))[1], css : Array.from(style.exec(content))[1]};
}

/**
 * 
 * @param {*} script 
 * @param {*} codeToInject 
 */
function injectCode(script, codeToInject){
    let find = Array.from(openeningBracketObject.exec(script))[0];
    return script.replace(find, find + codeToInject);
}

export function merge(){

}

export function transpile(){
    
}

function getName(filepath) {
    return filepath.split("/").pop().split('.')[0];
}

export function buildFile(file){
    
    fs.readFile(file, 'utf8', function(err, content) {
        
        let {html, js, css} = extract(content);

        let inject = `
         html : '${html.replace(/\s/ig, " ").replace(/  +/ig, " ")}',
         style : '${css.replace(/\s/ig, " ").replace(/  +/ig, " ")}}',
         `;
        
        let newFile = injectCode(js, inject);
     
        fs.writeFile(getName(file) + ".js", newFile, (err) => {
            if (err) console.log(err);

        });


    });   

    

}
 

 
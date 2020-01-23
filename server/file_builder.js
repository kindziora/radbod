
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const template = /<template.*>([^]+)<\/template>/igm;
const script = /<script.*>([^]+)<\/script>/igm;
const style = /<style.*>([^]+)<\/style>/igm;


function extract(content){
    return {html : Array.from(template.exec(content))[1], js: Array.from(script.exec(content))[1], css : Array.from(style.exec(content))[1]};
}

export function merge(){

}

export function transpile(){
    
}

export function extract(file){
  
    
    fs.readFile('DATA', 'utf8', function(err, contents) {
       
        let {html, js, css} = extract(content);

        console.log(contents);

        fs.writeFile("temp.txt", data, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });



    });   

    

}
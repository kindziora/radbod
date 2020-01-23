
import path from 'path';
const __dirname = path.resolve();


export function html_loader(req, res, next){
    
    const srcPath = __dirname + "/test/browser/app";
    const page = "/page";
    const view = "/view";
    const code = "/code";

    console.log(__dirname, req.url);

    

    next();

}
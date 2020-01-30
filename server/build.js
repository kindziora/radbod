import * as fbuilder from './file_builder.js';
import {compileViews} from './compile_views.js';

import path from 'path';
import { promises as fs } from 'fs';

fbuilder.buildFile('/home/akindziora/projekte/kjs/test/todoMVC/src/component/todo.html', async function(component, file) {
    let cmper = new compileViews();
    
    component = cmper.compile(component);
    
    let enhanced = JSON.stringify(component, (k,v) => typeof v === "function" ? ">>>>!" + v + "!<<<<" : v);

 //regex inject views, remove plain html
   // await fs.writeFile(file, enhanced.replace(/">>>>!|!<<<<"/g, ""));

   // JSON.parse(json, (k,v) => typeof v === "string"? (v.startsWith('function')? eval("("+v+")") : v): v);

}, {
    buildPath : "public/build/dev"
});
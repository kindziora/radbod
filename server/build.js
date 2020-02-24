import {buildSFC} from './build_sfc.js';
import { compileViews } from './compile_views.js';
import { copyFiles } from './copyFiles.js';

(async () => {

    await copyFiles(process.argv[2], {extension : "js"});
    await buildSFC(process.argv[2]);
    let v = new compileViews();
    await v.compileMultiple(process.argv[3]);
    
}) ();

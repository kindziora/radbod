import {buildSFC} from './build_sfc.js';
import { compileViews } from './compile_views.js';
import { copyFiles } from './copyFiles.js';
import { internationalize, loadAllTranslations } from './translation.js';


(async () => {

    await copyFiles(process.argv[2], {extension : "js"});
    
    await buildSFC(process.argv[2]);
    
    await internationalize(process.argv[3]);
    
    let v = new compileViews();
    await v.compileMultiple(process.argv[3]);
    
}) ();

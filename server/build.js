import {buildSFC} from './build_sfc.js';
import { compileViews } from './compile_views.js';

(async () => {
    await buildSFC(process.argv[2]);
    let v = new compileViews();
    await v.compileMultiple(process.argv[3]);
    
}) ();

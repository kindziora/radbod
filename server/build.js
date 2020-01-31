import * as fbuilder from './file_builder.js';
import {compileViews} from './compile_views.js';

import {getFiles} from './files.js';
import { promises as fs } from 'fs';

(async () => {
    for await (const file of getFiles('/home/akindziora/Downloads/projekte/kjs/test/todoMVC/src/page')) {
        
        fbuilder.buildFile(file, async function(component, file, content) {
            let cmper = new compileViews();
            
            component = cmper.compile(component);

            await cmper.writeToJSFile(file, content, component);
           
        }, {
            buildPath : "public/build/dev"
        });
    }
})();
 
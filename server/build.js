import * as fbuilder from './file_builder.js';
import {compileViews} from './compile_views.js';

fbuilder.buildFile('/home/akindziora/projekte/kjs/test/todoMVC/src/component/todo.html', async function(component) {
    let cmper = new compileViews();
    
    let views = cmper.compile(component);

    console.log(views);

}, {
    buildPath : "public/build/dev"
});
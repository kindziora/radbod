import * as fbuilder from './file_builder.js';
import {compileViews} from './compile_views.js';

fbuilder.buildFile('/home/akindziora/projekte/app/src/page/home.html', async function(component) {

    console.log(component);
    let cmper = new compileViews(component.home);
     
});
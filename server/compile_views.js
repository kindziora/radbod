import { app } from '../build/app.js';
import browserEnv from 'browser-env';
browserEnv();

export class compileViews {

    constructor(componentInfo) {
        
        let name = Object.keys(componentInfo)[0];
        let component = componentInfo[name];
        let views = {};
        views[name] = component.html.trim(); 
 
        let buildApp = new app();
        let compo = buildApp.createComponent(name, views, component.data.call(buildApp.dataH), component.interactions(), component.components);

        console.log(compo);
    }

    compile() {

    }


}
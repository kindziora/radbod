import { app } from '../build/app.js';
import browserEnv from 'browser-env';
browserEnv();

export class compileViews {

    constructor() {

    }

    compile(componentInfo) {

        let name = Object.keys(componentInfo)[0];
        let component = componentInfo[name];
        let views = {};
        views[name] = component.html.trim();

        let buildApp = new app();

        let compo = buildApp.createComponent(
            name,
            views,
            component.data.call(buildApp.dataH),
            component.interactions(),
            component.components
        );
        
        let viewsFinal = {};

        for (let i in compo.dom.element) {
            let element = compo.dom.element[i];
            if(element.template)
                viewsFinal[element.id] = element.template ? element.template.toString() : null;
        }
        viewsFinal[name] = compo.dom.template.toString();
        component['views'] = viewsFinal;
        delete component.html;
        return component;

    }


}
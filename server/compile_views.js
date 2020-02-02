import { app } from '../build/app.js';
import { getFiles } from './files.js';

import browserEnv from 'browser-env';
browserEnv();

import { promises as fs } from 'fs';

const htmlProperty = /html.*:.*'.*'(\s+|)+,/gmi;

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
        let strVws = [];
        for (let i in compo.dom.element) {
            let element = compo.dom.element[i];
            if (element.template) {
                viewsFinal[element.id] = element.template ? element.template : null;
                strVws.push(`'${element.id}' : ${element.template.toString()}`);
            }
        }
        viewsFinal[name] = compo.dom.template;
        strVws.push(`'${name}' : ${compo.dom.template.toString()}`);
        component['views'] = viewsFinal;
        component['viewsTemplate'] = `{
             ${strVws.join(`,
        `).replace(/=""/g, '')} }`;
        delete component.html;
        return component;

    }

    /**
     * 
     * @param {*} file 
     * @param {*} content 
     * @param {*} component 
     */
    async writeToJSFile(file, content, component) {
        let newFileData = content.replace(htmlProperty, `views : ${component.viewsTemplate},
        `);

        return await fs.writeFile(file, newFileData);
    }

    /**
     * 
     * @param {*} folder 
     * @param {*} options 
     */
    async compileMultiple(folder) {
        for await (const file of getFiles(folder || '/home/akindziora/projekte/kjs/test/todoMVC/public/build/dev/')) {

            console.log("BUILD VIEW: " + file);

            try {
                let component = await import(file);
                 let content = await fs.readFile(file, 'utf8');
                let cmp = this.compile(component);
 
                await this.writeToJSFile(file, content, cmp);

            } catch (e) {
                console.log(e);
            }



        }

    }


}
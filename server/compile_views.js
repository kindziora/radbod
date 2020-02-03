import { getFiles } from './files.js';
import puppeteer from "puppeteer";
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

        let buildApp = new lofo.app();

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
        component.plain = compo.$el.shadowRoot.innerHTML;
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
        plain: '${component.plain}',`);

        return await fs.writeFile(file, newFileData);
    }

    /**
     * 
     * @param {*} folder 
     * @param {*} options 
     */
    async compileMultiple(folder) {

        let rbd = await fs.readFile("./dist/radbod.js", 'utf8');

        const browser = await puppeteer.launch({
            
            args: ["--disable-web-security", `--user-data-dir=data`],
           
        });
        const page = await browser.newPage();

        await page.setBypassCSP(true);

        await page.addScriptTag({ content: rbd });

        for await (const file of getFiles(folder || './test/todoMVC/public/build/dev/')) {

            console.log("BUILD VIEW: " + file);

            try {
                let component = await import(file);

                let content = await fs.readFile(file, 'utf8');
                let n = Object.keys(component)[0];
                component = component[n];

                // Get the "viewport" of the page, as reported by the page.
                const cmp = await page.evaluate((n, componentSerialized) => {

                    function ev() {
                        return {}
                    }

                    let component = JSON.parse(componentSerialized, (k, v) => typeof v === "string" ? (/^(.*)\(\)/.exec(v) !== null ? ev : v) : v);

                    let buildApp = new window.radbod.app();

                    let views = {};
                    views[n] = component.html.trim();

                    let compo = buildApp.createComponent(
                        n,
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
                    viewsFinal[n] = compo.dom.template;
                    strVws.push(`'${n}' : ${compo.dom.template.toString()}`);
                    component['views'] = viewsFinal;
                    component['viewsTemplate'] = `{
                ${strVws.join(`,
            `).replace(/=""/g, '')} }`;

                    component.plain = compo.$el.shadowRoot ? compo.$el.shadowRoot.innerHTML: '';

                    return component;

                }, n, JSON.stringify(component, (k, v) => typeof v === "function" ? v.toString() : v));

                await this.writeToJSFile(file, content, cmp);

            } catch (e) {
                console.log(e);
            }

        }

         await browser.close();

    }


}

/**
 *  componentInfo = JSON.parse(componentInfo, (k,v) => typeof v === "string"? ((m = /^(.*)\(\)/.exec(v)) !== null? eval("("+v+")") : v): v);



                    let name = Object.keys(componentInfo)[0];
                    let component = componentInfo[name];
                    let views = {};
                    views[name] = component.html.trim();

                    let buildApp = new lofo.app();

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
                    component.plain = compo.$el.shadowRoot.innerHTML;

                    return component;
 */
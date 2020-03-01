import { getFiles } from './files.js';
import puppeteer from "puppeteer";
import { promises as fs } from 'fs';

const htmlProperty = /"html":".*?",/gmi;

export class compileViews {

    constructor() {

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

        let rbd = await fs.readFile("./dist/radbod.js", 'utf8');

        const browser = await puppeteer.launch({
          //  headless: false,
           // devtools: true,
            args: ["--disable-web-security"],
        });
        const page = await browser.newPage();

        await page.setBypassCSP(true);

        await page.addScriptTag({ content: rbd });

        for await (const file of getFiles(folder || './test/todoMVC/public/build/dev/')) {

            if (file.split(".")[1] !== "js") continue;

            console.log("BUILD VIEW: " + file);

            try {
                let component = await import(file + "?t=" + new Date());

                let content = await fs.readFile(file, 'utf8');
                let n = Object.keys(component)[0];
                component = component[n];

                if (component.html || component.views) {
                    // Get the "viewport" of the page, as reported by the page.
                    const cmp = await page.evaluate((n, componentSerialized) => {
 

                        let component = JSON.parse(componentSerialized,
                            (k, v) => typeof v === "string" ?
                                (/(.*)\(/.exec(v) !== null && k !=="html" ? ((v) => {

                                    console.log(v);

                                    let ret = "";
                                    try {
                                        ret = eval(`(function ${v} )`);
                                    } catch (e) {
                                        ret = eval(`(${v} )`);
                                    }

                                    return ret
                                })(v) : v) : v);


                        let buildApp = new window.radbod.app();

                        let views = {};

                        console.log("NAME:", n, component);

                        views[n] = component.html;

                        let store = component.data ? component.data.call(buildApp.dataH) : {};
                        let compo = buildApp.createComponent(
                            n,
                            views,
                            store,
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
                        
                        return component;

                    }, n, JSON.stringify(component, (k, v) => typeof v === "function" ? v.toString() : v));

                    await this.writeToJSFile(file, content, cmp);
                }


            } catch (e) {
                console.log(e);
            }

        }

        await browser.close();

    }


}
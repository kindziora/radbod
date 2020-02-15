
    import  {head}  from "./component/head.js";

    export let index = {
         html : '<!DOCTYPE html> <html lang="${index.env.language}"> <head data-name="/$head"></head> <body> <!-- Google Tag Manager (noscript) --> <noscript> <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PK67MDD" height="0" width="0" style="display:none;visibility:hidden"></iframe> </noscript> <!-- End Google Tag Manager (noscript) --> <noscript> <a href="${ index.config.host }${index.config.webserver_port}/">${ _t('please enable your javascript...') }</a> </noscript> <progress class="progress loading is-info" data-name="progress" value="0" max="100" style="width: 100%;"></progress> <app class="section" id="section" style="display:none;" data-defaultvalues="model"> ${index.html} </app> ${index.js} </body> </html>',
         style : '',
        components: {"head-component" : head},
        data(params){
            return this.createStore("index", {
                js : getJS(),
                html: getHTML(),
                config : getConfig(),
                env : getEnvironment()
            })
        },
        interactions(){
            return { }
        }

    }

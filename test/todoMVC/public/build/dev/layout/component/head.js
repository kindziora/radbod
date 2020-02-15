
    import  {functions as f}  from "./../functions.js";

    export let head = {
         html : "<!-- Google Tag Manager --> <script>${head.ga}</script> <!-- End Google Tag Manager --> <meta name=\"robots\" content=\"index, follow\"> <meta name=\"robots\" content=\"all\"> <meta name=\"built\" content=\"${head.manifest.built}\" /> <meta name=\"served\" content=\"${now()}\" /> <meta charset=\"utf-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0\"> <meta name=\"theme-color\" content=\"${head.manifest.theme_color}\"> <meta name=\"description\" content=\"${ _t('meta.description.' + head.page) ? _t('meta.description.' + head.page) : _t('meta.description.home') }\"> <meta name=\"keywords\" content=\"${ _t('meta.keywords.' + head.page) ? _t('meta.keywords.' + head.page) : _t('meta.keywords.home') }\"> ${head.langLinks} <base href=\"${ head.config.host }${head.config.webserver_port}/\"> <!-- COMMON TAGS --> <title> ${ _t( \"meta.title.\" + head.page) == \"meta.title.\" + head.page ? _t( \"meta.title.home\") : _t( \"meta.title.\" + head.page) } </title> <!-- Search Engine --> <meta name=\"image\" content=\"{{head.manifest.icons[0].src}}\"> <!-- Schema.org for Google --> <meta itemprop=\"name\" content=\"\"> <meta itemprop=\"description\" content=\"\"> <meta itemprop=\"image\" content=\"${head.manifest.icons[0].src}\"> <!-- Twitter --> <meta name=\"twitter:card\" content=\"summary\"> <meta name=\"twitter:title\" content=\"\"> <meta name=\"twitter:description\" content=\"\"> <meta name=\"twitter:site\" content=\"\"> <meta name=\"twitter:creator\" content=\"\"> <meta name=\"twitter:image:src\" content=\"\"> <!-- Open Graph general --> <meta name=\"og:title\" content=\"\"> <meta name=\"og:description\" content=\"\"> <meta name=\"og:image\" content=\"${head.manifest.icons[0].src}\"> <meta name=\"og:url\" content=\"${head.manifest.homepage_url}\"> <meta name=\"og:site_name\" content=\"\"> <meta name=\"og:locale\" content=\"${head.langCode}\"> <meta name=\"fb:admins\" content=\"\"> <meta name=\"fb:app_id\" content=\"\"> <meta name=\"og:type\" content=\"website\"> <link rel=\"apple-touch-icon\" href=\"${head.manifest.icons[2].src}\"> <link rel=\"icon\" type=\"image/png\" href=\"${head.manifest.icons[1].src}\" /> <link rel=\"manifest\" href=\"/public/manifest_${head.env.langCode}.json\"> ${head.jsonld}",
         style : "",
        components: {},
        data(){
            return this.createStore("head", { 
               "ga" : f.getGoogleAnalytics(),
               "jsonld" : "",
               "manifest" : f.getManifest(),
               "env" : f.getEnvironment()

            })
        },
        interactions(){
            return { }
        }

    }



    export let xtern = {
        views : {
'xtern' : (change,xternal)=>`<h2>${_t('externe daten')}</h2> <div> ${_t('xtern')} ${ todos.name } </div>` },
        "style":"","path":"/component/xtern.js",
        
        components: {},
        data(){
            return this.createStore("xternal", { 
                name : "AK xternal",
                items:[{
                        label: "xternal",
                        checked: false
                      }]
            })
        },
        interactions(){
            return { }
        }

    }

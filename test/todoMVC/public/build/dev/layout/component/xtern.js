

    export let xtern = {
         views : {
                'xtern' : (change,xternal)=>`<h2>externe daten</h2> <div> xtern ${ todos.name } </div>` },
        plain: '',
         style : '',
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


    export let todo = {
         html : ' <header class="header"> <h1>todos</h1> <input class="new-todo" data-name="/$todo" placeholder="What needs to be done?" autofocus /> </header> <section style="display:none" class="main"> <input id="toggle-all" data-id="toggle-all" class="toggle-all" type="checkbox" data-name="/$items" /> <label for="toggle-all">Mark all as complete</label> <ul class="todo-list" data-name="/$items"> <li data-name="/$items/${change.index}"> <div class="view"> <input class="toggle" ${ change.value.checked ? `checked` : `` } type="checkbox"> <label data-name="/$items/${change.index}">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy"></button> </div> </li> </ul> <footer class="footer"> <span class="todo-count"></span> <ul class="filters"> <li> <a href="#/" class="selected">All</a> </li> <li> <a href="#/active">Active</a> </li> <li> <a href="#/completed">Completed</a> </li> </ul> <button class="clear-completed">Clear completed</button> </footer> </section> ',
         style : ' }',
         
        components: {},
        data(){
            return this.createStore("todos", { 
                items:[{
                        label: "Testdaten",
                        checked: false
                      }]
            })
        },
        interactions(){
            return {
                "/$todo" : {
                    "keyup"(sender, dataStore) { //address specific element in dom
                        console.log('toggle-all', sender.field.getValue());
                    }
                },
                "/$items" : {
                    "click#toggle-all"(sender, dataStore) { //address specific element in dom
                        console.log('toggle-all', sender.field.getValue());
                    }
                },
                "/$items/${change.index}": {
                    "click#destroy"(sender, dataStore) { //address specific element in dom
                        console.log('destroy', sender);
                    }
                }
            } 
        }

    }

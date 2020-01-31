
    export let todo = {
         views : {
             'element-4' : (change, todos ) => `<li data-name="/$items/${change.index}"> <div class="view"> <input class="toggle" ${change.value.checked?`checked`:``}="" type="checkbox"> <label data-name="/$items/${change.index}">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy"></button> </div> </li>`,
        'element-5' : (change, todos ) => `<div class="view"> <input class="toggle" ${change.value.checked?`checked`:``}="" type="checkbox"> <label data-name="/$items/${change.index}">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy"></button> </div>`,
        'element-6' : (change, todos ) => `${change.value.label}`,
        'todo' : (change,todos)=>`<header class="header"> <h1>todos</h1> <input class="new-todo" data-name="/$todo" placeholder="What needs to be done?" autofocus="" data-id="element-2" data-view="element-2"> </header> <section style="display:none" class="main"> <input id="toggle-all" data-id="toggle-all" class="toggle-all" type="checkbox" data-name="/$items" data-view="toggle-all"> <label for="toggle-all">Mark all as complete</label> <ul class="todo-list" data-name="/$items" data-type="list" data-id="element-4" data-view="element-4"> <li data-name="/$items/${change.index}" data-id="element-5" data-view="element-5"> <div class="view"> <input class="toggle" ${change.value.checked?`checked`:``}="" type="checkbox"> <label data-name="/$items/${change.index}" data-id="element-6" data-view="element-6">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy" data-view="destroy"></button> </div> </li> </ul> <footer class="footer"> <span class="todo-count"></span> <ul class="filters"> <li> <a href="#/" class="selected">All</a> </li> <li> <a href="#/active">Active</a> </li> <li> <a href="#/completed">Completed</a> </li> </ul> <button class="clear-completed">Clear completed</button> </footer> </section>` },
        
         style : '',
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

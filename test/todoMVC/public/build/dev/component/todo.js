
    import  {xtern}  from "./xtern.js";

    export let todo = {
        views : {
'element-4' : (change, todo,todos ) => `<li data-name="/$items/${change.index}"> <div class="view"> <input class="toggle" ${change.value.checked?`checked`:``} type="checkbox"> <label data-name="/$items/${change.index}">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy"></button> </div> </li>`,
'element-5' : (change, todo,todos ) => `<div class="view"> <input class="toggle" ${change.value.checked?`checked`:``} type="checkbox"> <label data-name="/$items/${change.index}">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy"></button> </div>`,
'element-6' : (change, todo,todos ) => `${change.value.label}`,
'todo' : (change,todo,todos,xternal)=>`<header class="header"> <h1>${_t('todos')} ${todos.name} ${todos.name} </h1> <input class="new-todo" data-name="/$todo" placeholder="What needs to be done?" autofocus data-id="element-2" data-view="element-2"> </header> <section style="display:none" class="main"> <input id="toggle-all" data-id="toggle-all" class="toggle-all" type="checkbox" data-name="/$items" data-view="toggle-all"> <label for="toggle-all">${_t('Mark all as complete')}</label> <ul class="todo-list" data-name="/$items" data-type="list" data-id="element-4" data-view="element-4"> <li data-name="/$items/${change.index}" data-id="element-5" data-view="element-5"> <div class="view"> <input class="toggle" ${change.value.checked?`checked`:``} type="checkbox"> <label data-name="/$items/${change.index}" data-id="element-6" data-view="element-6">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy" data-view="destroy"></button> </div> </li> </ul> <xtern-component data-name="xtern-component" data-id="component-1"><h2>externe daten</h2> <div> xtern ${ todos.name } </div></xtern-component> <footer class="footer"> <span class="todo-count"></span> <ul class="filters"> <li> <a href="#/" class="selected">${_t('All')}</a> </li> <li> <a href="#/active">${_t('Active')}</a> </li> <li> <a href="#/completed">${_t('Completed')}</a> </li> </ul> <button class="clear-completed">${_t('Clear completed')}</button> </footer> </section>` },
        "style":"","path":"/component/todo.js",
        
        components: {"xtern-component" : xtern},
        data(dataReady){
            return this.createStore("todos", { 
                name : "AK TODOS",
                items:[{
                        label: "Testdaten",
                        checked: false
                      }]
            }).load({id: 1}, dataReady);
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


    import  {todo}  from "../component/todo.js";
     
    export let home = {
        views : {
'home' : (change,home,todos)=>`<h1>Hallo ${todos.name}</h1> <section class="todoapp"> <todo-component data-name="todo-component" data-id="component-1"><header class="header"> <h1>todos ${todos.name} ${todos.name} </h1> <input class="new-todo" data-name="/$todo" placeholder="What needs to be done?" autofocus data-id="element-2" data-view="element-2"> </header> <section style="display:none" class="main"> <input id="toggle-all" data-id="toggle-all" class="toggle-all" type="checkbox" data-name="/$items" data-view="toggle-all"> <label for="toggle-all">Mark all as complete</label> <ul class="todo-list" data-name="/$items" data-type="list" data-id="element-4" data-view="element-4"> <li data-name="/$items/${change.index}" data-id="element-5" data-view="element-5"> <div class="view"> <input class="toggle" ${change.value.checked?`checked`:``} type="checkbox"> <label data-name="/$items/${change.index}" data-id="element-6" data-view="element-6">${change.value.label}</label> <button class="destroy" data-name="/$items/${change.index}" data-id="destroy" data-view="destroy"></button> </div> </li> </ul> <xtern-component data-name="/$items"></xtern-component> <footer class="footer"> <span class="todo-count"></span> <ul class="filters"> <li> <a href="#/" class="selected">All</a> </li> <li> <a href="#/active">Active</a> </li> <li> <a href="#/completed">Completed</a> </li> </ul> <button class="clear-completed">Clear completed</button> </footer> </section></todo-component> </section> <footer class="info"> <p>Double-click to edit a todo</p> <p>Written by <a href="http://twitter.com/lukeed05">Luke Edwards</a></p> <p>Refactored by <a href="https://github.com/xorgy">Aaron Muir Hamilton</a></p> <p>Part of <a href="http://todomvc.com">TodoMVC</a></p> </footer> ${_t("asas")}` },
        "style":"",
        components: {"todo-component" : todo},
        data(){
            return this.createStore("home", {name : "AK home"});
        },
        interactions(){
            return { }
        }
    }

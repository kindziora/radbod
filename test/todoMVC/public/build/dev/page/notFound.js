
    import  {todo}  from "../component/todo.js";
     
    export let notFound = {
         html : "<h1>Hallo not FOUND ${todos.name}</h1> <section class=\"todoapp\"> <todo-component data-name=\"/$items\"></todo-component> </section> <footer class=\"info\"> <p>Double-click to edit a todo</p> <p>Written by <a href=\"http://twitter.com/lukeed05\">Luke Edwards</a></p> <p>Refactored by <a href=\"https://github.com/xorgy\">Aaron Muir Hamilton</a></p> <p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p> </footer>",
         style : "",
        components: {"todo-component" : todo},
        data(){
            return this.createStore("home", {name : "AK home"});
        },
        interactions(){
            return { }
        }
    }

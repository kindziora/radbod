import {domHandler} from '../build/domHandler.js';

export class testDomHandler{
    

    constructor(){
        this.maindiv = document.createElement("div");
        this.maindiv.innerHTML = `<form action="">

        <label for="GET-name">Name:</label>
        <input id="GET-name" type="text" data-name="name">
        <input type="submit" value="Save">
    
        <label for="POST-name">Name:</label>
        <input id="POST-name" type="text" data-name="name">
        <input type="submit" value="Save">
       
        <fieldset>
          <legend>Title</legend>
          <input type="radio" name="radio" id="radio"> <label for="radio">Click me</label>
        </fieldset>

      </form>`;

        this.domHandler = new domHandler(this.maindiv);

        console.log(this.domHandler);

    }


}
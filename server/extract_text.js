const regex = /[>|}]([\s\S]*?)[<|$]/igm;
const str = `    <h1>Hallo \${todos.name} sdf
 </h1>
    <section class="todoapp">
        <todo-component data-name="/\$items"></todo-component>
    </section>
<table>
</table>
    <footer class="info">
        <p>asd dsa d d \${ _t('Double-click to edit a todo') } f df gdf gdf g</p>
        <p>Written by <a href="http://twitter.com/lukeed05">Luke Edwards</a></p>
        <p>Refactored by <a href="https://github.com/xorgy">Aaron Muir Hamilton</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>

<form action="">
  <label for="GET-name">Name:</label>
  <input id="GET-name" type="text" name="name">
  <input type="submit" value="Save">
</form>

<!-- Simple form which will send a POST request -->
<form action="" method="post">
  <label for="POST-name">Name:</label>
  <input id="POST-name" type="text" name="name">
  <input type="submit" value="Save">
</form>

<!-- Form with fieldset, legend, and label -->
<form action="" method="post">
  <fieldset>
    <legend>Title</legend>
    <input type="radio" name="radio" id="radio"> <label for="radio">Click me</label>
  </fieldset>
</form>

<div formGroupName="address">
  <h3>Address</h3>

  <label>
Street
<input type="text" formControlName="street">
  </label>

  <label>
    City:
    <input type="text" formControlName="city">
  </label>
  
  <label>
    State:
    <input type="text" formControlName="state">
  </label>

  <label>
    Zip Code:
    <input type="text" formControlName="zip">
  </label>
</div>`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        if(groupIndex==1 && match.trim()!=="")
        console.log(`${match.trim()}`);
    });
}

console.log(str.replace(regex, function(match, string){
    let cleared = string.replace(/\r?\n|\r/gm, "").trim();
    return cleared !=="" ? match.replace(string.replace(/\r?\n|\r/gm, "").trim(), "${_t('" + string.replace(/\r?\n|\r/gm, "").trim() + "')}") : match;
} ));

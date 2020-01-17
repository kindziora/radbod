
let tplELEMENT = document.getElementsByTagName("home")[0];

let userStore = app.dataH.createStore("user", {
    "name": "alexander kindziora",
    "info": {
        gender: "male",
        "age" : 32
    } 
});

let interactions = {
    "/$user/name": {
        "click"(sender, dataStore) { //address specific element in dom
            console.log('CLICK', sender.field.getValue());
            dataStore.name += " ,";
          
        }
    }
};

app.createComponent(
    "home", 
    {home : tplELEMENT.innerHTML},
    userStore,
    interactions, {
    card : app.components.card
});

tplELEMENT.replaceWith(app.components.home.dom._area);
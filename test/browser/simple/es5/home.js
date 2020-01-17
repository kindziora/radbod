
let tplELEMENT = document.getElementsByTagName("home")[0];

app.createComponent(
    "home", {home : tplELEMENT.innerHTML},
    app.dataH.createStore("user", {
        "name": "alexander kindziora",
        "info": {
            gender: "male",
            "age" : 32
        } 
    }),
    {
        "/$user/name": {
            "click"(sender, dataStore) { //address specific element in dom
                console.log('CLICK', sender.field.getValue());
                dataStore.name += " ,";
              
            }
        }
    }, {
    card : app.components.card
});

tplELEMENT.replaceWith(app.components.home.dom._area);
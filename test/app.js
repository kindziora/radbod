let x = new app();


let card = 
x.createComponent(
 "card",
 "<sdfsdf>",
 {
    "src": "Images/Sun.png",
    "name": "sun1",
    "hOffset": 250,
    "vOffset": 250,
    "alignment": "center",
    "$user": store
  }, 
  {
    "/$user/username": {
        "click#ersterUsername"(sender, dataStore) { //address specific element in dom
            console.log('CLICK', sender.field.getValue());
            dataStore.username = sender.field.getValue() + "sd";
        }
    }
}, {
     
});



let user = 
x.createComponent("userlogin", "<sdfsdf>", {
    "src": "Images/Sun.png",
    "name": "sun1",
    "hOffset": 250,
    "vOffset": 250,
    "alignment": "center",
    "$user": store
  }, {
    "/$user/username": {
        "click#ersterUsername"(sender, dataStore) { //address specific element in dom
            console.log('CLICK', sender.field.getValue());
            dataStore.username = sender.field.getValue() + "sd";
        }
    }
}, {
    card
});
import browserEnv from 'browser-env';
browserEnv();

import { app } from '../build/app.js';

let x = new app();


let card =
    x.createComponent(
        "card", {
        card : (card) => `<section> 
<h2>Contact information ${card.src}</h2>
<div data-name="/$card/src" data-view="imgContainer"></div>
</section>`,
imgContainer : (data) => `<b>${data.map(d)}</b>`
},
        {
            "src": "Images/Sun.png",
            "hOffset": 250,
            "vOffset": 250,
            "alignment": "center"
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

card.store.data.src = "xxxxx";

console.log(card.dom._area.outerHTML);

/**
let user =
x.createComponent("user",
(user) => `<section>
<h2>Contact information ${user.username}</h2>
<card data-name="/$card"></card>
</section>`,
 {
    "username": "sun1",
    "hOffset": 250,
    "vOffset": 250,
    "alignment": "center"
  }, {
    "/$user/username": {
        "click#ersterUsername"(sender, dataStore) { //address specific element in dom
            console.log('CLICK', sender.field.getValue());
            dataStore.username = sender.field.getValue() + "sd";
        }
    }
}, { card });


**/
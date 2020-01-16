import browserEnv from 'browser-env';
browserEnv();

import { app } from '../build/app.js';

let x = new app();


//generate view templates for all data-name fields by innerHTML and make them render functions

let card =
    x.createComponent(
        "card", {
        card : (card) => `<section> 
<h2>Contact information ${card.src}</h2>
<div data-name="/$card/src" data-view="imgContainer"></div>
<div data-name="/$card/alignment">
    <ul>
    ${card.alignment.map((e,i)=>`<li data-name="/$card/alignment/${i}">${e}</li>`)}
    </ul>
</div>
</section>`,
imgContainer : (change) => `<b>${change.value}</b>`
},
        {
            "src": "Images/Sun.png",
            "hOffset": 250,
            "vOffset": 250,
            "alignment": ["center", "left", "right"]
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
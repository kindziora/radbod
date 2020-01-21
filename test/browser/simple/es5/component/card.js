app.createComponent(
    "card", {
    card: (card) => `<section> 
<h2>Contact information ${card.src}</h2>
<div data-name="/$card/alignment">
    <ul>
    ${card.alignment.map((e, i) => `<li data-name="/$card/alignment/${i}">${e}</li>`)}
    </ul>
</div>
</section>`,
},
    {
        "src": "Images/Sun.png",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": ["center", "left", "right"]
    },
    {
        "/$user/username": {
            "click"(sender, dataStore) { //address specific element in dom
                console.log('CLICK', sender.field.getValue());
                dataStore.username = sender.field.getValue() + "sd";
            }
        }
    }, {

});
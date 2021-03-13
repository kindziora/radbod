import {middlewareHandler} from '../../build/middlewareHandler.js';


let mwh = new middlewareHandler();

let mwView = mwh.addMiddleware("view");

mwView.use((stores, next)=>{
    let isActive = ()=> "yes is active";
    next(null, isActive);
});

mwView.use((stores, isActive,next)=>{
    stores.isActive = isActive();
    next();
});

let result = await mwView.run({user: {name:"x"}});

console.log(result);
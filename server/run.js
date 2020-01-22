import express from 'express';
import path from 'path';
const __dirname = path.resolve();

// create new express app and save it as "app"
const app = express();

// server configuration
//node ./node_modules/kjs/server/run.js html_loader.js data_loader.js 8800 browser;../dist

const PORT = parseInt(process.argv[4] || 8080);
 
async function run(){
  let html_loader = process.argv[2] ? await import(process.argv[2]) : false;
  let data_loader = process.argv[3] ? await import(process.argv[3]) : false;
  
  console.log(html_loader);
  
  let statics = (process.argv[5] || "").split(';');
  
  for(let s of statics)
    app.use(express.static(path.join(__dirname, s)));
  
  if(typeof html_loader ==="function")
    app.use(html_loader);
  
  if(typeof data_loader ==="function")
    app.use(data_loader);
  
  app.use(function (err, req, res, next) {
    console.log(req);
    return res.status(500).send({ error: err });
  });
  
  //SSR IMPLEMENTATION
  
  // make the server listen to requests
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
  });
}
run();

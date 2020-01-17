let express = require('express');
const fs = require('fs');
const path = require('path');
var cookieParser = require('cookie-parser');
let compression = require('compression');
let mcache = require('memory-cache');
 
let app = express();


let checkForHexRegExp = '(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)';
 

let pageView = require('./pageView');

let conf = require('../app/config/dev.ts');
console.log(process.argv);
if (process.argv[2] === "prod") {
  conf = require('../app/config/prod.ts');
}


let cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
};

app.use(cookieParser());

app.use(compression());
app.use(function (req, res, next) {
console.log(path.resolve(__dirname + '/../public' + req.path), __dirname + '/../public' + req.path);
  next();
});

app.use('/public', express.static(path.resolve(__dirname + '/../public/')));

app.use('/', express.static(path.resolve(__dirname + '/../public/')));

app.use('/public/build/dev/webfonts/', express.static(__dirname + '/../node_modules/@fortawesome/fontawesome-free/webfonts/'));

app.get("/", cache(1), function (request, response) {
  pageView("/home", response, null, request);
});

//regular route without language
app.get(/^(\/[a-z]*)(\/|)$/i, cache(1), (req, res) => pageView(req.path, res, null, req));

//machine route without language
app.get(/(^\/machine\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d).*)$/i, cache(1), (req, res) => pageView(req.path, res, null, req));


//regular route with language
app.get(/\/(.[a-z]_[A-Z].)\/([A-Z]*)$/i, cache(1), (req, res) => {
  let lang = req.path.split("/")[1];
  let page = req.path.split("/")[2];

  if (page.trim() === "") {
    page = "home";
  }

  pageView("/" + page, res, lang, req);
});

// 404
app.use(function (req, res, next) {

  if (fs.existsSync(__dirname + '/../public' + req.path)) {
    return res.sendFile(path.resolve(__dirname + '/../public' + req.path));
  } else {
    return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
  }
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  console.log(err);
  return res.status(500).send({ error: err });
});


app.listen(conf.webserver_internal_port, function () {
  console.log('Example app listening on port ' + conf.webserver_internal_port);
});


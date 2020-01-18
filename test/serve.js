// import express (after npm install express)
import express from 'express';

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8800;

app.use(express.static('/home/akindziora/projekte/kjs/test/browser'));
 
app.use(function (err, req, res, next) {
  console.log(req);
  return res.status(500).send({ error: err });
});

//SSR IMPLEMENTATION


// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
// import express (after npm install express)
import express from 'express';
import path from 'path';
const __dirname = path.resolve();

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8800;

app.use(express.static(path.join(__dirname, 'browser')));
<<<<<<< HEAD
 
app.use(express.static(path.join(__dirname, '../dist')));
 
=======
app.use(express.static(path.join(__dirname, '../dist')));

>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
app.use(function (err, req, res, next) {
  console.log(req);
  return res.status(500).send({ error: err });
});

//SSR IMPLEMENTATION

<<<<<<< HEAD

=======
>>>>>>> fa689233721103392755eef07c92e9dfd3cda9cc
// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
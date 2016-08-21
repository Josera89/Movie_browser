var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));

var PORT = process.env.PORT || 8080; // default port 8080

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

 MongoClient.connect("mongodb://127.0.0.1/movie_db", function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  //movieDatabase is just a pointer
  var movieDatabase = db.collection('movies').find( );
  movieDatabase.toArray(function(err, movies) {

    app.get("/", (req, res) => {
      res.end("Hello World!");
    });

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
    });

    app.get("/movies.json", (req, res) => {
      res.json(movies);
    });

    // app.get("/hello", (req, res) => {
    //   res.end("<html><body>Hello <b>World</b></body></html>\n");
    // });
    // app.get("/urls", (req, res) => {
    //   res.redirect("/");
    // });

    app.get("/movies", (req, res) => {
      res.render("pages/movies_index", { movies: movies });
    });

    app.get("/movie_cube", (req, res) => {
      res.render("pages/cube_img");
    });

    app.get("/multiple_cubes", (req, res) => {
      res.render("pages/multiple_cubes");
    });

    app.get("/test", (req, res) => {
      res.render("pages/test");
    });

    app.get("/birds", (req, res) => {
      res.render("pages/canvas_geometry_birds");
    });
  });
});
var express = require("express");
var app = express();
app.set("view engine", "ejs");

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

    app.get("/urls.json", (req, res) => {
      res.json(movies);
    });

    app.get("/hello", (req, res) => {
      res.end("<html><body>Hello <b>World</b></body></html>\n");
    });

    app.get("/movies", (req, res) => {
      res.render("pages/movies_index", { movies: movies });
    });

    app.get("/urls", (req, res) => {
      res.redirect("/");
    });
  });
});
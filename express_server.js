var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));

var PORT = process.env.PORT || 8080; // default port 8080

var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');

 MongoClient.connect("mongodb://127.0.0.1/movie_db", function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  var moviesCollection = db.collection('movies')

  moviesCollection.find( ).toArray(function(err, movies) {

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
    });

    app.get("/movies.json", (req, res) => {
      res.json(movies);
    });

    app.get("/", (req, res) => {
      res.render("pages/index");
    });

    app.get("/movies_index", (req, res) => {
      res.render("pages/movies_index", { movies: movies });
    });


    app.get("/movie_cube/:id", (req, res) => {
      var movieId = req.params.id;
      var obj_id = new ObjectID(movieId)
      console.log("movie id", movieId);
      moviesCollection.findOne({_id: obj_id},function(err, movie) {
        res.render("pages/individual_movie", {movie: movie});
      });
    });

    app.get("/movie", (req,res) => {
      res.render("pages/cube_img");
    });

    app.get("/movies", (req, res) => {
      res.render("pages/main", { movies: movies });
    });

    app.get("/birds", (req, res) => {
      res.render("pages/canvas_geometry_birds");
    });
  });
});
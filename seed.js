 var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

 MongoClient.connect("mongodb://127.0.0.1/movie_db", function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");


  var request = require('request');
  for (var i = 0; i < 10; i++) {
      request('http://api.themoviedb.org/3/movie/top_rated?api_key=3163e801aabb44760a65c588b6b674d7&page='+i, function (error, response, body) {
    var movies = [];
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body);
      // console.log(res);
      console.log(res.results);

      db.collection('movies').insertMany(res.results, function(err, r) {
      assert.equal(null, err);

      db.close();
      });
    }
  });
  }

});


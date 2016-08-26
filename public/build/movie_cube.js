$(function() {

  console.log(window.path);

  var container, stats;
  var camera, scene, renderer;
  var cube, plane;

  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;

  var mouseX = 0;
  var mouseXOnMouseDown = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  $.ajax({
    dataType: "json",
    url: "/movies.json",
    success: function (movies) {
      console.log("movies", movies);
      $("#movie-canvas").html("");
      init(movies);
      animate();
    }
  });

  function find_movie_from_movies(id, movies){
    for (var i = 0; i < movies.length; i++) {
      if (movies[i]._id === id) {
        return movies[i];
      }
    }
  }

    $( "#search" ).submit(function( event ) {
    var searchInput = $('#search-input').val().toUpperCase();
    $.ajax({
      dataType: "json",
      url: "/movies.json",
      success: function (movies) {
        for (var i = 0; i < movies.length; i++) {
          if (movies[i].original_title.toUpperCase() === searchInput) {
            window.location.href = window.location.origin + "/movie_cube/" + movies[i]._id;
          }
        }
      }
    });
  });

  function init(movies) {

    container = document.getElementById("movie-canvas");
    camera = new THREE.PerspectiveCamera( 70, $("#movie-canvas").innerWidth() / $("#movie-canvas").innerHeight(), 2.5, 2000 );


    camera.position.y = 100;
    camera.position.z = 300;

    scene = new THREE.Scene();

    var movie_id = window.location.href.split('/').pop(); // 'pop' is a bit hacky here, maybe fix
    var movie = find_movie_from_movies(movie_id, movies);
    console.log("movie: ",  movie);
    createCube(movie);


    // Cube
    function createCube (movie) {
      // movie = window.movie;   // TODO: delete this line after implementing find_movie_from_movies
      var geometry = new THREE.BoxGeometry( 150, 150, 150 );
      for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
      }
      var material = new THREE.MeshFaceMaterial( [
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
        //TOP
        new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } ),
        //BOTTOM
        new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } ),
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.poster_path ) } ),
        new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.poster_path ) } )
      ]);
      cube = new THREE.Mesh( geometry, material );
      cube.position.y = 150;
      scene.add( cube );
  }

    // Plane
    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    geometry.rotateX( - Math.PI / 2 );

    var material = new THREE.MeshBasicMaterial( { color: 0x212121, overdraw: 0.5 } );

    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0x424242 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( $("#movie-canvas").innerWidth(), $("#movie-canvas").innerHeight() );
    container.appendChild( renderer.domElement );

    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener( 'touchstart', onDocumentTouchStart, false );
    container.addEventListener( 'touchmove', onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );
  }

  function onWindowResize() {
    windowHalfX = $("#movie-canvas").innerWidth / 2;
    windowHalfY = $("#movie-canvas").innerHeight / 2;
    camera.aspect = $("#movie-canvas").innerWidth() / $("#movie-canvas").innerHeight();
    camera.updateProjectionMatrix();
    renderer.setSize( $("#movie-canvas").innerWidth(), $("#movie-canvas").innerHeight() );
  }

  //

  function onDocumentMouseDown( event ) {

    event.preventDefault();

    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
    container.addEventListener( 'mouseup', onDocumentMouseUp, false );
    container.addEventListener( 'mouseout', onDocumentMouseOut, false );

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
  }

  function onDocumentMouseUp( event ) {
    container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentMouseOut( event ) {
    container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }
  }

  function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
  }

  //Keypad controls
  // document.on("click", onDocumentMouseDown);

  document.onkeydown = checkKey;
  function checkKey(e) {
  e = e || window.event;
    if (e.keyCode == '37') {
       cube.rotation.y -= 5;
    }
    else if (e.keyCode == '39') {
       cube.rotation.y += 5;
    }
  }

  function animate() {
    requestAnimationFrame( animate );
    render();

  }

  function render() {
    plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
    renderer.render( scene, camera );
  }
});


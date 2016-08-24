$(function() {
  var container, stats;
  var camera, scene, renderer, controls;
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

  //
  function init(movies) {



    container = document.getElementById("movie-canvas");

    // camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 2, 2000 );
    camera = new THREE.PerspectiveCamera( 70, $("#movie-canvas").innerWidth() / $("#movie-canvas").innerHeight(), 2, 2000 );
    console.log("height="+$("#movie-canvas").innerHeight());
    console.log("width="+$("#movie-canvas").innerWidth());
    camera.position.x = 100;
    camera.rotation.y = 0.5;
    camera.position.y = -40;
    camera.position.z = 4000;

    //Controls
    controls = new THREE.TrackballControls( camera );
    controls.zoomSpeed = 1.5;
    controls.panSpeed = 1;
    controls.noRotate = true;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;  controls.addEventListener('change', render);

    scene = new THREE.Scene();

    // Create Mini cubes for each movie
    var x = 0;
    var z = -1100;
    for (var i = 0; i < movies.length; i++) { // Here iterate through the list of movies
      for (var j = 0; j < 8; j++) {
        createCube(movies[i], x, z)
        i += 1;
        x += 250;
      }
      x = -800;
      z += 250;
    }

    // Plane
    var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );

    plane = new THREE.Mesh( geometry, material );
    renderer = new THREE.CanvasRenderer();

    //BACKGOUND
    renderer.setClearColor( 0x424242 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( $("#movie-canvas").innerWidth(), $("#movie-canvas").innerHeight() );

    container.appendChild( renderer.domElement );

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


  function createCube (movie, x, z) {
    var geometry = new THREE.BoxGeometry( 160,160,160 );

    var material = new THREE.MeshFaceMaterial( [
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
      //TOP
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.poster_path ) } ),
      //BOTTOM
      new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } ),
      //FRONT
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.poster_path ) } ),
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } )

    ]);

    cube = new THREE.Mesh( geometry, material);
    // cube.rotation.y = -.81;
    cube.position.x = x;
    cube.position.z = z;
    cube.name = movie.original_title;
    cube.movie = movie;
    cube.clicked = function() {
      var movie_id = this.movie._id;
      redirectToMoviePage(movie_id);
    }

    scene.add(cube);
  }

  function redirectToMoviePage(id) {
    if (!id) throw new Error("must supply an id or u die");
    window.location.href = window.location.origin + "/movie_cube/" + id;
  }

  $(document).on("click", onDocumentMouseDown)
  //Keypad controls
  document.onkeydown = checkKey;
  function checkKey(e) {
      e = e || window.event;
      if (e.keyCode == '38') {
        camera.position.z -= 70;
      }
      else if (e.keyCode == '40') {
        camera.position.z += 70;
      }
      else if (e.keyCode == '37') {
         camera.position.x -= 250;
      }
      else if (e.keyCode == '39') {
         camera.position.x += 250;
      }
  }

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
  }

  function render() {
    renderer.render( scene, camera );
  }

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  function onDocumentMouseDown( event ) {
    console.log("event", event);
    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );
    console.log("scene", scene);
    console.log("intersects", intersects)

    if ( intersects.length > 0 ) {
        intersects[0].object.clicked();
    }
  }
});

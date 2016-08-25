$(function() {
  var container, stats;
  var camera, scene, renderer, controls;
  var cube, plane;

  var LOGGING_ON = true;
  var MIN_X_CAM_POS = -675;
  var MAX_X_CAM_POS = 825;

  var SPACE_BETWEEN_MOVIES_X = 250;
  var STEP_SIZE_X = SPACE_BETWEEN_MOVIES_X;
  var STEP_SIZE_Z = 70;

  var INIT_CAM_X = 75;
  var INIT_CAM_Y = 0;
  var INIT_CAM_Z = 4000;

  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;

  var mouseX = 0;
  var mouseXOnMouseDown = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  var next_cam_pos = {
    x_left: INIT_CAM_X - STEP_SIZE_X,
    x_right: INIT_CAM_X + STEP_SIZE_X,
    z_fwd: INIT_CAM_Z + STEP_SIZE_Z,
    z_bck: INIT_CAM_Z + STEP_SIZE_Z,
  }


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

    camera = new THREE.PerspectiveCamera( 70, $("#movie-canvas").innerWidth() / $("#movie-canvas").innerHeight(), 2.5, 2000 );
    console.log("height="+$("#movie-canvas").innerHeight());
    console.log("width="+$("#movie-canvas").innerWidth());
    camera.position.x = INIT_CAM_X;
    camera.position.y = INIT_CAM_Y;
    camera.position.z = INIT_CAM_Z;

    //Controls
    // controls = new THREE.TrackballControls( camera );
    // controls.zoomSpeed = 1.5;
    // controls.panSpeed = 1;
    // controls.noRotate = true;
    // controls.noZoom = false;
    // controls.noPan = true;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.1;  controls.addEventListener('change', render);

    scene = new THREE.Scene();

    createMiniCubes(movies);


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

  function createMiniCubes(movies) {
      // Create Mini cubes for each movie
    var x = 0;
    var z = -1100;
    for (var i = 0; i < movies.length; i++) { // Here iterate through the list of movies
      for (var j = 0; j < 8; j++) {
        createCube(movies[i], x, z)
        i += 1;
        x += SPACE_BETWEEN_MOVIES_X;
      }
      x = -800;
      z += SPACE_BETWEEN_MOVIES_X;
    }
  }

  function createCube (movie, x, z) {
    var geometry = new THREE.BoxGeometry( 160,160,160 );

    var material = new THREE.MeshFaceMaterial( [
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.backdrop_path ) } ),
      //TOP
      new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } ),
      //BOTTOM
      new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } ),
      //FRONT
      new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'http://image.tmdb.org/t/p/w500/' + movie.poster_path ) } ),
      new THREE.MeshBasicMaterial( { color: 0x121212, vertexColors: THREE.FaceColors } )
    ]);

    cube = new THREE.Mesh( geometry, material);
    // cube.rotation.y = .1;
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


  //Keypad controls
  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
      camera.position.z -= STEP_SIZE_Z;
    }
    else if (e.keyCode == '40') {
      camera.position.z += STEP_SIZE_Z;
    }
    else if (e.keyCode == '37') {

       camera.position.x -= STEP_SIZE_X;
    }
    else if (e.keyCode == '39') {

       camera.position.x += STEP_SIZE_X;
    }
    limitCamera();

    if(LOGGING_ON){
      console.log("camera (x,y,z): (" + camera.position.x + "," + camera.position.y + "," + camera.position.z + ") => " +
                  "rotation (x,y,z): (" + camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.z + ") => " );
    }
  }

  function limitCamera() {
    if ( camera.position.x > MAX_X_CAM_POS) {
      camera.position.x = MAX_X_CAM_POS;
    } else if (camera.position.x < MIN_X_CAM_POS) {
      camera.position.x = MIN_X_CAM_POS;
    }
  }


  function animate() {
    requestAnimationFrame( animate );
    // controls.update();
    render();
  }

  function render() {
    renderer.render( scene, camera );
  }

  $(document).on("click", onDocumentMouseDown);

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

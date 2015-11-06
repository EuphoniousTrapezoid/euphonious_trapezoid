
var scene, camera, renderer; 
var geometry, material, mesh;
var controls;
var clock;
var helperPlane;


ionic.DomUtil.ready(function () {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;

  gameEl = document.getElementById('game');
  GAME_WIDTH = gameEl.offsetWidth; 
  GAME_HEIGHT = gameEl.offsetHeight;
  console.log('GAME_HEIGHT: ', GAME_HEIGHT);
  init();
  animate();
 
});

var GRID_SIZE = 2000;
var gridStep = GRID_SIZE/10;


var mouseVector = new THREE.Vector3();
// Game configuration
var objects = [];
var anchorGeometry = new THREE.SphereGeometry(30,8,8);
var anchorMaterial = new THREE.MeshPhongMaterial({color: 0xF47333});

var ballGeometry = new THREE.SphereGeometry(50, 8, 8);

// Player-specific configuration:
var playerNum = 1;
var playerColor = Math.random() * 0xffffff;
var ballMaterial = new THREE.MeshPhongMaterial({color: playerColor});
// Add our board
var board = {};
/* board = {
  1:0 : {state: 0/1/2/3/L/P, valence: 4, leafy: true, piece: the3Dball}
}
*/



function init () {
// create the scene
  scene = new THREE.Scene();

// Prepare and position the camera
  var VIEW_ANGLE = 75;
  var ASPECT = GAME_WIDTH / GAME_HEIGHT;
  var NEAR = 1;
  var FAR = 10000;

  camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

  camera.position.z = 1000;
  camera.position.y = -200;

// Prepare the webGL renderer
  renderer = new THREE.WebGLRenderer( {antialias:true} );
  renderer.setSize( GAME_WIDTH, GAME_HEIGHT);
  //setSize(window.innerWidth/2, window.innerHeight/2, false) will render your app at half resolution, given that your <canvas> has 100% width and height.
  renderer.setClearColor(0x333F47, 1);

// Position the webGL container in the DOM
  // renderer.domElement.style.width = GAME_WIDTH;
  // renderer.domElement.style.height = GAME_HEIGHT;
  gameEl.appendChild( renderer.domElement );

// Set event listeners
  //Create an event listener that resizes the renderer with the browser window.
  window.addEventListener('resize', function() {

    GAME_WIDTH = gameEl.offsetWidth;
    GAME_HEIGHT = gameEl.offsetHeight;
    renderer.setSize(GAME_WIDTH, GAME_HEIGHT);
    camera.aspect = GAME_WIDTH / GAME_HEIGHT;
    camera.updateProjectionMatrix();
  });

  //Set mouse event listeners
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);

// Prepare camera orbit controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

// Prepare clock
  clock = new THREE.Clock();

// Prepare lights and add them to scene.
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,0,500);
  scene.add(light);

// Add our grid
  var gridGeometry = new THREE.Geometry();
  for ( var i = - GRID_SIZE/2; i <= GRID_SIZE/2; i += gridStep ) {

    gridGeometry.vertices.push( new THREE.Vector3( - GRID_SIZE/2, i, 0 ) );
    gridGeometry.vertices.push( new THREE.Vector3(   GRID_SIZE/2, i, 0 ) );

    gridGeometry.vertices.push( new THREE.Vector3( i, - GRID_SIZE/2, 0 ) );
    gridGeometry.vertices.push( new THREE.Vector3( i,   GRID_SIZE/2, 0 ) );

  }
  var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
  var line = new THREE.LineSegments( gridGeometry, lineMaterial );
  scene.add( line );  
 
// Add our helper plane
  var geometry = new THREE.PlaneBufferGeometry( GRID_SIZE, GRID_SIZE );
  helperPlane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xFF0000, visible: false } ) );
  objects.push(helperPlane);
  scene.add( helperPlane );

// Add our anchor
  addPiece(0, 0, 'A', new THREE.Vector3( 0, 0, 1));

};
// Mouse event listeners

var onDocumentMouseDown = function (event) {
  // SCREEN_WIDTH and SCREEN_HEIGHT should be width and height of 3D canvas

  if (event.clientX >= gameEl.offsetLeft && event.clientY >= gameEl.offsetTop) {
    mouseVector.x = 2 * ( (event.clientX - gameEl.offsetLeft) / GAME_WIDTH) - 1; 
    mouseVector.y = 1 - 2 * ( (event.clientY - gameEl.offsetTop)  / GAME_HEIGHT );
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVector, camera);

    var intersects = raycaster.intersectObjects( objects );
    var intersect = intersects[0];

    var position2D = {x: Math.round(intersect.point.x/gridStep), y: Math.round(intersect.point.y/gridStep)};

    //check the board to see if position2D is a liberty. If it is:
      addPiece(position2D.x, position2D.y, playerNum, intersect.face.normal);

  }


};

var addPiece = function (x, y, state, normal) {
  // create the 3d piece
  var ball = new THREE.Mesh(ballGeometry.clone(), ballMaterial);

  // do the board calculations, then
  // update the board

  // if there are any other 3d objects at that position, remove them
  if (board[x + "_" + y] !== undefined) scene.remove(board[x + "_" + y].piece)
  board[x + "_" + y] = {state: state, valence: 'calculate this', leafy: 'calculate this', piece: ball };

  // position the ball
  ball.position.set(x * gridStep, y * gridStep, 0);
  // set the position vector to be pointing up (may not be necessary)
  ball.position.add(normal);
  
  // add the ball to scene and objects array
  scene.add(ball);

}

var removePiece = function (x,y) {


  //recalculate the new board state
  //update the board
  scene.remove(board[x + "_" + y].piece);

//  objects.splice( objects.indexOf( board[x + "_" + y].piece ), 1 );
  console.log(board);

}

var onDocumentMouseMove = function (event) {
};

var onDocumentMouseUp = function (event) {
};

var animate = function () {

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    update();

}

var update = function () {
// cube.rotation.x += 0.01;
// cube.rotation.y += 0.02;
// console.log('time since last clock call: ', clock.getDelta())
  controls.update();
}



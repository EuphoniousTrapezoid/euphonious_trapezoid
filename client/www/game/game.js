sphero.factory('game', function () {
  // Declare global variables
  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;
  var GAME_WIDTH;
  var GAME_HEIGHT;
  var gameDomElement; // <- DOM element that the game is inside of

  var scene, camera, RENDERER;
  var light;

  // objects in the 3d space
  var gridSize;
  var gridStep;
  var gridPlane;
  var anchor;

  // geometry and materials
  var ballGeometry;
  var playerZeroMaterial;
  var playerOneMaterial;
  var playerTwoMaterial;
  var playerThreeMaterial;

  var anchorMaterial;

  // the board and the player
  var board;
  var playerNum; //this is assigned in controller
  
  //controls to rotate the camera with mouse, will probably be disabled in actual game
  var controls;

  var init = function (element, gridSize, gridStepIncrement) {

    // Set the dimensions
    gameDomElement = element;
    GAME_WIDTH = element.offsetWidth;
    GAME_HEIGHT = element.offsetHeight;
    gridSize = gridSize || 2000;
    gridStepIncrement = gridStepIncrement || 10;
    gridStep = gridSize/gridStepIncrement;

    // Create the board representation
    board = {};

    // Create the scene
    scene = new THREE.Scene();

    // create and position camera
    camera = new THREE.PerspectiveCamera(
      75, // field of view
      GAME_WIDTH/GAME_HEIGHT, // aspect ratio
      1,  // near clipping plane
      10000 // far clipping plane
    );
    camera.position.z = 1000;
    camera.position.y = -200;

    // initialize webGL renderer
    RENDERER = new THREE.WebGLRenderer( {antialias: true} );
    RENDERER.setSize( GAME_WIDTH, GAME_HEIGHT);
    // setSize(window.innerWidth/2, window.innerHeight/2, false) will render your app at half resolution, given that your <canvas> has 100% width and height.
    RENDERER.setClearColor(0x333F47, 1);
    // Position the webGL container in the DOM
    // RENDERER.domElement.style.width = GAME_WIDTH;
    // RENDERER.domElement.style.height = GAME_HEIGHT;
    element.appendChild( RENDERER.domElement );

    // Prepare lights and add them to scene.
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,0,500);
    scene.add(light);

    // Create orbit controls (development only?)
    controls = new THREE.OrbitControls(camera, RENDERER.domElement);

    // Create the materials and geometry that will be used
    objects = [];
    playerZeroMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
    playerOneMaterial = new THREE.MeshPhongMaterial({color: 0xF47333});
    playerTwoMaterial = new THREE.MeshPhongMaterial({color: 0x00ff000});
    anchorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

    ballGeometry = new THREE.SphereGeometry(50, 8, 8);

    // Create the grid
    var gridGeometry = new THREE.Geometry();
    for ( var i = - gridSize/2; i <= gridSize/2; i += gridStep ) {

      gridGeometry.vertices.push( new THREE.Vector3( - gridSize/2, i, 0 ) );
      gridGeometry.vertices.push( new THREE.Vector3(   gridSize/2, i, 0 ) );

      gridGeometry.vertices.push( new THREE.Vector3( i, - gridSize/2, 0 ) );
      gridGeometry.vertices.push( new THREE.Vector3( i,   gridSize/2, 0 ) );

    }
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
    var line = new THREE.LineSegments( gridGeometry, lineMaterial );

    scene.add( line );  
   
    // Create the helper plane
    var geometry = new THREE.PlaneBufferGeometry( gridSize, gridSize );
    gridPlane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xFF0000, visible: false } ) );
    objects.push(gridPlane);
    scene.add( gridPlane );

    // Place the anchor
    addPiece({coordinates: {x:0, y:0}, state:'A'}, new THREE.Vector3( 0, 0, 1));

    // Start the render sequence
    render();
  };

  var render = function () {
    requestAnimationFrame(render);
    RENDERER.render(scene, camera);
    controls.update();
  }

  var resize = function () {
    GAME_WIDTH = gameDomElement.offsetWidth;
    GAME_HEIGHT = gameDomElement.offsetHeight;
    RENDERER.setSize(GAME_WIDTH, GAME_HEIGHT);
    camera.aspect = GAME_WIDTH / GAME_HEIGHT;
    camera.updateProjectionMatrix();
  };

  var getGridPosition = function (mouseDownEvent, callback) {
    if (mouseDownEvent.clientX >= gameDomElement.offsetLeft && mouseDownEvent.clientY >= gameDomElement.offsetTop) {
      var mouseVector = new THREE.Vector3;
      mouseVector.x = 2 * ( (mouseDownEvent.clientX - gameDomElement.offsetLeft) / GAME_WIDTH) - 1; 
      mouseVector.y = 1 - 2 * ( (mouseDownEvent.clientY - gameDomElement.offsetTop)  / GAME_HEIGHT );
      
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouseVector, camera);

      var intersects = raycaster.intersectObjects( objects );
      var intersect = intersects[0];

      var position2d = {x: Math.round(intersect.point.x/gridStep), y: Math.round(intersect.point.y/gridStep)};

      if (callback) {
        callback(position2d);
      }
      return position2d;
    }
  };



  var addPiece = function (data, normal) {
    var x = data.coordinates.x;
    var y = data.coordinates.y;
    var state = data.state;
    var material = {
      A: anchorMaterial,
      0: playerZeroMaterial,
      1: playerOneMaterial,
      2: playerTwoMaterial
    }
    // create the 3d piece
    var ball = new THREE.Mesh(ballGeometry.clone(), material[state]);
    ball.is_ob = true;
    // if there are any other 3d objects at that position, remove them
    if (board[x + "_" + y] !== undefined){
      scene.remove(board[x + "_" + y].model)
    }

    board[x + "_" + y] = {state: state, model: ball };

    // position the ball
    ball.position.set(x * gridStep, y * gridStep, 0);
    // set the position vector to be pointing up (may not be necessary)
    normal = normal || new THREE.Vector3( ball.position.x, ball.position.y, 1)
//    ball.position.add(normal);
    
    // If the piece being added is the anchor, set the anchor. Otherwise make the piece a child of the anchor.
    if (state === 'A') {
      scene.add(ball);
      anchor = ball;
    } else {
      anchor.add(ball);
    }

    console.log(board);
  };

  var removePiece = function (data) {
    var x = data.coordinates.x;
    var y = data.coordinates.y;
    if (board[x + "_" + y] && board[x + "_" + y].model !== undefined) {
      console.log('scene before removal: ', scene.children);
      anchor.remove(board[x + "_" + y].model);
      delete board[x + "_" + y];

      console.log('scene after removal: ', scene.children);
      console.log('board after deletion: ', board);
    }
  };

  var movePiece = function (data) {
    if (!(data.from.x === data.to.x && data.from.y === data.to.y) && board[data.from.x + "_" + data.from.y] && board[data.from.x + "_" + data.from.y].model !== undefined) {

      board[data.from.x + "_" + data.from.y].model.position.set(data.to.x * gridStep, data.to.y * gridStep, 0);
      board[data.to.x + "_" + data.to.y] = {};
      board[data.to.x + "_" + data.to.y].state = board[data.from.x + "_" + data.from.y].state;
      board[data.to.x + "_" + data.to.y].model = board[data.from.x + "_" + data.from.y].model;

      delete board[data.from.x + "_" + data.from.y];
      console.log("board after move: ", board);
    }
  };

  var moveModel = function (data) {
     board[data.from.x + "_" + data.from.y].model.position.set(data.to.x * gridStep, data.to.y * gridStep, 0);
  };

  var rotateBoard = function (data) {
    data.forEach(function (move) {
      movePiece(move);
    });
  }

//   var rotateBoard = function (moves) {
// //      anchor.position.set(100,233,0);
//    anchor.rotation.z -= Math.PI/2;
//    console.log('moves: ', moves);
//    moves.forEach(function (data) {
//       if (data.success) {
//         board[data.to.x + "_" + data.to.y] = {};
//         board[data.to.x + "_" + data.to.y].state = board[data.from.x + "_" + data.from.y].state;
//         board[data.to.x + "_" + data.to.y].model = board[data.from.x + "_" + data.from.y].model;
//         delete board[data.from.x + "_" + data.from.y];
//       }

//    });

  //  console.log('board after rotation: ', board);
  // };

  var endGame = function (data) {

  };

  return {
    playerNum: playerNum,

    init: init,
    resize: resize,
    getGridPosition: getGridPosition,
    addPiece: addPiece,
    removePiece: removePiece,
    movePiece: movePiece,
    rotateBoard: rotateBoard,
    endGame: endGame

  };
});



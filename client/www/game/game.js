sphero.factory('game', function () {

  var gameDomElement;
  var svg;
  var grid;

  var gameWidth;
  var gameHeight;

  var gridSize;
  var gridStepIncrement;
  var wiggleRoom;

  var playerNum;
  var colors = { 
  A: ["#fd3132", "#8a2225"], 
  0: ["#fc9bcb", "#fccfe6"], // light pink #fccfe6 dark pink #b96890
  1: ["#97d9a1", "#c3d9c6"], // light green #c3d9c6
  2: ["#00a8db", "#017ba0"], // light blue #6ec2db
  3: ["#787b8c", "#525460"] };

  var radius;

  var setSize = function () {
    gameWidth = gameDomElement.offsetWidth || window.innerWidth;
    gameHeight = gameDomElement.offsetHeight || window.innerHeight;

    svg
      .attr("width", gameWidth)
      .attr("height", gameHeight)

//    gridStepIncrement = Math.min(gameWidth, gameHeight) / gridSize;
    
    var svgWidth = svg.attr("width");
    var svgHeight = svg.attr("height");

    grid.attr( "width", Math.min(svgWidth, svgHeight) );
    grid.attr( "height", grid.attr("width") );

    grid.attr( "x", svgWidth/2 - (grid.attr("width")/2) );
    grid.attr( "y", svgHeight/2 - (grid.attr("height")/2) );

  };

  var updateBoard = function ( data, duration ) {
    console.log("data: ", data );

    var spheres = d3.select('#grid').selectAll('circle')
      .data( data, function (d) {
        return d.id;
      } );

    spheres.enter()
      .append('circle')
      .attr("r", 0)
      .attr("fill", "none");

    spheres
      .attr("cx", function (d) {
        var pos = (100/20) * d.coordinates.x + 50;
        var posString = String(pos) + "%";
        return posString;
      })
      .attr("cy", function (d) {
        var pos = (-100/20) * d.coordinates.y + 50;
        var posString = String(pos) + "%";
        return posString;
      })
      .attr("r", radius)
      .style("fill", function (d) {
        return colors[d.state][0];
      });

    spheres.exit().remove();

  };

  var getPosition = function (mouseX, mouseY) {

    var coordinates = {};

    var gridLeft = grid.attr("x");
    var gridTop = grid.attr("y");
    var gridCenter = grid.attr("width")/2;

    var gridSize = grid.attr("width");

    var relativeX = mouseX - gridLeft;
    var relativeY = mouseY - gridTop;

    var distFromCenterX = relativeX - gridCenter;
    var distFromCenterY = gridCenter - relativeY;

    coordinates.x = Math.round(distFromCenterX * (20 / gridSize));
    coordinates.y = Math.round(distFromCenterY * (20 / gridSize));

    return coordinates;
  };

  var getSvgPosition = function (coordinates) {
    var posX = (100/20) * coordinates.x + 50;
    var posStringX = String(posX) + "%";
    var posY = (-100/20) * coordinates.y + 50;
    var posStringY = String(posY) + "%";

    return {
      x: posStringX,
      y: posStringY
    };
  };

  var put = function (data) {

    if (data.success) {
      duration = 100;
      d3.select("#grid").append("circle").datum( {coordinates: data.coordinates, id: data.id, state: data.state} )

      .attr("r", 0)
      .style("fill", "white")
      .attr("cx", getSvgPosition(data.coordinates).x)
      .attr("cy", getSvgPosition(data.coordinates).y)
      .transition()
      .duration(duration)
      .ease('bounce')
      .attr("r", radius)
      .style("fill", colors[data.state][0]);

      return duration;
    } else {
      var sphere = d3.select("#grid").selectAll("circle")
      .filter( function (d) {
        return d.coordinates.x === data.coordinates.x && d.coordinates.y === data.coordinates.y;
      })
      if (sphere.size() === 1) {
        var duration = 100
        var numPositions = Math.floor(100 + (Math.random() * 5));
        var vibrationRange = 2 * Math.abs( 100/(gridSize * 2) - 100/(gridSize*(2 + wiggleRoom)) );


        for (var i = 0; i < numPositions; i++) {
          sphere = sphere
          .transition()
          .duration(duration/(numPositions + 1))
          .ease("sin")
          .attr("cx", function(d) {
            var current = getSvgPosition(d.coordinates).x;
            current = Number(current.slice(0, -1));
            return current + Math.random() * vibrationRange - (vibrationRange/2) + "%";
          })
          .attr("cy", function(d) {
            var current = getSvgPosition(d.coordinates).y;
            current = Number(current.slice(0, -1));
            return current + Math.random() * vibrationRange - (vibrationRange/2) + "%";
          });
        }

        sphere
        .transition()
        .duration(duration/(numPositions + 1))
        .ease("sin")
        .attr("cx", getSvgPosition(data.coordinates).x)
        .attr("cy", getSvgPosition(data.coordinates).y)

        return duration;

      } else {
        duration = 200;
        sphere = d3.select("#grid").append("circle")
        .attr("r", 0)
        .style("fill", "black")
        .attr("cx", getSvgPosition(data.coordinates).x)
        .attr("cy", getSvgPosition(data.coordinates).y)
        .transition()
        .duration(duration/2)
        .ease("elastic")
        .attr("r", Number(radius.slice(0, -1))/3 + "%" )

        .transition()
        .duration(duration/2)
        .ease("linear")
        .style("fill", "white")
        // .attr("r", 0)
        .remove();

        return duration + 25;
      }
    }
  };

  var removed = function (data) {
    var duration = 100;
    var sphere = d3.select("#grid").selectAll("circle").filter( function (d) { return d.id === data.id });

    console.log('data.state on remove event: ', data.state);

    sphere
//    .style("stroke", colors["A"][1])
//    .style("stroke-width", 0)
    .transition()
    .duration(duration *  (2/3))
    .ease("elastic")
    .attr("r", Number(radius.slice(0, -1)) * (2+wiggleRoom)/2 + "%") 
//    .style("stroke-width", 1)
    .style("fill", colors[data.state][1])
    .transition()
    .duration( duration/3 )
    .ease("linear")
    .attr("r", 0)

    .remove();

    return duration + 50;
  };

  var moved = function (data) {
    var duration = 100;

    var sphere = d3.select("#grid").selectAll("circle").filter( function (d) { return d.id === data.id } );

    sphere.transition()
    .duration( duration * .15 )
    .ease("cubic")
    .attr("r", Number(radius.slice(0, -1)) * 0.75 + "%" )
    .transition()
    .duration( duration * 0.7 )
    .ease("cubic-in-out")
    .attr("cx", getSvgPosition(data.to).x )
    .attr("cy", getSvgPosition(data.to).y )
    .transition()
    .duration( duration * 0.15 )
    .ease("elastic")
    .attr("r", radius);


    sphere.datum( {id: data.id, state: data.state, coordinates: data.to } );

    return duration;
  };

  var suspended = function (data) {
    var duration = 300 + Math.random() * 200;
    var sphere = d3.select("#grid").selectAll("circle").filter( function (d) { return d.id === data.id} );

    var oscillate = function () {
      sphere.transition()
      .duration(duration * 0.5)
      .ease("sin")
      .attr("r", Number(radius.slice(0, -1))/2 + "%" )
      .style("fill", colors[data.state][1])
      .transition()
      .duration(duration * 0.5)
      .ease("sin")
      .style("fill", colors[data.state][0])
      .attr("r", radius)

      .each( "end", oscillate);
    };

    oscillate();

    return 0;
    
  }


  var i = 0;
  var particle = function () {
    var m = d3.mouse(this);
    svg.insert("circle")
        .attr("cx", m[0])
        .attr("cy", m[1])
        .attr("r", 1e-6)
        .style("fill", "none")
        .style("stroke-width", "2.5px")
        .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
        .style("stroke-opacity", 1)
      .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr("r", 100)
        .style("stroke-opacity", 1e-6)
       .remove();

    d3.event.preventDefault();
  };


  var init = function (element, size) {
    gameDomElement = element || document.getElementById("game");
    gridSize = size || 20;
    wiggleRoom = wiggleRoom || .5;

    radius = 100/(gridSize* (2 + wiggleRoom)) + "%";
    svg = d3.select(gameDomElement).append("svg");
    svg
      .style("pointer-events", "all")
//      .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);
    
    var defs = svg.append('defs');
    var gradient = defs.append('linearGradient').attr("id", "gameGradient");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#010708");
    gradient.append("stop").attr("offset", "70%").attr("stop-color", "#011218");

    svg.append("rect").attr("width", "100%").attr("height", "100%")
    .attr("id", "gradientBackground").attr("fill", "url(#gameGradient)");

    grid = svg.append("svg").attr("id", "grid");




    setSize();
    // svg.insert("circle")
    //     .attr("cx", "50%")
    //     .attr("cy", "50%")
    //     .attr("r", '2%')
    //     .style("fill", "blue")
  };



  return {

    playerNum: playerNum,

    init: init,
    setSize: setSize,
    getPosition: getPosition,
    updateBoard: updateBoard,
    put: put,
    removed: removed,
    moved: moved,
    suspended: suspended
  };

});
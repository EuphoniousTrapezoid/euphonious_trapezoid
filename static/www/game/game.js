sphero.factory('game', function () {

  var gameDomElement;
  var svg;
  var background;
  var grid;
  var indicator;

  var gameWidth;
  var gameHeight;

  var gridSize;
  var gridStepIncrement;
  var wiggleRoom;
  var anchorPercentage;


  var playerInfo = {};
  var playersTurn;

  var colors = { 
  A: ["#fd3132", "#8a2225", "#ffffff"], 
  0: ["#fc9bcb", "#fccfe6", "#8c3e65"], // light pink #fccfe6 dark pink #8c3e65 other dark pink #b96890
  1: ["#97d9a1", "#c3d9c6", "#499755"], // light green #c3d9c6 dark green #499755
  2: ["#00a8db", "#017ba0", "#017ba0"], // light blue #6ec2db dark blue #017ba0
  3: ["#787b8c", "#b2b5c3", "#525460"] }; // light gray #b2b5c3 dark gray #525460

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

  var showTurnChange = function (player, duration) {
    console.log('current players turn: ', playerInfo.currentTurn);
    indicator
      .style("fill", colors[playerInfo.currentTurn][2]);

    // d3.select(".A")
    //   .attr('cx', '50%')
    //   .attr('cy', '50%')
    //   .style('fill', colors[player][2])
    //   .attr('r', Number(radius.slice(0, -1)) * .2 + "%")

    //   .transition()
    //   .duration(duration/2) // change 1000 to a variable representing turn duration
    //   .attr('r', Number(radius.slice(0, -1)) * (2+wiggleRoom)/2 + "%" )

    //   .transition()
    //   .duration(duration/2)
    //   .attr('r', Number(radius.slice(0, -1)) * .2 + "%" );

  };

  var updateBoard = function ( data ) {
    var duration = 50;
    var spheres = d3.select('#grid').selectAll('.piece')
      .data( data, function (d) {
        return d.id;
      } );

    spheres.enter()
      .insert('circle', '.indicator')
      .attr("r", 0)
      .attr("fill", "none")
      .attr("class", function (d) {
        return d.state + " piece";
      });

    spheres
      .transition()
      .duration(duration)
      .attr("cx", function (d) {
        var pos = (100/gridSize) * d.coordinates.x + 50;
        var posString = String(pos) + "%";
        return posString;
      })
      .attr("cy", function (d) {
        var pos = (-100/gridSize) * d.coordinates.y + 50;
        var posString = String(pos) + "%";
        return posString;
      })
      .attr("r", function (d) {
        if (d.state === 'A') {
          return anchorRadius;
        } else {
          return radius;
        }
        
      })
      .style("fill", function (d) {
        return colors[d.state][0];
      });

    spheres.exit().remove();
    return duration;
  };

  var getPosition = function (mouseX, mouseY) {

    var coordinates = {};

    var gridLeft = grid.attr("x");
    var gridTop = grid.attr("y");
    var gridCenter = grid.attr("width")/2;

    var gridLength = grid.attr("width");

    var relativeX = mouseX - gridLeft;
    var relativeY = mouseY - gridTop;

    var distFromCenterX = relativeX - gridCenter;
    var distFromCenterY = gridCenter - relativeY;

    coordinates.x = Math.round(distFromCenterX * (gridSize / gridLength));
    coordinates.y = Math.round(distFromCenterY * (gridSize / gridLength));

    return coordinates;
  };

  var getSvgPosition = function (coordinates) {
    var posX = (100/gridSize) * coordinates.x + 50;
    var posStringX = String(posX) + "%";
    var posY = (-100/gridSize) * coordinates.y + 50;
    var posStringY = String(posY) + "%";

    return {
      x: posStringX,
      y: posStringY
    };
  };

  var put = function (data) {
    var duration;
    if (data.success) {
      duration = 100;
      d3.select("#grid").append("circle").datum( {coordinates: data.coordinates, id: data.id, state: data.state} )

      .attr("r", 0)
      .attr("class", function (d) { return d.state + " piece"; })
      .style("fill", "white")
      .attr("cx", getSvgPosition(data.coordinates).x)
      .attr("cy", getSvgPosition(data.coordinates).y)
      .transition()
      .duration(duration)
      .ease('bounce')
      .attr("r", radius)
      .style("fill", colors[data.state][0]);

    } else {
      var sphere = d3.select("#grid").selectAll(".piece")
      .filter( function (d) {
        return d.coordinates.x === data.coordinates.x && d.coordinates.y === data.coordinates.y;
      });
      console.log('sphere size: ', sphere);
      if (sphere.size() === 1) {
        duration = 100
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

      } else {
        duration = 200;
        sphere = d3.select("#grid").append("circle")
        .attr("r", 0)
        .attr("class", "blip")
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

      }
    }

    return duration + 50;
  };

  var removed = function (data) {
    var duration = 100;
    var sphere = d3.select("#grid").selectAll(".piece").filter( function (d) { return d.id === data.id });

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

    var sphere = d3.select("#grid").selectAll(".piece").filter( function (d) { return d.id === data.id } );

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

    return duration + 10;
  };

  var fell = function (data) {
    var duration = 100;

    var sphere = d3.select("#grid").selectAll(".piece").filter( function (d) { return d.id === data.id } );

    sphere.transition()
    .duration( duration )
    .ease("elastic")
    .attr("cx", getSvgPosition(data.to).x )
    .attr("cy", getSvgPosition(data.to).y )
    .attr("r", radius);


    sphere.datum( {id: data.id, state: data.state, coordinates: data.to } );

    return duration + 10;

  }

  var suspended = function (data) {
    var duration = 500 + Math.random() * 100;
    var sphere = d3.select("#grid").selectAll(".piece").filter( function (d) { return d.id === data.id} );

    var getSmaller = function () {
      sphere.transition()
      .duration(duration * 0.5)
      .ease("sin")
      .attr("r",  Number( radius.slice(0, -1)) * 0.7 + "%")
      .style("fill", colors[data.state][1])
      .transition()
      .duration(duration * 0.5)
      .ease("sin")
      .style("fill", colors[data.state][0])
      .attr("r", Number( radius.slice(0, -1)) * 0.8 + "%")
    };

    getSmaller();

    return 0;
    
  }

  var rotated = function (data) {
    var duration = 200;
    
    var antiClockwiseAngle = (Math.PI/2) * 1.35;
    var antiClockwiseSteps = 90 * 1.25;
    var antiClockwiseResolution = antiClockwiseAngle/antiClockwiseSteps;
    var antiClockwiseDuration = duration * .65;

    var clockwiseAngle = -Math.PI/2 * .35;
    var clockwiseSteps = 90 * .25;
    var clockwiseResolution = clockwiseAngle/clockwiseSteps;
    var clockwiseDuration = duration * .35;

    var spheres = d3.select("#grid").selectAll(".piece")
    .filter( function (d) {
      var mid, low, high;
      low = 0;
      high = data.length - 1;
      mid = Math.floor( (low + high)/2 )
      while ( data[mid].id !== d.id) {
        if ( low >= high ) {
          return false;
        } else if (data[mid].id < d.id) {
          if( mid === data.length ) {
            return false;
          }
          low = mid + 1;
        } else if (data[mid].id > d.id) {
          if (mid === 0) {
            return false;
          }
          high = mid - 1;
        }
        mid = Math.floor( (low + high)/2 );
      }
      return true;
    });

    var transition = spheres;

    var rotateTheta = function (x, y, theta) {
      return { 
        x: x * Math.cos(theta) - y * Math.sin(theta),
        y: x * Math.sin(theta) + y * Math.cos(theta)
      };
    };
    for (var i = 0; i <= antiClockwiseAngle; i+= antiClockwiseResolution) {
      transition = transition.transition().duration( antiClockwiseDuration/antiClockwiseSteps ).ease('linear')
                .attr("cx", function (d) {
                  var coordinates = rotateTheta( d.coordinates.x, d.coordinates.y, antiClockwiseResolution );
                  d.coordinates.x = coordinates.x;
                  d.coordinates.y = coordinates.y;
                  return getSvgPosition(d.coordinates).x;
                })
                .attr("cy", function (d) {
                  return getSvgPosition(d.coordinates).y;
                });
    }

    for ( var i = 0; i >= clockwiseAngle; i += clockwiseResolution ) {
      transition = transition.transition().duration( clockwiseDuration/clockwiseSteps ).ease('linear')
                .attr("cx", function (d) {
                  var coordinates = rotateTheta( d.coordinates.x, d.coordinates.y, clockwiseResolution );
                  d.coordinates.x = coordinates.x;
                  d.coordinates.y = coordinates.y;
                  return getSvgPosition(d.coordinates).x;
                })
                .attr("cy", function (d) {
                  return getSvgPosition(d.coordinates).y;
                });

      if (i <= clockwiseAngle + clockwiseResolution/2 ) {
        transition.attr("cx", function (d) {
          d.coordinates.x = Math.round(d.coordinates.x);
          d.coordinates.y = Math.round(d.coordinates.y);
          return getSvgPosition(d.coordinates).x;
        })
        .attr("cy", function (d) {
          return getSvgPosition(d.coordinates).y;
        });
      }
    }

    return duration + 10;
  }

  var indicatorOscillate = function () {
    duration = 1000;

    indicator.transition()
    .duration(duration * 0.5)
    .ease("sin")
    .attr("r",  radius)
    .transition()
    .duration(duration * 0.5)
    .ease("sin")
    .attr("r", anchorRadius)
     .each( "end", indicatorOscillate);
  };

  var i = 0;
  var particle = function () {
    var m = d3.mouse(this);
    svg.insert("circle")
        .attr("cx", m[0])
        .attr("cy", m[1])
        .attr("r", 1e-6)
        .attr("class", "particle")
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
    anchorRadius = Number(radius.slice(0, -1)) * .3 + "%";

    svg = d3.select(gameDomElement).append("svg");
    svg
      .style("pointer-events", "all")
//      .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);
    
    var defs = svg.append('defs');
    var gradient = defs.append('linearGradient').attr("id", "gameGradient");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#010708");
    gradient.append("stop").attr("offset", "70%").attr("stop-color", "#011218");

    background = svg.append("rect").attr("width", "100%").attr("height", "100%")
    .attr("id", "gradientBackground").attr("fill", "url(#gameGradient)");

    grid = svg.append("svg").attr("id", "grid");

    indicator = grid.append("circle").datum( {id: null} ).attr("r", anchorRadius).attr("cx", "50%").attr("cy", "50%")
    .style("fill", "white").attr("class", "indicator");




    setSize();
    indicatorOscillate();
    // svg.insert("circle")
    //     .attr("cx", "50%")
    //     .attr("cy", "50%")
    //     .attr("r", '2%')
    //     .style("fill", "blue")
  };



  return {

    playerInfo: playerInfo,
    playersTurn: playersTurn,
    colors: colors,

    init: init,
    setSize: setSize,
    showTurnChange: showTurnChange,
    getPosition: getPosition,
    updateBoard: updateBoard,
    put: put,
    removed: removed,
    moved: moved,
    fell: fell,
    suspended: suspended,
    rotated: rotated
  };

});
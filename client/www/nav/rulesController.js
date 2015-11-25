sphero.controller('rulesController', ['$scope', '$state',
  function($scope, $state) {

    $scope.nav = function () {
      $state.go('nav');
    }


    var animateRemoved = function () {

      var spheres = d3.selectAll("circle.remove");

      spheres.each( function (d, i) {
        var duration = 125;

        var circle = this;

        var disappear = function () {
          d3.select(circle)
          .transition()
          .duration(duration *  (2/3))
          .ease('elastic')
          .attr('r', '15px')
      //    .style("stroke-width", 1)
          .style('fill', '#fccfe6')
          .transition()
          .duration( duration/3 )
          .ease("linear")
          .attr("r", 0)
          .transition()
          .duration(duration*7)
          .each('end', appear);
        }

        var appear = function () {
          d3.select(circle)
          .style('fill', '#fc9bcb')
          .transition()
          .duration(duration)
          .ease('bounce')
          .attr('r', '13px')
          .transition()
          .duration(duration*10)
          .each('end', disappear)
        }

        d3.select(circle)
        .transition()
        .delay(i * duration *1.2)
        .each('start', disappear);

      })
    };

    var animateRotate = function () {
      var suspended = d3.selectAll('circle.suspend');
      var rotated = d3.selectAll('circle.rotate');

      suspended.each( function (d,i) {
        var circle = this;
        var duration = 125;

        var suspend = function () {
          d3.select(circle)
          .transition()
          .duration(duration * 0.5)
          .ease("sin")
          .attr("r",  '9px')
          .transition()
          .duration(duration * 0.5)
          .ease("sin")
          .attr("r", '11px')
          .transition()
          .duration(duration * 1.2)
          .each('end', fall);
        };

        var fall = function () {
          var falling = d3.select(circle);
          var moveTo = parseInt(falling.attr('cx')) - 60;

          falling
          .transition()
          .duration( duration )
          .ease("elastic")
          .attr("cx", moveTo + 'px')
          .attr("r", '13px');          
        };

        d3.select(circle)
        .transition()
        .delay(1000 + i * duration*1.1)
        .each('start', suspend);
      });

      rotated.each( function (d,i) {
        var circle = this;
        var duration = 125;

        var antiClockwiseAngle = (Math.PI/2) * -1.35;
        var antiClockwiseSteps = 90 * 1.25;
        var antiClockwiseResolution = antiClockwiseAngle/antiClockwiseSteps;
        var antiClockwiseDuration = duration * .65;

        var clockwiseAngle = Math.PI/2 * .35;
        var clockwiseSteps = 90 * .25;
        var clockwiseResolution = clockwiseAngle/clockwiseSteps;
        var clockwiseDuration = duration * .35;


        var rotate = function () {
          
          var rotatingCircle = d3.select(circle);
          var cartesianX = parseInt(rotatingCircle.attr('cx')) - 180;
          var cartesianY = parseInt(rotatingCircle.attr('cy')) - 110;
          var oldCartesianX;

          for (var rotationNumber = 0; rotationNumber < arguments.length; rotationNumber ++) {
            var angle = Math.abs( arguments[rotationNumber].angle );

            for ( var i = 0; i <= clockwiseAngle; i += clockwiseResolution ) {
              rotatingCircle = rotatingCircle.transition().duration( clockwiseDuration/clockwiseSteps ).ease('linear')
                        .attr("cx", function () {
                          oldCartesianX = cartesianX;
                          cartesianX = cartesianX * Math.cos(clockwiseResolution) - cartesianY * Math.sin(clockwiseResolution);
                          return String(cartesianX + 150) + 'px';
                        })
                        .attr("cy", function (d) {
                            cartesianY = oldCartesianX * Math.sin(clockwiseResolution) + cartesianY * Math.cos(clockwiseResolution);
                            return String(cartesianY + 80) + 'px';
                        });
              }
              
            for (var i = 0; i >= antiClockwiseAngle; i+= antiClockwiseResolution) {

              rotatingCircle = rotatingCircle.transition().duration( antiClockwiseDuration/antiClockwiseSteps ).ease('linear')
                        .attr("cx", function() {
                          oldCartesianX = cartesianX;
                          cartesianX = cartesianX * Math.cos(antiClockwiseResolution) - cartesianY * Math.sin(antiClockwiseResolution);
                          return String(cartesianX + 150) + 'px';
                        })
                        .attr("cy", function () {
                          cartesianY = oldCartesianX * Math.sin(antiClockwiseResolution) + cartesianY * Math.cos(antiClockwiseResolution);
                          return String(cartesianY + 80) + 'px';
                        });
            }

          }


        };

    
        d3.select(circle)
        .transition()
        .delay(1000)
        .each('start', rotate.bind(this, 'test'));


      });

    };

    $scope.$on('$ionicView.enter', function () {

      animateRemoved();
     animateRotate();
    })
    /*
      duration = 125;
      d3.select("#grid").append("circle").datum( {coordinates: data.coordinates, id: data.id, state: data.state, valence: data.valence} )
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
    */
  }
]);

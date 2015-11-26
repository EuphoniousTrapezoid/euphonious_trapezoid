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
      var rotated = d3.select('g.rotate');
      var duration = 125

      var rotate = function () {
        rotated
        .transition()
        .duration(duration*0.65)
        .ease('linear')
        .attr('transform',  'rotate(-121)')
        .transition()
        .duration(duration*0.35)
        .ease('linear')
        .attr('transform', 'rotate(-90)')
        .transition()
        .duration(duration * 15) // 16 durations up to this point in the rotation
        .transition()
        .duration(duration*4)
        .attr('transform', 'rotate(0)')

        .transition()
        .duration(duration*12)
        .each('end', rotate);
      }

      rotate();

      suspended.each( function (d,i) {
        var circle = this;

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
          .duration(duration)
          .each('end', fall);
        };

        var fall = function () {
          var falling = d3.select(circle);

          falling
          .transition()
          .duration( duration )
          .ease("elastic")
          .attr("transform", 'translate(-60)')
          .attr("r", '13px')
          .transition() // total of 3 + .1 durations up to this point 
          .duration(duration * 12.9) // 16 durations === 2 sec
          .each('end', moveBack);
        };

        var moveBack = function () {
          console.log('moving back');
          var movingBack = d3.select(circle);
          // var goBackTo = parseInt(movingBack.attr('cx')+90);

          movingBack
          .transition()
          .duration(duration*4)
          .attr('transform', 'translate(0)') // 20 durations up to this point
          .transition() // 
          .duration(duration*12) // takes 24 durations total i.e. 3 sec
          .each('end', suspend);

        }

        d3.select(circle)
        .transition()
        .delay(i * duration*1.1)
        .each('start', suspend);
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

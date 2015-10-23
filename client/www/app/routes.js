var router = angular.module('sphero.routes', ['angular-jwt']);


router.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('nav', {
      url: '/nav',
      templateUrl: '../nav/nav.html',
      controller: 'navController'
    })
    .state('launch', {
      url: '/launch',
      templateUrl: '../launch/launch.html',
      controller: 'launchController'
    })
    .state('game', {
      url: '/game',
      templateUrl: '../game/game.html',
      controller: 'gameController'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/nav');

});

router.run(function($rootScope, $state, Auth) {
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if (!localStorage.id_token && next.templateUrl !== '../nav/nav.html') {
      $state.go('nav');
    }
  });
});

router.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function() { //refactor to service for minification
    console.log(localStorage);
    return localStorage.getItem('id_token');
  };

  $httpProvider.interceptors.push('jwtInterceptor');
});



// .factory('AttachTokens', function ($window) {
//   //this factory stops all outgoing requests, then looks in local storage
//   //for the user's JWT and adds the token to the request header
//   var attach = {
//     request: function (object) {
//       var jwt = $window.localStorage.getItem('sphero').token;
//       if (jwt) {
//         object.headers['x-access-token'] = jwt;
//       }
//       object.headers['Allow-Control-Allow-Origin'] = '*';
//       return object;
//     }
//   };
//   return attach;
// });
//.run(function($rootScope, $location, $state, Auth, Player){

//});

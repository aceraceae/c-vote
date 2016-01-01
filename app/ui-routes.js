//Routing
app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
         views: {
      'home' : {
      templateUrl: '/home.html',
      url: '/home',
      controller: 'MainCtrl',
      resolve: {
          postPromise: ['polls', 'auth', function(polls, auth){
              console.log("Hello");
              if(auth.isLoggedIn()){
                 
          var userId = auth.userId();
           console.log(userId);
          return polls.getAll(userId);
              }
       }]
      }
      },
      'all' : {
       templateUrl: '/all.html',
       url: '/all',
       controller: 'AllCtrl',
      },
      'edit' : {
      templateUrl: '/edit.html',
      url: '/edit',
      controller: 'EditCtrl',
      }
         },
         url: '/main'
      })
    .state('polls', {
       url: '/poll/{id}',
       templateUrl: '/poll.html',
       controller: 'PollsCtrl',
       resolve: {
       poll: ['$stateParams', 'polls', function($stateParams, polls){
      return polls.getOne($stateParams.id);
      }]
  }
    })
    .state('chart', {
       url: '/chart/{id}',
       templateUrl: '/chart.html',
       controller: 'ChartCtrl',
       resolve: {
       poll: ['$stateParams', 'polls', function($stateParams, polls){
      return polls.getOne($stateParams.id);
      }]
       }
    })
     .state('login', {
  url: '/login',
  templateUrl: '/login.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('main');
    }
  }]
})
   .state('register', {
  url: '/register',
  templateUrl: '/register.html',
  controller: 'AuthCtrl',
  onEnter: ['$state', 'auth', function($state, auth){
    if(auth.isLoggedIn()){
      $state.go('main');
    }
  }]
});

  $urlRouterProvider.otherwise('main');
}]);
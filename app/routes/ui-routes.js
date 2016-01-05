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
              if(auth.isLoggedIn()){
                 
          var userId = auth.userId();
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
      'start' : {
       templateUrl: '/start.html'
      // url: '/start',
      // controller: 'AllCtrl',
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
       poll: ['$stateParams', 'polls', 'slide', function($stateParams, polls, slide){
           if(slide.slide) {
               slide.slide = false;
           }
           if(slide.btn) {
               slide.slide = false;
           }
      return polls.getOne($stateParams.id);
      }]
  }
    })
    .state('chart', {
       url: '/chart/{id}',
       templateUrl: '/chart.html',
       controller: 'ChartCtrl',
       resolve: {
       poll: ['$stateParams', 'polls', 'slide', function($stateParams, polls, slide){
            if(slide.slide) {
               slide.slide = false;
           }
           if(slide.btn) {
               slide.btn = false;
           }
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
//CONTROLLERS
app.controller('UberCtrl', ['$scope', 'slide', 'auth', function($scope, slide, auth) {
 $scope.isLoggedIn = auth.isLoggedIn;
 $scope.$watch(function() { return slide.slide; }, function() { $scope.slide = slide.slide;
 });
  $scope.$watch(function() { return slide.edit; }, function() { $scope.slideEdit = slide.edit;
 });

 
 }]);
 
 app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);
//HOME CONTROLLER
app.controller('MainCtrl', ['$scope', '$state', 'polls', 'slide', 'auth', function($scope, $state, polls, slide, auth) {
    $scope.userId = auth.userId();
    $scope.polls = polls.polls;
    $scope.options = [{ text: "", count: 0 }, { text: "", count: 0 }];
    $scope.multi = false;
    $scope.disable = true;
    $scope.addQuest = function() {
   // $scope.polls.push({question: $scope.question, options: $scope.options, multi: $scope.multi, countAll: 0});
    polls.create({
     question: $scope.question,
     options: $scope.options,
     multi: $scope.multi,
     countAll: 0,
     user: $scope.userId
    });
    $scope.options = [{ text: "", count: 0 }, { text: "", count: 0 }];
    $scope.question = "";
    slide.slide = false;
    slide.btn = false;
    };
  
    $scope.addEmpty = function() {
      $scope.opt = { text: "", count: 0 };
      $scope.options.push($scope.opt);
      $scope.createPoll.$setPristine();
    };
    
   
    $scope.deleteEmpty = function(opt) {
      if($scope.options.length > 2) {
      console.log($scope.options.indexOf(opt));
      var idx = $scope.options.indexOf(opt);
      $scope.options.splice(idx, 1);
      }
    };
    
}]);


//POLL CONTROLLER
app.controller('PollsCtrl', ['$scope', '$state', 'polls', 'poll', function($scope, $state, polls, poll){
 $scope.poll = poll;

// $scope.checked = false;
  $scope.addVote = function(opt) {
   if(!$scope.poll.multi) {
    $scope.selectionType($scope.poll.options);
     if(!opt.checked) {
   opt.checked = true;
   }
   else {
    opt.checked = false;
   }
   }
 };
 $scope.incrementUpvotes = function(poll) {
  polls.upvote(poll);
};

  $scope.votingDone = function(poll) {
    angular.forEach(poll.options, function(opt) {
     if(opt.checked) {
      polls.vote(poll);
      polls.voteOpt(poll, opt);
     }
    delete opt.checked;
   });
   $state.go('chart', {id: poll._id });
  };
  
  $scope.selectionType = function(options) {
   angular.forEach(options, function(opt) {
    opt.checked = false;
   });
  };
  
  $scope.selectionType($scope.poll.options);
 }]);
 

 //CHART CONTROLLER
  app.controller('ChartCtrl', ['$scope', 'polls', 'poll', function($scope, polls, poll){ 
    $scope.poll = poll;
    $scope.names = polls.names($scope.poll);
  $scope.counter = polls.counter($scope.poll);
 var ctx = document.getElementById("myPoll").getContext("2d");
  var data = {
   labels: $scope.names,
   datasets: [
   {
            label: "My First dataset",
            fillColor: "rgba(77,127,106,0.7)",
            strokeColor: "rgba(120,120,120,0.1)",
            highlightFill: "rgba(57,107,86,0.8)",
            highlightStroke: "rgba(220,220,220,0.5)",
            data: $scope.counter
            }
  ]
 };
 var myNewChart = new Chart(ctx).Bar(data, { scaleBeginAtZero : true,
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    barShowStroke : true,
    scaleFontSize: 18,
    scaleFontColor: '#444444',
    responsive: true
});
 }]);

 //ALLPOLLS CONTROLLER
 app.controller('AllCtrl', ['$scope', '$state', 'polls', 'slide', function($scope, $state, polls, slide){ 
    $scope.polls = polls.polls;
     $scope.slide = slide.slide; 
     $scope.slideEdit = slide.edit;
     $scope.show = false;
     $scope.del = function(poll, $index) {
      polls.del({
       id: poll._id,
       idx: $index
      });
     };
     $scope.edit = function(poll) {
      $scope.idx = $scope.polls.indexOf(poll);
      polls.pollIndex = $scope.idx;
      polls.edit = poll._id;
      $scope.slideEdit = true;
      slide.edit = $scope.slideEdit;
      $scope.slideForm();
     };
     $scope.$watch(function() { return slide.slide; }, function() { $scope.slide = slide.slide;});
     $scope.slideForm = function() {
  $scope.slide = ($scope.slide) ? false : true;
  slide.slide = $scope.slide; 
 };
 }]);
 //EDIT CONTROLLER
 app.controller('EditCtrl', ['$scope', '$state', '$http', 'polls', 'slide', function($scope, $state, $http, polls, slide) {
 //$scope.$watch(function() { return polls.edit; }, function() {$scope.idx = polls.edit;});
 $scope.$watch(function() { return polls.edit; }, function() { if(polls.edit !== 0){  getPoll(); }});
// $scope.$watch(function() { return polls.newOpt; }, function() { $scope.newOpt = polls.newOpt;});
 $scope.$watch(function() { return polls.polls[$scope.idx]; }, function() { $scope.poll = polls.polls[$scope.idx];});
function getPoll() {
    return $http.get('/poll/' + polls.edit).then(function(res) {
     $scope.poll = res.data;
    });
 };
    
  $scope.deleteCount = false;
  
  $scope.editQuest = function() {
   polls.updatePoll($scope.poll);
   
   if($scope.deleteCount) {
     polls.deleteCount($scope.poll._id);
     angular.forEach($scope.poll.options, function(opt) {
    opt.count = 0;
   });
   $scope.poll.countAll = 0;
   $scope.deleteCount = false;
   }
   //$scope.poll = {question: $scope.poll.question, options: $scope.poll.options, multi: $scope.poll.multi};
   //polls.polls[polls.edit].countAll = $scope.poll.countAll;
   slide.slide = false;
   slide.btn = false;
   slide.edit = false;
  };

   $scope.addEmpty = function() {
      $scope.opt = { text: "", count: 0, poll: $scope.poll._id };
     // polls.createOpt($scope.opt);
      $scope.poll.options.push($scope.opt);
      $scope.editPoll.$setPristine();
    };
    
    
    
     $scope.deleteEmpty = function(opt, $index) {
      if($scope.poll.options.length > 2) {
       $scope.poll.options.splice($index,1);
      if(opt.hasOwnProperty('_id')) {
      polls.deleteOption({
       id: opt._id || $scope.newOpt,
       poll: $scope.poll._id
      });
      }
      }
    };
    
 }]);
  app.controller('AuthCtrl', ['$scope','$state','auth', function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('main');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('main');
    });
  };
}])

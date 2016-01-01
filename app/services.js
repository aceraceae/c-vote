//SERVICES
//Poll service
app.factory('polls', ['$http', 'auth', function($http, auth){
  var obj = {
    polls: [],
    names: function(polls) {
       var names = [];
       polls.options.forEach(function(elem) {
           names.push(elem.text);
       });
      return names;  
    },
    counter: function(polls) {
       var count = [];
       polls.options.forEach(function(elem) {
           count.push(elem.count);
       });
       return count;  
     },
    edit: 0,
    pollIndex: 0
  };
  
  obj.getAll= function(userId) {
    return $http.get('/all/' + userId,  {
    headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      angular.copy(data, obj.polls);
    });
  };
  obj.create = function(poll) {
  return $http.post('/all/' + poll.user, poll, {
    headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
    data.options = poll.options;
    obj.polls.push(data);
  });
  };
  obj.del = function(poll) {
    obj.polls.splice(poll.idx,1);
    return $http.put('/all', poll, {
    headers: {Authorization: 'Bearer '+auth.getToken()}});
      
  };

  obj.updatePoll = function(poll) {
    return $http.put('/poll/' + poll._id + '/update', poll, {
    headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data) {
      obj.polls[obj.pollIndex] = data;
    });
    
  };
   obj.deleteOption = function(option) {
    return $http.put('/poll/' + option.poll + '/option/' + option.id, null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}});
  };
  obj.deleteCount = function(poll) {
    return $http.put('/poll/' + poll + '/deletecount', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data) {
      obj.polls[obj.pollIndex].countAll = 0;
    });
  };
  obj.getOne = function(id) {
    return $http.get('/poll/' + id).then(function(res) {
      return res.data;
    });
  };
  obj.vote = function(poll, opt) {
  return $http.put('/poll/' + poll._id + '/countAll')
   .success(function(data){
      poll.countAll += 1;
    });
  };
  obj.voteOpt = function(poll, opt) {
  return $http.put('/poll/' + poll._id + '/option/' + opt._id + '/count')
    .success(function(data){
      opt.count += 1;
    });
  };
  return obj;
}]);
//Slide panels
app.factory('slide', [function(){
  var obj = {
    slide: false,
    btn: true,
    edit: false
  };
  return obj;
}]);
//Authentication
app.factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {};
  auth.saveToken = function (token){
  $window.localStorage['c-vote-token'] = token;
};
  auth.getToken = function (){
  return $window.localStorage['c-vote-token'];
};
 auth.isLoggedIn = function(){
  var token = auth.getToken();

  if(token){
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
};
  auth.currentUser = function(){
  if(auth.isLoggedIn()){
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload.username;
  }
};
auth.userId = function() {
  if(auth.isLoggedIn()){
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload._id;
  }
};
auth.register = function(user){
  return $http.post('/register', user).success(function(data){
    auth.saveToken(data.token);
  });
};
auth.logIn = function(user){
  return $http.post('/login', user).success(function(data){
    auth.saveToken(data.token);
  });
};
auth.logOut = function(){
  $window.localStorage.removeItem('c-vote-token');
};
  return auth;
}]);


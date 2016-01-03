'use strict';
var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');
var Option = mongoose.model('Option');
var User = mongoose.model('User');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SECRET, userProperty: 'payload'});
// GET ALL

module.exports = function (app) {

  
app.post('/register', function(req, res, next) {
     if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
  
});  

app.post('/login', function(req, res, next) {
      if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
 
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
}); 


  
app.get('/all/:user', auth, function(req, res, next) {
  Poll.find({user: req.user},function(err, polls){
    if(err){ return next(err); }
    res.json(polls);
  });
});

// POST ALL
app.post('/all/:user', auth, function(req, res, next) {
  var poll = new Poll(req.body);
  var option;
  poll.options = [];
  req.body.options.forEach(function(opt,idx) {
    req.body.options[idx].poll = poll._id;
    option = new Option(req.body.options[idx]);
    option.save(function(err){
    if(err){ return next(err); }
  });
    poll.options.push(option);
  });
  poll.save(function(err){
    if(err){ return next(err); }
  });
  
    res.json(poll);

});

app.param('user', function(req, res, next, param) {
   var query = User.findById(param);
   query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });

});

app.put('/all', auth, function(req,res, next) {
  var poll = req.body;
  Poll.findByIdAndRemove(poll.id, function(err) {
  if (err) throw err;
});
Option.remove({ poll: poll.id }, function (err) {
  if (err) throw err;
});
});

// POLL PARAM
app.param('poll', function(req, res, next, id) {
  var query = Poll.findById(id);
  query.exec(function (err, poll){
    if (err) { return next(err); }
    if (!poll) { return next(new Error('can\'t find poll')); }

    req.poll = poll;
    return next();
  });
});
// GET POLL
app.get('/poll/:poll', function(req, res) {
   req.poll.populate('options', function(err, poll) {
    if (err) { return next(err); }

    res.json(poll);
  });
});

app.get('/chart/:poll', function(req, res) {
   req.poll.populate('options', function(err, poll) {
    if (err) { return next(err); }

    res.json(poll);
  });
});

app.get('/edit/:poll', function(req, res) {
   req.poll.populate('options', function(err, poll) {
    if (err) { return next(err); }

    res.json(poll);
  });
});


// PUT POLL COUNT
app.put('/poll/:poll/countAll', function(req, res, next) {

    req.poll.counter(function(err, poll){
    if (err) { return next(err); }
    res.json(poll);
  });
});

app.put('/poll/:poll/option/:option', auth, function(req,res, next) {
  
  Option.remove({ _id: req.option._id }, function(err) {
    if (err) throw err;
});
  Poll.findById(req.poll._id).exec(function(err, poll) {
    if(err) return next(err);
    var idx = poll.options.indexOf(req.option._id);
    poll.options.splice(idx, 1);
    poll.save(function(err) {
      if(err) return next(err);
    });
    res.json(poll);
  });
 
});

app.post('/poll/:poll/option', auth, function(req,res, next) {
  var option = new Option(req.body);
 // option.poll = req.poll;
    option.save(function(err, option){
    if(err){ return next(err); }
    res.json(option);
  });
 
});

// PUT OPTIONS COUNT
app.put('/poll/:poll/option/:option/count', function(req, res, next) {
     req.option.counter(function(err, option) {
       if(err) { return next(err); }
         res.json(option);
         });
     });
     
app.put('/poll/:poll/deletecount', auth, function(req, res, next) {
   Poll.findById(req.poll._id).exec(function (err, poll) {
       if (err) { return next(err); }
          poll.countAll = 0;
         Option.update({poll: req.poll._id }, { 'count': 0 }, {multi: true}, function (err) {
               if (err) return next(err);
          });
          
         poll.save(function (err) {
               if (err) return next(err);
               res.json(poll);
          });
     });
});
app.put('/poll/:poll/update', auth, function(req,res,next) {
  var option, completer = 0;
  
    req.body.options.forEach(function(opt, idx) {
    if(opt.hasOwnProperty('_id')) {
    Option.update({_id: opt}, { 'text': req.body.options[idx].text }, function(err, opt) {
    if(err) return next(err);
    complete();
  });
    } else {
           option = new Option(opt);
           option.save(function(err, opti){
           if(err){ 
             return next(err);
           }
           });
           Poll.findById(req.poll._id).exec(function(err, poll) {
             if(err) return next(err);
             poll.options.push(option);
             poll.save(function(err) {
                if(err) return next(err);
                complete();
             });
           });
    }
  });
  
  
  
  Poll.update({ _id: req.poll._id }, { 'question': req.body.question, 'multi': req.body.multi }, {multi: false}, function(err, poll) {
    if(err) return next(err);
    complete();
  });
  
  function complete() {
    if(completer === req.body.options.length) {
      completer = 0;
      Poll.findById(req.poll._id).exec(function(err, poll) {
        if(err) {return next(err); }
        console.log("eueue");
        res.json(poll);
      });
    }
    else {
      completer++;
    }
  }


});



// OPTION PARAM
app.param('option', function(req, res, next, param) {
   var query = Option.findById(param);
   query.exec(function (err, option){
    if (err) { return next(err); }
    if (!option) { return next(new Error('can\'t find poll')); }

    req.option = option;
    return next();
  });

});


};
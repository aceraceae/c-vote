var mongoose = require('mongoose');

var OptionSchema = new mongoose.Schema({
  text: String,
  count: Number,
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' }
});

OptionSchema.methods.counter = function(cb) {
  this.count += 1;
  this.save(cb);
};

mongoose.model('Option', OptionSchema);


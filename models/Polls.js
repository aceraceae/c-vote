var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
  question: String,
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
  multi: Boolean,
  countAll: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

PollSchema.methods.counter = function(cb) {
  this.countAll += 1;
  this.save(cb);
};
PollSchema.methods.counterOpt = function(cb) {
  this.count += 1;
  this.save(cb);
};
mongoose.model('Poll', PollSchema);
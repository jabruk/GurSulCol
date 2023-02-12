const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  price: {
    type: String,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Mobile','Computer'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

deviceSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//deviceSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('device', deviceSchema);
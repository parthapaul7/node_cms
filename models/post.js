const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  file:{
    type: String,
  },
  author: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  }
});

module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
  file_name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
    },
  type: {
    type: String,
    required: true
  },
  file:{
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Asset', assetSchema);
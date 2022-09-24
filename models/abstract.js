const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const abstractSchema = new Schema({
  field: {
    type: String,
    required: true,
  },
  theme:{
    type: String,
    required: true,
  },
  abstractId: {
    type: String,
    unique: true,
    required: true,
    default: "default",
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  coAuthors: {
    type: String,
    required: true,
  },
  corrAuthor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  presAuthor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    position: { type: String, required: true },
  },

  affiliation: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },
},{
    timestamps: true
} );

abstractSchema.plugin(AutoIncrement, {id:"abstract", inc_field: "index" });

module.exports = mongoose.model("Abstract", abstractSchema);

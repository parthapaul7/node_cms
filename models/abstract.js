const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const abstractSchema = new Schema({
  abstractId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  commAuthor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  presAutor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneno: { type: String, required: true },
  },

  affitiliation: {
    type: String,
    required: true,
  },

  file: {
    type: String,
    required: true,
  },
});

abstractSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Abstract", abstractSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const registrationSchema= new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    abstractId: {
      type: String,
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
    },
    phoneNo:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

registrationSchema.plugin(AutoIncrement, {id:"registration",inc_field: "index" });

module.exports = mongoose.model("Registration", registrationSchema);
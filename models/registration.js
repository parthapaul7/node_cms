const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const registrationSchema= new Schema(
  {
    // for all 
    position:{
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true,
    },
    state:{
      type: String,
    },
    sbRefNo:{
      type: String,
      required: true,
    },
    presAuthor:{
      name:{type:String},
      email:{type:String},
      designation:{type:String},
      institute:{type:String},
      phone: {type:String}

    },
    // for only participant
    abstractId: {
      type: String,
    },
    // for only other
    theme:{
      type: String,
    },
    title:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

registrationSchema.plugin(AutoIncrement, {id:"registration",inc_field: "index" });

module.exports = mongoose.model("Registration", registrationSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const assetSchema = new Schema(
  {
    file_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    file: {
      required: true,
      type: String,
    },
    field1: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

assetSchema.plugin(AutoIncrement, { inc_field: "index" });

module.exports = mongoose.model("Asset", assetSchema);

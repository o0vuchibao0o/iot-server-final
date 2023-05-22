import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
      enum: ["TV", "Air Conditioning"],
      required: true,
    },
    buttons: {
      type: Array,
      default: [],
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model("Device", deviceSchema);
export default deviceModel;

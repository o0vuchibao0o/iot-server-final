import mongoose from "mongoose";

const raspberryPiSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    listOfDevices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const raspberryPiModel = mongoose.model("RaspberryPi", raspberryPiSchema);
export default raspberryPiModel;

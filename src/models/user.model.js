import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    listOfRaspberryPis: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RaspberryPi",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function (password) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(password, salt);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;

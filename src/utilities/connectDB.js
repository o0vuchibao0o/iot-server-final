import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("MongoDB Error");
      console.log(err);
    });
};

export default connectDB;

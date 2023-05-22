import deviceModel from "../models/device.model.js";
import raspberryPiModel from "../models/raspberryPi.model.js";
import userModel from "../models/user.model.js";

const userController = {
  signIn: async ({ username, password }) => {
    try {
      const user = await userModel.findOne({ username: username });
      if (!user) {
        return {
          status: "error",
          message: "Username or Password wrong!",
        };
      }

      if (!user.validPassword(password)) {
        return {
          status: "error",
          message: "Username or Password wrong!",
        };
      }

      user.password = undefined;

      return {
        status: "success",
        message: "Sign in successfully",
        user,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  },

  signUp: async ({ username, password }) => {
    try {
      const user = await userModel.findOne({ username });
      if (user) {
        return {
          status: "error",
          message: "Username already have!",
        };
      }

      const newUser = new userModel();
      newUser.username = username;
      newUser.setPassword(password);
      newUser.listOfRaspberryPis = [];
      await newUser.save();

      return {
        status: "success",
        message: "Sign up success",
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  },

  addRaspberryPi: async ({ username, idOfRaspberryPi }) => {
    try {
      const raspberryPi = await raspberryPiModel.findOne({
        id: idOfRaspberryPi,
      });
      if (!raspberryPi) {
        return { status: "error" };
      }

      const user = await userModel.findOneAndUpdate(
        {
          username: username,
        },
        {
          $addToSet: {
            listOfRaspberryPis: raspberryPi._id,
          },
        },
        { new: true }
      );

      return { status: "success" };
    } catch (err) {
      console.log(err);
    }
  },

  getDevice: async (req, res) => {
    try {
      const { idOfDevice } = req.params;

      const device = await deviceModel.findOne({
        id: idOfDevice,
      });

      return res.json({ status: "success", device });
    } catch (err) {
      console.log(err);
    }
  },

  getDevices: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await userModel
        .findOne({ username: username })
        .select("-password")
        .populate({
          path: "listOfRaspberryPis",
          populate: {
            path: "listOfDevices",
          },
        });

      if (!user) {
        return;
      }

      const listOfRaspberryPisFromUser = user.listOfRaspberryPis;
      const listOfDevicesFromUser = [];
      listOfRaspberryPisFromUser.forEach((element) => {
        element.listOfDevices.forEach((e) => listOfDevicesFromUser.push(e));
      });

      const { type } = req.query;

      if (type) {
        const deviceFilter = [...listOfDevicesFromUser].filter(
          (e) => e.type === type
        );
        return res.json({ status: "success", devices: deviceFilter });
      }

      return res.json({ status: "success", devices: listOfDevicesFromUser });
    } catch (err) {
      console.log(err);
    }
  },

  getDeviceRecently: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await userModel
        .findOne({ username: username })
        .select("-password")
        .populate({
          path: "listOfRaspberryPis",
          populate: {
            path: "listOfDevices",
          },
        });

      if (!user) {
        return;
      }

      const listOfRaspberryPisFromUser = user.listOfRaspberryPis;
      const listOfDevicesFromUser = [];
      listOfRaspberryPisFromUser.forEach((element) => {
        element.listOfDevices.forEach((e) => listOfDevicesFromUser.push(e));
      });

      let max;
      for (let i = 0; i <= listOfDevicesFromUser.length - 1; i++) {
        if (!max) {
          max = listOfDevicesFromUser[i];
        } else {
          if (max.createdAt < listOfDevicesFromUser[i].createdAt) {
            max = listOfDevicesFromUser[i];
          }
        }
      }
      return res.json({
        status: "success",
        device: max,
      });
    } catch (err) {
      console.log(err);
    }
  },
};

export default userController;

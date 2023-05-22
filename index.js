import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import deviceController from "./src/controllers/device.controller.js";
import connectDB from "./src/utilities/connectDB.js";
import userController from "./src/controllers/user.controller.js";
import raspberryPiController from "./src/controllers/raspberryPi.controller.js";
import userRoute from "./src/routes/user.route.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING...");
});

app.use("/api", userRoute);

io.on("connect", (socket) => {
  //SIGN UP
  socket.on("sign-up", async (data) => {
    console.log({ data });
    try {
      const { username, password } = data;
      const result = await userController.signUp({ username, password });

      io.emit("res-sign-up", {
        status: result.status,
        message: result.message,
      });
    } catch (err) {
      console.log(err);
    }
  });
  //SIGN IN
  socket.on("sign-in", async (data) => {
    console.log({ data });
    try {
      const { username, password } = data;
      const result = await userController.signIn({ username, password });
      if (result.status === "success") {
        io.emit("res-sign-in", {
          status: result.status,
          message: result.message,
          user: result.user,
        });
      } else if (result.status === "error") {
        io.emit("res-sign-in", {
          status: result.status,
          message: result.message,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  //CREATE OR SEND CHECK 0 OR 1
  socket.on("android-send-device-data", async (data) => {
    console.log({ data });

    try {
      const {
        username,
        check,
        idOfDevice,
        nameOfDevice,
        typeOfDevice,
        nameButton,
      } = data;
      // Thu Tin Hieu
      if (check === "1") {
        const device = await deviceController.createOrUpdateDevice({
          idOfDevice: idOfDevice,
          nameOfDevice: nameOfDevice,
          typeOfDevice: typeOfDevice,
          nameButton: nameButton,
        });

        io.emit("server-send-raspberryPi-data-check-and-button", {
          check: check,
          idOfDevice: idOfDevice,
          nameButton: nameButton,
        });
      }
      // GUI TIN HIEU
      else if (check === "0") {
        const found = await deviceController.getHexButtonFromIdDevice({
          username: username,
          idOfDevice: idOfDevice,
          nameButton: nameButton,
        });

        io.emit("server-send-raspberryPi-data-check-and-button", {
          check: check,
          nameButton: nameButton,
          hexButton: found?.hexButton,
          idOfRaspberryPi: found?.idOfRaspberryPi,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("android-submit-device-data", async (data) => {
    console.log({ data });
    try {
      const { username, idOfDevice, newNameOfDevice, idOfRaspberryPi } = data;
      const device = await deviceController.updateNameAndStatusFromIdDevice({
        idOfDevice: idOfDevice,
        newNameOfDevice: newNameOfDevice,
      });

      if (device) {
        await raspberryPiController.createRaspberryPi({
          idOfRaspberryPi,
        });

        await userController.addRaspberryPi({ username, idOfRaspberryPi });

        await raspberryPiController.addDeviceToRaspberryPi({
          _idOfDevice: device?._id,
          idOfRaspberryPi: idOfRaspberryPi,
        });

        io.emit("res-android-submit-device-data", {
          status: "success",
        });
      } else {
        io.emit("res-android-submit-device-data", {
          status: "error",
        });
      }
    } catch (err) {
      console.log(err);
      io.emit("res-android-submit-device-data", {
        status: "error",
      });
    }
  });
  //Get hex
  socket.on("raspberryPi-send-server-nameButton-hexButton", async (data) => {
    console.log({ data });
    try {
      const { idOfDevice, nameButton, hexButton } = data;
      await deviceController.updateHexButtonFromIdDevice({
        idOfDevice: idOfDevice,
        nameButton: nameButton,
        hexButton: hexButton,
      });
    } catch (err) {
      console.log(err);
    }
  });
  //Delete device
  socket.on("android-send-server-id-of-device", async (data) => {
    console.log({ data });
    try {
      const { idOfDevice, username } = data;
      await deviceController.deleteDeviceFromIdDevice({
        idOfDevice: idOfDevice,
        username: username,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Listen on port: ${PORT}`);
});

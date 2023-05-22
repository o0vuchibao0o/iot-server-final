import deviceModel from "../models/device.model.js";
import raspberryPiModel from "../models/raspberryPi.model.js";
import userModel from "../models/user.model.js";

const deviceController = {
  getHexButtonFromIdDevice: async ({ username, idOfDevice, nameButton }) => {
    try {
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

      const checkDevice = await deviceModel.findOne({
        id: idOfDevice,
      });
      const found = [...checkDevice.buttons].find(
        (element) => element.nameButton === nameButton
      );

      found.idOfRaspberryPi = "";

      const listOfRaspberryPisFromUser = user.listOfRaspberryPis;
      let checkOut = false;
      for (let i = 0; i <= listOfRaspberryPisFromUser.length - 1; i++) {
        if (checkOut) {
          break;
        }
        const RaspberryPi = listOfRaspberryPisFromUser[i];
        const listOfDevices = RaspberryPi.listOfDevices;
        for (let j = 0; j <= listOfDevices.length - 1; j++) {
          if (listOfDevices[j].id === idOfDevice) {
            found.idOfRaspberryPi = RaspberryPi.id;
            checkOut = true;
            break;
          }
        }
      }

      return found;
    } catch (error) {
      console.log(error);
    }
  },

  createOrUpdateDevice: async ({
    idOfDevice,
    nameOfDevice,
    typeOfDevice,
    nameButton,
  }) => {
    try {
      const checkDevice = await deviceModel.findOne({
        id: idOfDevice,
      });

      //update
      if (checkDevice) {
        const found = [...checkDevice.buttons].find(
          (e) => e.nameButton === nameButton
        );
        if (found) {
          return checkDevice;
        }

        checkDevice.buttons = [
          ...checkDevice.buttons,
          { nameButton: nameButton, hexButton: "" },
        ];
        await checkDevice.save();
        return checkDevice;
      }

      //create
      const newDevice = new deviceModel({
        id: idOfDevice,
        name: nameOfDevice,
        type: typeOfDevice,
      });
      newDevice.buttons = [
        ...newDevice.buttons,
        { nameButton: nameButton, hexButton: "" },
      ];
      await newDevice.save();

      return newDevice;
    } catch (error) {
      console.log(error);
    }
  },

  updateHexButtonFromIdDevice: async ({
    idOfDevice,
    nameButton,
    hexButton,
  }) => {
    try {
      const checkDevice = await deviceModel.findOne({
        id: idOfDevice,
      });

      checkDevice.buttons = [...checkDevice.buttons].map((element) => {
        return element.nameButton === nameButton
          ? { nameButton: nameButton, hexButton: hexButton }
          : element;
        // if (element.nameButton === nameButton) {
        //   if (element.hexButton !== "") {
        //     return {
        //       nameButton: nameButton,
        //       hexButton: element.hexButton === hexButton ? hexButton : "",
        //     };
        //   } else {
        //     return {
        //       nameButton: nameButton,
        //       hexButton: hexButton,
        //     };
        //   }
        // } else {
        //   return element;
        // }
      });
      await checkDevice.save();
    } catch (error) {
      console.log(error);
    }
  },

  updateNameAndStatusFromIdDevice: async ({ idOfDevice, newNameOfDevice }) => {
    return await deviceModel.findOneAndUpdate(
      {
        id: idOfDevice,
      },
      {
        status: true,
        name: newNameOfDevice,
      },
      {
        new: true,
      }
    );
  },

  deleteDeviceFromIdDevice: async ({ idOfDevice, username }) => {
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
    console.log({ user });

    const device = await deviceModel.findOneAndDelete({
      id: idOfDevice,
    });
    console.log({ device });

    if (!device) {
      return;
    }

    let idOfRaspberryPi = "";
    const listOfRaspberryPisFromUser = [...user.listOfRaspberryPis];

    listOfRaspberryPisFromUser.forEach((element) => {
      element.listOfDevices.forEach((e) => {
        if (e._id.toString() === device._id.toString()) {
          console.log("HIIIIII");
          idOfRaspberryPi = element._id.toString();
        }
      });
    });

    console.log({ idOfRaspberryPi });

    if (idOfRaspberryPi === "") {
      return;
    }

    const raspberryPiCurrent = await raspberryPiModel.findOne({
      _id: idOfRaspberryPi,
    });

    if (!raspberryPiCurrent) {
      return;
    }

    raspberryPiCurrent.listOfDevices = [
      ...raspberryPiCurrent.listOfDevices,
    ].filter((e) => e._id.toString() !== device._id.toString());

    console.log({ raspberryPiCurrent });

    await raspberryPiCurrent.save();
  },
};

export default deviceController;

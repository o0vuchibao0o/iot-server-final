import raspberryPiModel from "../models/raspberryPi.model.js";

const raspberryPiController = {
  createRaspberryPi: async ({ idOfRaspberryPi }) => {
    try {
      const raspberryPi = await raspberryPiModel.findOne({
        id: idOfRaspberryPi,
      });
      if (raspberryPi) {
        return;
      }

      await new raspberryPiModel({
        id: idOfRaspberryPi,
        listOfDevices: [],
      }).save();
      return { status: "success", message: "Add Raspberry Pi successfully" };
    } catch (err) {
      console.log(err);
    }
  },

  addDeviceToRaspberryPi: async ({ _idOfDevice, idOfRaspberryPi }) => {
    try {
      await raspberryPiModel.findOneAndUpdate(
        {
          id: idOfRaspberryPi,
        },
        {
          $addToSet: {
            listOfDevices: _idOfDevice,
          },
        },
        { new: true }
      );
      return { status: "success" };
    } catch (err) {
      console.log(err);
    }
  },
};

export default raspberryPiController;

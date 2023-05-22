import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/device/:idOfDevice", userController.getDevice);

router.get("/:username/device-recently", userController.getDeviceRecently);
router.get("/:username/devices", userController.getDevices);

export default router;

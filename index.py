import socketio
sio = socketio.Client()

# sio.connect("https://iot-server-final.onrender.com/")
sio.connect("http://localhost:9000")


print("Server Raspberry Pi is running...")

# =============================SIGN UP=============================
# sio.emit("sign-up",
#          {
#              "username": "vuchibaoacc1",
#              "password": "12345678",
#          }
#          )


# @sio.on("res-sign-up")
# def on_message(data):
#     print("res-sign-up", data)
# =============================SIGN UP=============================


# =============================SIGN IN=============================
# sio.emit("sign-in",
#          {
#              "username": "vuchibaoacc1",
#              "password": "12345678",
#          }
#          )


# @sio.on("res-sign-in")
# def on_message(data):
#     print("res-sign-in", data)
# =============================SIGN IN=============================


# =============================ADD DEVICE TO RASPBERRY PI OR SEND HEX TO RASPBERRY PI=============================
# sio.emit("android-send-device-data",
#          {
#              "check": "1",
#              "idOfDevice": "22222222222222222",
#              "nameOfDevice": "TV 22222222222222222",
#              "typeOfDevice": "TV",
#              "nameButton": "2",
#              "username": "vuchibaoacc1",
#          }
#          )

# sio.emit("android-send-device-data",
#          {
#              "check": "0",
#              "idOfDevice": "bfbb5c70-4e81-4666-bea7-64867cc2cf9a",
#              "nameButton": "2",
#              "username": "vuchibaoacc1",
#          }
#          )

# sio.emit("android-submit-device-data",
#          {
#              "idOfDevice": "888",
#              "newNameOfDevice": "TV 8",
#              "idOfRaspberryPi": "123456789",
#          }
#          )
# =============================ADD DEVICE TO RASPBERRY PI=============================


# @sio.on("server-send-raspberryPi-data-check-and-button")
# def on_message(data):
#     if (data["check"] == "1"):
#         print(data)
#         sio.emit("raspberryPi-send-server-nameButton-hexButton", {
#             "idOfDevice": data["idOfDevice"],
#             "nameButton": data["nameButton"],
#             "hexButton": "X001"
#         })
#     elif (data["check"] == "0"):
#         print(data)

sio.emit("android-send-server-id-of-device",
         {
             "idOfDevice": "0e43b61c-621d-4313-90be-ca9fa1e9fae4",
             "username": "vuchibaoacc1"
         }
         )

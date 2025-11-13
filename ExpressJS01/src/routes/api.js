// const express = require("express");
// const {
//   createUser,
//   handleLogin,
//   getUser,
//   getAccount,
// } = require("../controllers/userController");

// const {
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/auth.controller");

// const auth = require("../middleware/auth");
// const delay = require("../middleware/delay");

// const routerAPI = express.Router();

// // Test route
// routerAPI.get("/", (req, res) => {
//   return res.status(200).json("Hello world api");
// });

// // Register + Login
// routerAPI.post("/register", createUser);
// routerAPI.post("/login", handleLogin);

// // Forgot + Reset password
// routerAPI.post("/forgot-password", forgotPassword);
// routerAPI.post("/check-otp", checkOTP);
// routerAPI.post("/reset-password", resetPassword);

// // Protected routes
// routerAPI.get("/user", auth, getUser);
// routerAPI.get("/account", auth, delay, getAccount);

// module.exports = routerAPI;

const express = require("express");

const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");

const {
  forgotPassword,
  resetPassword,
  checkOTP,
} = require("../controllers/auth.controller");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// Register + Login
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// OTP
routerAPI.post("/forgot-password", forgotPassword);
routerAPI.post("/check-otp", checkOTP);
routerAPI.post("/reset-password", resetPassword);

// Protected
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

module.exports = routerAPI;

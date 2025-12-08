const express = require("express");
const publicRoutes = require("./publicRoutes");
const protectedRoutes = require("./protectedRoutes");
const adminRoutes = require("./adminRoutes");
const adminUserRoutes = require("./adminUserRoutes");

const routerAPI = express.Router();

// Use the separate route modules
routerAPI.use("/", publicRoutes);
routerAPI.use("/", protectedRoutes);
routerAPI.use("/", adminRoutes);
routerAPI.use("/", adminUserRoutes);

module.exports = routerAPI;

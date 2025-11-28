const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },

  otp: {
    type: DataTypes.STRING,
    defaultValue: "",
  },

  otpExpire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;

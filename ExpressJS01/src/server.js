require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");
const Category = require("./models/category");
// LOAD FULL ASSOCIATIONS FIRST
// require("./models/associations");

const seedCategories = require("./seed/categories");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-id"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configViewEngine(app);

// view route
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

// API
app.use("/v1/api", apiRoutes);

// (async () => {
//   try {
//     // connect MySQL + sync models
//     await sequelize.authenticate();
//     console.log("MySQL Connected!");

//     await sequelize.sync(); // Tự tạo bảng nếu chưa có
//     console.log("Models synced!");

//     // Seed dữ liệu ban đầu
//     await seedCategories();

//     app.listen(port, () => {
//       console.log(`Backend running on port ${port}`);
//     });
//   } catch (error) {
//     console.log("DB Error:", error);
//   }
// })();

// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database synchronized successfully.");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

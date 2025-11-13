// require("dotenv").config();

// // import các nguồn cần dùng
// const express = require("express");
// const configViewEngine = require("./config/viewEngine");
// const apiRoutes = require("./routes/api");
// const connection = require("./config/database");
// const { getHomepage } = require("./controllers/homeController");
// const cors = require("cors");

// const app = express(); // cấu hình app là express

// // cấu hình port, nếu không thấy PORT trong .env thì dùng 8888
// const port = process.env.PORT || 8888;

// // config cors
// app.use(cors());

// // config req.body cho json
// app.use(express.json());

// // config req.body cho form data
// app.use(express.urlencoded({ extended: true }));

// // config template engine (EJS)
// configViewEngine(app);

// // config route cho view EJS
// const webAPI = express.Router();
// webAPI.get("/", getHomepage);
// app.use("/", webAPI);

// // khai báo route cho API
// app.use("/v1/api", apiRoutes);

// // chạy server và kết nối DB
// (async () => {
//   try {
//     // kết nối database using mongoose
//     await connection();

//     // lắng nghe port
//     app.listen(port, () => {
//       console.log(`Backend NodeJS App listening on port ${port}`);
//     });
//   } catch (error) {
//     console.log(">>> Error connect to DB: ", error);
//   }
// })();

require("dotenv").config();
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const sequelize = require("./config/database");
const { getHomepage } = require("./controllers/homeController");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

// view route
const webAPI = express.Router();
webAPI.get("/", getHomepage);
app.use("/", webAPI);

// API
app.use("/v1/api", apiRoutes);

(async () => {
  try {
    // connect MySQL + sync models
    await sequelize.authenticate();
    console.log("MySQL Connected!");

    await sequelize.sync(); // Tự tạo bảng nếu chưa có
    console.log("Models synced!");

    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
    });
  } catch (error) {
    console.log("DB Error:", error);
  }
})();

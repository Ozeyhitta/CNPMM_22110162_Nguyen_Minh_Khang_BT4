// require("dotenv").config();
// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const saltRounds = 10;

// // =========================
// // CREATE USER
// // =========================
// const createUserService = async (name, email, password) => {
//   try {
//     // check user exist
//     const user = await User.findOne({ email });
//     if (user) {
//       console.log(`>>> user exist, chọn 1 email khác: ${email}`);
//       return null;
//     }

//     // hash user password
//     const hashPassword = await bcrypt.hash(password, saltRounds);

//     // save user to database
//     let result = await User.create({
//       name: name,
//       email: email,
//       password: hashPassword,
//       role: "User",
//     });

//     return result;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// // =========================
// // LOGIN
// // =========================
// const loginService = async (email, password) => {
//   try {
//     // fetch user by email
//     const user = await User.findOne({ email });
//     if (user) {
//       // compare password
//       const isMatchPassword = await bcrypt.compare(password, user.password);
//       if (!isMatchPassword) {
//         return {
//           EC: 2,
//           EM: "Email/Password không hợp lệ",
//         };
//       } else {
//         // create an access token
//         const payload = {
//           email: user.email,
//           name: user.name,
//         };

//         const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
//           expiresIn: process.env.JWT_EXPIRE,
//         });

//         return {
//           EC: 0,
//           access_token,
//           user: {
//             email: user.email,
//             name: user.name,
//           },
//         };
//       }
//     } else {
//       return {
//         EC: 1,
//         EM: "Email/Password không hợp lệ",
//       };
//     }
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// // =========================
// // GET USERS (bỏ password)
// // =========================
// const getUserService = async () => {
//   try {
//     let result = await User.find({}).select("-password");
//     return result;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// module.exports = {
//   createUserService,
//   loginService,
//   getUserService,
// };

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async (name, email, password) => {
  const exist = await User.findOne({ where: { email } });

  if (exist) {
    return { EC: 1, EM: "Email đã tồn tại" };
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hash });

  return { EC: 0, EM: "Tạo tài khoản thành công" };
};

const loginService = async (email, password) => {
  const user = await User.findOne({ where: { email } });

  if (!user) return { EC: 1, EM: "Email không tồn tại" };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { EC: 1, EM: "Sai mật khẩu" };

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    EC: 0,
    EM: "Đăng nhập thành công",
    access_token: token,
    user,
  };
};

const getUserService = async () => {
  const users = await User.findAll();
  return { EC: 0, data: users };
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
};

const Product = require("../models/product");

const run = async () => {
  await Product.bulkCreate([
    { name: "iPhone 15", category: "phone", price: 25000000, thumbnail: "" },
    { name: "Samsung S23", category: "phone", price: 20000000, thumbnail: "" },
    { name: "Macbook Air", category: "laptop", price: 30000000, thumbnail: "" },
    // thêm 20 sản phẩm...
  ]);

  console.log("Seed ok!");
  process.exit();
};

run();

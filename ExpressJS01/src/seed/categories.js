// Seed categories
const Category = require("../models/category");

const seedCategories = async () => {
  try {
    const categories = [
      {
        name: "Điện thoại",
        description: "Các loại điện thoại di động, smartphone",
        thumbnail: "https://picsum.photos/200/200?random=1",
      },
      {
        name: "Laptop",
        description: "Máy tính xách tay, laptop",
        thumbnail: "https://picsum.photos/200/200?random=2",
      },
      {
        name: "Tablet",
        description: "Máy tính bảng, tablet",
        thumbnail: "https://picsum.photos/200/200?random=3",
      },
      {
        name: "Đồng hồ",
        description: "Đồng hồ thông minh, smartwatch",
        thumbnail: "https://picsum.photos/200/200?random=4",
      },
      {
        name: "Tai nghe",
        description: "Tai nghe, earbuds, headphones",
        thumbnail: "https://picsum.photos/200/200?random=5",
      },
    ];

    for (const categoryData of categories) {
      try {
        console.log(`Processing category: ${categoryData.name}`);
        const [category, created] = await Category.findOrCreate({
          where: { name: categoryData.name },
          defaults: categoryData,
        });

        if (created) {
          console.log(`✓ Tạo danh mục: ${category.name}`);
        } else {
          console.log(`- Danh mục đã tồn tại: ${category.name}`);
        }
      } catch (categoryError) {
        console.error(`❌ Lỗi khi xử lý danh mục ${categoryData.name}:`, categoryError);
        throw categoryError; // Re-throw để catch ở ngoài
      }
    }

    console.log("✅ Hoàn thành seed categories");
  } catch (error) {
    console.error("❌ Lỗi khi seed categories:", error);
  }
};

module.exports = seedCategories;

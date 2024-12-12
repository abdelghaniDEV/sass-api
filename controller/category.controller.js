const Category = require("../module/category.model");
const Restaurant = require("../module/restaurant.model");
const Menu = require("../module/menu.model");
const asyncWraper = require("../middleware/asyncWraper");

// create a new Category
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || name === "")
    return res.status(404).json({ message: "Invalid category name" });
  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });

  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found" });

  const existingCategory = await Category.findOne({ name, menuId: menu._id });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = new Category({ name, menuId: menu._id });
  await newCategory.save();
  res.json({ status: "success", data: { category: newCategory } });
};

// get all categories
const getAllCategories = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });
  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found" });

  const categories = await Category.find({ menuId: menu._id });
  res.json({ status: "success", data: { categories } });
});

// delete a category from the menu
const deleteCategory = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const params = req.params.categoryID;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });
  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found" });

  const category = await Category.findOne({ _id: params, menuId: menu._id });
  if (!category) return res.status(404).json({ message: "Category not found" });

  await Category.findByIdAndDelete(params);

  res.json({ status: "success", message: "Category deleted successfully" });
});

// update a category

const updateCategory = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const params = req.params.categoryID;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found" });
  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found" });

  const category = await Category.findOneAndUpdate(
    { _id: params, menuId: menu._id },
    req.body,
    { new: true }
  );

  if (!category) return res.status(404).json({ message: "Category not found" });

  res.json({ status: "success", data: { category } });
});

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
};

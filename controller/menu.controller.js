const asyncWraper = require("../middleware/asyncWraper");
const Menu = require("../module/menu.model");
const Product = require("../module/product.model");
const Category = require("../module/category.model");
const Restaurant = require("../module/restaurant.model");

// create  a new Menu
const createMenu = asyncWraper(async (req, res) => {
  const newNenu = new Menu(req.body);
  await newNenu.save();
  res.json({ status: "success", data: { menu: newNenu } });
});

// get all menus
const getAllMenus = asyncWraper(async (req, res) => {
  const menus = await Menu.find()
    .populate("restaurantId")
    .populate({
      path: "products",
      populate: {
        path: "categoryId",
        select: "name menuId",
      },
    })
    .populate("categorys");
  res.json({ status: "success", data: { menus: menus } });
});

// get menu by ID
const getSingleMenu = asyncWraper(async (req, res) => {
  const prams = req.params.menuID;
  const menu = await Menu.findById(prams)
    .populate("restaurantId")
    .populate({
      path: "products",
      populate: {
        path: "categoryId",
        select: "name menuId",
      },
    })
    .populate("categorys");
  res.json({ status: "success", data: { menu: menu } });
});

// update menu
const updateMenu = asyncWraper(async (req, res) => {
  const prams = req.params.menuID;
  const menu = await Menu.findByIdAndUpdate(
    prams,
    { $set: req.body },
    { new: true }
  );
  res.json({ status: "success", data: { menu: menu } });
});

// delete menu
const deleteMenu = asyncWraper(async (req, res) => {
  const prams = req.params.menuID;
  const menu = await Menu.findByIdAndDelete(prams);
  res.json({ status: "success", data: { menu: menu } });
});

// get menu by restuarant id
const getMenusByRestaurantId = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  const menus = await Menu.findOne({ restaurantId: restaurant._id })
    .populate("restaurantId")
    .populate({
      path: "products",
      populate: {
        path: "categoryId",
        select: "name menuId",
      },
    })
    .populate("categorys");
  res.json({ status: "SUCCESS", data: { menu: menus } });
});

// delete menu by restaurant id
const deleteMenusByRestaurantId = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const params = req.params.menuID;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  const menus = await Menu.find({ restaurantId: restaurant._id });
  if (!menus) {
    return res.status(404).json({ message: "Menus not found" });
  }

  const deleteMenu = await Menu.findByIdAndDelete(params);
  if (!deleteMenu) {
    return res.status(404).json({ message: "Menu not found" });
  }
  res.json({ status: "SUCCESS", message: "Menus deleted successfully." });
});

// update menu by restuarnt id
const multer = require("multer");
const upload = multer();

// تعديل الدالة لتدعم `FormData`
const updateMenusByRestaurantId = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  const params = req.params.menuID;

  console.log("Request body:", req.body); // عرض الحقول النصية
  console.log("Uploaded file:", req.file); // عرض الملفات المرفقة

  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  const updateData = {
    "template.primaryColor": req.body.primaryColor,
    "template.BackgroundColor": req.body.backgroundColor,
    "template.textColor": req.body.textColor,
    "template.titleColor": req.body.titleColor,
    "template.fontFamily": req.body.fontFamily,
    "template.language": req.body.language,
    "template.currency": req.body.currency,
  };

  // إذا كان هناك صورة مرفوعة (banner)
  if (req.file) {
    updateData["template.banner"] = req.file.path; // المسار الخاص بالصورة
  }

  const menu = await Menu.findByIdAndUpdate(
    params,
    { $set: updateData },
    { new: true }
  );

  if (!menu) {
    return res.status(404).json({ message: "Menu not found" });
  }

  res.json({ status: "SUCCESS", data: { menu: menu } });
});

module.exports = {
  createMenu,
  getAllMenus,
  updateMenu,
  deleteMenu,
  getSingleMenu,
  getMenusByRestaurantId,
  deleteMenusByRestaurantId,
  updateMenusByRestaurantId,
};

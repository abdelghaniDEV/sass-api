const asyncWraper = require("../middleware/asyncWraper");
const Product = require("../module/product.model");
const Menu = require("../module/menu.model");
const Restaurant = require("../module/restaurant.model");

// create new product
const createProduct = asyncWraper(async (req, res) => {
  // const {menuId , name , price , description } = req.body
  const newData = req.body;

  console.log("body", newData);

  const newProduct = new Product(newData);

  if (req.file) {
    newProduct.image = req.file.path;
  }

  await newProduct.save();
  res.json({ status: "success", data: { product: newProduct } });
});

// create new product by token
const createProductByToken = asyncWraper(async (req, res) => {
  const ownerId = req.user.id;
  // const { menuId, ...newData } = req.body; // 

  const newData = req.body

  if (req.file) {
    newData.image = req.file.path;
  }

  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found." });
  }

  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) {
    return res.status(404).json({ message: "Invalid menu ID or not found." });
  }

  const newProduct = new Product({ ...newData, menuId : menu._id });
  await newProduct.save();

  res.json({
    status: "success",
    message: "Product created successfully.",
    data: { product: newProduct },
  });
});


// get All Products
const getAllProducts = asyncWraper(async (req, res) => {
  const products = await Product.find().populate("menuId").populate("categoryId");
  res.json({ status: "success", data: { products: products } });
});

// update Product
const updateProduct = asyncWraper(async (req, res) => {
  const newProduct = req.body;
  const params = req.params.productID;
  if (req.file) {
    newProduct.image = req.file.path;
  }
  const updateProduct = await Product.findByIdAndUpdate(
    params,
    { $set: newProduct },
    { new: true }
  );
  if (!updateProduct)
    return res.status(404).json({ message: "Product not found" });
  res.json({ status: "success", data: { product: updateProduct } });
});

// // update products by token
const updateProductByToken = asyncWraper(async (req, res) => {
  const newData = req.body;
  const params = req.params.productID;
  if (req.file) {
    newData.image = req.file.path;
  }

  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found." });
  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found." });

  const product = await Product.findOne({ menuId: menu._id, _id: params });
  if (!product) {
    return res.status(404).json({ message: "Product not found or not part of this restaurant's menu." });
  }

  const updateProduct = await Product.findByIdAndUpdate(
    params,
    { $set: newData },
    { new: true }
  );
  if (!updateProduct)
    return await res.status(404).json({ message: "Failed to update product." });
  res.json({
    status: "SUCCESS",
    message: "Product updated successfully.",
    data: { product: updateProduct },
  });
});

// delete Product
const deleteProduct = asyncWraper(async (req, res) => {
  const params = req.params.productID;
  const deleteProduct = await Product.findByIdAndDelete(params);
  if (!deleteProduct)
    return res.status(404).json({ message: "Product not found" });
  res.json({ status: "success", message: "Product deleted successfully" });
});

// delet product by token 
const deleteProductByToken = asyncWraper(async (req, res) => {
  const params = req.params.productID;

  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant)
    return res.status(404).json({ message: "Restaurant not found." });
  const menu = await Menu.findOne({ restaurantId: restaurant._id });
  if (!menu) return res.status(404).json({ message: "Menu not found." });

  const product = await Product.findOne({ menuId: menu._id, _id: params });
  if (!product) {
    return res.status(404).json({ message: "Product not found or not part of this restaurant's menu." });
  }
  const deleteProduct = await Product.findByIdAndDelete(params);
  if (!deleteProduct)
    return await res.status(404).json({ message: "Failed to update product." });
  res.json({
    status: "SUCCESS",
    message: "Product deleted successfully.",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  updateProductByToken,
  deleteProductByToken, 
  createProductByToken
};

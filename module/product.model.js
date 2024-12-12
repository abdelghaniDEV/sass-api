const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId : {type : mongoose.Schema.Types.ObjectId, ref: 'Category' , required: true},
  description: { type: String , required: false },
  image: { type: String , required : false},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);

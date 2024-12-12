const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone : { type: String, required: false},
  address: { type: String },
  image : { type: String, required: false},
  description: { type: String, required: false},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);

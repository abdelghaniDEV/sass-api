const mongoose = require('mongoose');


const categoryShema = new mongoose.Schema({
    name: { type: String, required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    createdAt: { type: Date, default: Date.now },
})


module.exports = mongoose.model('Category', categoryShema);
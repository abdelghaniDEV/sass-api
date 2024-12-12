const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// تعريف العلاقة الافتراضية بين Menu و Product
MenuSchema.virtual('products', {
  ref: 'Product', // اسم النموذج المرتبط
  localField: '_id', // الحقل المحلي
  foreignField: 'menuId', // الحقل الأجنبي
});

MenuSchema.virtual('categorys' , {
  ref: 'Category', // ا��م النموذج المرتبط
  localField: '_id', // الحقل المحلي
  foreignField: 'menuId', // الحقل الأجنبي
})


module.exports = mongoose.model('Menu', MenuSchema);

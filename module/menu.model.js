const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: false },
    template: {
      banner: { type: String, required: false },
      showBanner: { type: Boolean, required: false},
      primaryColor: { type: String, required: false, default: "#F56949" },
      BackgroundColor: { type: String, required: false, default: "#ffffff" },
      textColor: { type: String, required: false, default: "#000000" },
      titleColor: { type: String, required: false, default: "#000000" },
      fontFamily: { type: String, required: false, default: '"Outfit", serif' },
      language: { type: String, required: false, default: "en" },
      currency: { type: String, required: false, default: "USD" },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// تعريف العلاقة الافتراضية بين Menu و Product
MenuSchema.virtual("products", {
  ref: "Product", // اسم النموذج المرتبط
  localField: "_id", // الحقل المحلي
  foreignField: "menuId", // الحقل الأجنبي
});

MenuSchema.virtual("categorys", {
  ref: "Category", // ا��م النموذج المرتبط
  localField: "_id", // الحقل المحلي
  foreignField: "menuId", // الحقل الأجنبي
});

module.exports = mongoose.model("Menu", MenuSchema);

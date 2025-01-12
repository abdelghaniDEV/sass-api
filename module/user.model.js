const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'owner'], default: 'owner' },
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'pro'], default: 'free' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }, // 14 يوم للخطة المجانية كبداية
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' }, // free تكون active مباشرة
    amountPaid: { type: Number, default: 0 }, // المبلغ المدفوع للخطة
  },
  isInfoAvailable : { type: Boolean, default: false},
  verifyOtp : {type : String, default: ''},
  verifyOtpExpireAt : {type : Number, default: 0},
  isAcountVerified : {type: Boolean, default: false},
  resetOtp : {type : String, default: ''},
  resetOtpExpireAt : {type : Number, default: 0}, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);

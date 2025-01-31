const cron = require('node-cron');
const User = require('../module/user.model'); 

const checkExpiredSubscriptions = () => {
  cron.schedule('* * * * *', async () => {
    console.log('✅ة...');
    const currentDate = new Date();

    await User.updateMany(
      {
        'subscription.endDate': { $lt: currentDate },
        'subscription.status': 'active',
      },
      { $set: { 'subscription.status': 'inactive' } }
    );
    console.log('🛠️ تم تحديث حالة الاشتراكات.');
  });
};

module.exports = { checkExpiredSubscriptions };
    
const express = require('express');
const { validateRegister, validateLogin } = require('../middleware/validateUser');
const { registerUser, loginUser, getAllUsers, getUserbyID, updateUserbyID, deleteUserbyID, profile, getProfile, updateProfile, changePassword, sendVerifayOtp, verifyEmail } = require('../controller/user.controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');



const router = express.Router();

router.route('/').get(authenticate,authorize(["admin"]) ,getAllUsers)
router.route('/register').post(validateRegister , registerUser) // done
router.route('/login').post(validateLogin , loginUser) // done
router.route('/profile').get(authenticate , getProfile).put(authenticate , updateProfile) // done
router.route('/changePassword').put(authenticate , changePassword) // done
router.route('/:userID').get(getUserbyID).patch(updateUserbyID).delete(deleteUserbyID) // done
router.route('/send-verifay-otp').post(authenticate , sendVerifayOtp) // done
router.route('/verify-email').post(authenticate , verifyEmail) // done


module.exports = router;
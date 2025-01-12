const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../module/user.model");
const asyncWraper = require('../middleware/asyncWraper');
const { response } = require('express');
const { sendMail } = require('../config/nodeMailer');



// Register User
const registerUser = asyncWraper ( async (req , res ) => {
    const { name, email, password , role } = req.body;

    // check if inputs are valid before creating user
    if(!name ||!email ||!password ) {
        return res.status(400).json({  message: 'Name, email, and password are required.' });
    }

    // check if user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user 
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role : role || 'owner',
        subscription : {
            plan : 'free',
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days free
            status: 'active',
            amountPaid: 0,
        }
    })
    
    // save the user
    await newUser.save();

    // generate and send jwt token
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET);

    
    if(newUser.isAcountVerified) {
        return res.status(200).json({ message: 'Verification code has already been sent.' });
    }

    // genarte otp 
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    
    // save otp and expireAt in db
    newUser.verifyOtp = otp;
    newUser.verifyOtpExpireAt = verifyOtpExpireAt;

    await newUser.save();
    
    // send verification email
    sendMail({to : email, subject : 'Verify your email address' , message :  `Welcom to Deino, your acount has been created white email id: ${email} and verification code is ${otp}`})
    
    // send response and token
    res.json({
        message: 'User registered successfully.',
        user: newUser,
        token
    });
})

// login user 
const loginUser = asyncWraper (async (req , res , next ) => {
    const { email, password } = req.body;

    // check if inputs are valid
    if(!email ||!password ) {
        return res.status(400).json({  message: 'Email and password are required.' });
    }

    // find user by email
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // generate and send jwt token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);

    

    // send response and token
    res.json({
        message: 'User logged in successfully.',
        user,
        token
    });
})


const sendVerifayOtp = asyncWraper (async (req , res ) => {

    const userId = req.user.id
    console.log(`User ${userId}`);

    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if(user.isAcountVerified) {
        return res.status(200).json({ message: 'Verification code has already been sent.' });
    }

    //genarte otp code
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    
    // save otp code to user
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    //send otp code to user email
    sendMail({to : user.email, subject : 'Verify your email address' , message :  `Welcom to Deino, your acount has been created white email id: ${user.email} and verification code is ${otp}`})

    res.json({statuS : 'SUCCESS' , message: 'Verification code has been sent.' });
})

const verifyEmail = asyncWraper (async (req, res) => {

    const userId = req.user.id
    const { otp } = req.body

    if(!userId || !otp) {
        return res.status(400).json({statu : 'ERROR' ,message: 'OTP and User ID are required.' });
    } 
    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({ status: 'ERROR' , message: 'User not found.' });
    }

    if(user.verifyOtp!== otp || user.verifyOtp === '') {
        return res.status(401).json({ status: 'ERROR' , message: 'Invalid OTP' });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
        return res.status(401).json({ status: 'ERROR' , message: 'OTP Expired.' });
    }

    user.isAcountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    res.json({ status: 'SUCCESS', message: 'Email verified successfully.' });
})
// get all users
const getAllUsers = asyncWraper (async (req, res) => {
    const users = await User.find({} , {__v : false});
    res.json({ status: "SUCCESS", data: { users: users } });
})


// sned rest otp
const sendResetOtp = asyncWraper (async (req, res) => {
    const userId = req.user.id
    const { email } = req.body

    if(!email) {
        return res.status(400).json({status : "ERROR", message: 'Email is required.' });
    }

    const user = await User.findOne({ email });

    if(!user) {
        return res.status(404).json({ status: "ERROR", message: 'Email not found.' });
    }

    // genarte otp code
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    
    // save otp code to user
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    //send otp code to user email
    sendMail({to : email, subject : 'Reset your password' , message :  `Your reset password code is: ${otp}`})

    res.json({ status: "SUCCESS", message: 'Reset OTP has been sent.' });
})


// reset user password

const resetPassword = asyncWraper (async (req, res) => {
    const userId = req.user.id
    const { otp, newPassword , email } = req.body

    if(!otp || !newPassword || !email) {
        return res.status(400).json({ status : "ERROR", message: 'OTP, Password and Email are required.' });
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({ status: "ERROR", message: 'Email not found.' });
    }
    if(user.resetOtp!== otp || user.resetOtp === '') {
        return res.status(401).json({ status: "ERROR", message: 'Invalid OTP' });
    }
    if (user.resetOtpExpireAt < Date.now()) {
        return res.status(401).json({ status: "ERROR", message: 'OTP Expired.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({ status: "SUCCESS", message: 'Password has been reset successfully.' });
})

// get user by id 
const getUserbyID = asyncWraper (async (req, res) => {
    const user = await User.findById(req.params.userID, {__v : false});
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ status: "SUCCESS", data: { user: user } });
})

// update user by id
const updateUserbyID = asyncWraper (async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.userID, req.body, { new: true, runValidators: true, context: 'query' });
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ status: "SUCCESS", data: { user: user } });
})

// get profile by user 
const getProfile = asyncWraper (async (req , res) => {
    const user = await User.findById(req.user.id, {__v : false});
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ status: "SUCCESS", data: { user: user } });
})

// update profile by user 
 const updateProfile = asyncWraper (async (req, res) => {
    const {email , name} = req.body;
    // check if inputs are valid before updating user
    if (email === '' || name === '') {
        return res.status(400).json({ message: "Email and name cannot be empty or just spaces." });
    }

    const user = await User.findByIdAndUpdate(req.user.id, {email, name}, { new: true, runValidators: true, context: 'query' });
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ status: "SUCCESS", data: { user: user } });
})

// change password 
 const changePassword = asyncWraper (async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        res.status(401).json({message : 'olde password and new password is required'})
    }
    const user = await User.findById(req.user.id);

    // check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) {
        return res.status(401).json({ message: 'Password is Not Valid.' });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    user.password = hashedPassword;
    await user.save();

    res.json({ status: "SUCCESS", message: 'Password updated successfully.' });
})

// delete user by id
 const deleteUserbyID = asyncWraper (async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userID);
    if(!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ status: "SUCCESS", message: 'User deleted successfully.' });
})

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserbyID,
    updateUserbyID,
    deleteUserbyID,
    getProfile,
    updateProfile,
    changePassword,
    sendVerifayOtp,
    verifyEmail
}
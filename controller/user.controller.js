const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../module/user.model");
const asyncWraper = require('../middleware/asyncWraper');
const { response } = require('express');


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

// get all users
const getAllUsers = asyncWraper (async (req, res) => {
    const users = await User.find({} , {__v : false});
    res.json({ status: "SUCCESS", data: { users: users } });
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
}
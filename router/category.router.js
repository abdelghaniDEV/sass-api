const express = require('express');
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require('../controller/category.controller');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();



router.route('/').post(authenticate,createCategory).get(authenticate , getAllCategories)
router.route('/:categoryID').delete(authenticate , deleteCategory).put(authenticate , updateCategory)

module.exports = router;
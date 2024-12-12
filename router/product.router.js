const express = require('express');
const { createProduct, getAllProducts, updateProduct, deleteProduct, updateProductByToken, deleteProductByToken, createProductByToken } = require('../controller/product.controller');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { validateProduct } = require('../middleware/validateUser');
const { authenticate } = require('../middleware/authMiddleware');


const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'products',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    }
})

const upload = multer({storage : storage})


router.route('/').post(upload.single('image'), validateProduct ,createProduct).get(getAllProducts)
router.route('/owner').post(authenticate , upload.single('image') , createProductByToken)
router.route('/:productID').patch(upload.single('image') ,updateProduct).delete(deleteProduct)
router.route('/owner/:productID').patch(authenticate ,upload.single('image'), updateProductByToken).delete(authenticate , deleteProductByToken)


module.exports = router;    
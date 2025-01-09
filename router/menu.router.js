const express = require('express');
const { createMenu, getAllMenus, updateMenu, deleteMenu, getSingleMenu, getMenusByRestaurantId, getTargetMenu, deleteMenusByRestaurantId, updateMenusByRestaurantId } = require('../controller/menu.controller');
const { authenticate } = require('../middleware/authMiddleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')
const multer = require('multer')

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        folder: 'restaurants',
        allowedFormats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

const upload = multer({ storage: storage })


router.route('/').post(createMenu).get(getAllMenus) // done
router.route('/my-menus').get(authenticate,getMenusByRestaurantId); // done
router.route('/owner/:menuID').delete(authenticate , deleteMenusByRestaurantId).put(authenticate  , upload.single('banner') , updateMenusByRestaurantId);  // done
router.route('/:menuID').patch(updateMenu).delete(deleteMenu).get(getSingleMenu) // done



module.exports = router;
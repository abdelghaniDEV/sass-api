const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')
const multer = require('multer')

const {createRestaurant, getAllRestaurants, deleteRestaurant, updateRestaurant, getRestaurantsByUser, updateRestaurantByUser, createRestaurantByToken} = require("../controller/restaurant.controller");
const { authenticate } = require('../middleware/authMiddleware');



const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        folder: 'restaurants',
        allowedFormats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.route('/').post(authenticate , upload.single('image') ,createRestaurant).get(getAllRestaurants) // done
router.route('/:restaurantID').delete(deleteRestaurant).patch(upload.single('image') ,updateRestaurant) // done
router.route('/my-restaurant').get(authenticate ,getRestaurantsByUser).put(authenticate , upload.single('image') , updateRestaurantByUser).post(authenticate , upload.single('image') , createRestaurantByToken )// done

module.exports = router
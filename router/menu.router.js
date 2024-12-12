const express = require('express');
const { createMenu, getAllMenus, updateMenu, deleteMenu, getSingleMenu, getMenusByRestaurantId, getTargetMenu, deleteMenusByRestaurantId, updateMenusByRestaurantId } = require('../controller/menu.controller');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();


router.route('/').post(createMenu).get(getAllMenus) // done
router.route('/my-menus').get(authenticate,getMenusByRestaurantId); // done
router.route('/owner/:menuID').delete(authenticate , deleteMenusByRestaurantId).put(authenticate , updateMenusByRestaurantId);  // done
router.route('/:menuID').patch(updateMenu).delete(deleteMenu).get(getSingleMenu) // done



module.exports = router;
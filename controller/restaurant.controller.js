const User = require("../module/user.model");
const Restaurant = require("../module/restaurant.model");
const asyncWraper = require("../middleware/asyncWraper");
const menuModel = require("../module/menu.model");

// create a new restaurant
const createRestaurant = asyncWraper(async (req, res) => {
  const { name, address, phone, description , location } = req.body;

  const ownerId = req.user.id; // assuming req.user contains user's id

  const newRestaurant = new Restaurant({
    name,
    address,
    phone,
    description,
    ownerId,
    location,
  });

  console.log(req.file);

  // add image to the restaurant 
  if(req.file){
    newRestaurant.image = req.file.path;
  }
  
  // save the restaurant to the database
  await newRestaurant.save();
  res.json({
    message: "Restaurant created successfully.",
    data: { restaurant: newRestaurant },
  });
});

// get all restaurants
const getAllRestaurants = asyncWraper(async (req, res) => {
  const restaurants = await Restaurant.find({}, { __v: false }).populate(
    "ownerId"
  );
  res.json({ status: "SUCCESS", data: { restaurants } });
});

// delete restaurant
const deleteRestaurant = asyncWraper(async (req, res) => {
    const prams = req.params.restaurantID
    const restaurant = await Restaurant.findByIdAndDelete(prams);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({status : 'SUCCESS' , message: "Restaurant deleted successfully." });

    // delete the restaurant from the database

})

// create a new restaurant by user 
const createRestaurantByToken = asyncWraper(async (req , res) => {

  console.log(req.body)

  const {name} = req.body
  const ownerId = req.user.id;

  console.log(ownerId)

  if(!name|| name === "") return res.status(404).json({message : "name is required"})

  const user = await User.findOne({_id : ownerId})

  if(!user) return res.status(404).json({ message : 'User not found' });

  const findRestuarant = await Restaurant.findOne({ ownerId : ownerId})
  if(findRestuarant) return res.status(404).json({ message : 'Restaurant already exists for this user' });
  const newRestaurant = new Restaurant({
    ...req.body,
    ownerId,
  })
  if(req.file) {
    newRestaurant.image = req.file.path;
  }
  await newRestaurant.save();
  await User.findByIdAndUpdate(ownerId , {$set : {isInfoAvailable : true}})
  const newMenu = new menuModel({
    restaurantId : newRestaurant._id,
    name : newRestaurant.name,
  })
  await newMenu.save();
  res.json({ status : 'SUCCESS', message: "Restaurant created successfully.", data: { restaurant: newRestaurant } });
})

// update the restaurant    
const updateRestaurant = asyncWraper (async (req , res) => {
    const updateData = req.body
    const prams = req.params.restaurantID
    if(req.file) {
        updateData.image = req.file.path;
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(prams, {$set : updateData }, { new: true });
    if (!updatedRestaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json({ status : 'SUCCESS', message: "Restaurant updated successfully.", data: { restaurant: updatedRestaurant } });
}) 

const getRestaurantsByUser = async (req, res) => {
    try {
      const ownerId = req.user.id; //
  
      const restaurants = await Restaurant.findOne({ ownerId }).populate('ownerId');
      res.status(200).json({status: 'success' ,  data : restaurants});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching restaurants', error });
    }
  };

// update restaurant by user 
const updateRestaurantByUser = asyncWraper (async (req , res) => {
  const ownerId = req.user.id;
  const restaurant = await Restaurant.findOne({ownerId})
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  const updateData = req.body
  if(req.file) {
    updateData.image = req.file.path;
  }
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurant._id, {$set : updateData }, { new: true });
  res.json({ status : 'SUCCESS', message: "Restaurant updated successfully.", data: { restaurant: updatedRestaurant } });
})

  
module.exports = {
  createRestaurant,
  getAllRestaurants,
  deleteRestaurant,
  updateRestaurant,
  getRestaurantsByUser,
  updateRestaurantByUser,
  createRestaurantByToken,  // new function to create restaurant by user
};

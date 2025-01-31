const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config()
const app = express()
const cron = require('node-cron');

const PORT = process.env.PORT || 4000;

connectDB();

// Middleware
app.use(express.json())
app.use(cors())
// app.use(cors({ origin: 'http://localhost:3000' }));

// routers
const usersRouter = require ('./router/user.router.js')
const restaurantRouter = require ('./router/restaurant.router.js')
const menuRouter = require('./router/menu.router.js')
const productRouter = require('./router/product.router.js')
const categoryRouter = require("./router/category.router.js");
const { checkExpiredSubscriptions } = require('./cron/subscriptionCron.js');



app.use("/api/users" ,  usersRouter)
app.use("/api/restaurants" , restaurantRouter )
app.use("/api/menus" , menuRouter)
app.use("/api/products" , productRouter)
app.use("/api/categories" , categoryRouter)





app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})
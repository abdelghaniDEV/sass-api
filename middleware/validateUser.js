const {body , validationResult} = require("express-validator")


const validateRegister  = [
    // check name 
    body('name')
       .notEmpty()
       .withMessage('Name is required'),
    
    // check email
    body('email')
       .notEmpty()
       .withMessage('Email is required')
       .isEmail()
       .withMessage('Please enter a valid email'),
    
       // check password
       body('password')
       .notEmpty()
       .withMessage('Password is required')
       .isLength({ min: 6 })
       .withMessage('Password must be at least 6 characters long'),
       
    (req , res , next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

const validateLogin = [
    // check email
    body('email')
       .notEmpty()
       .withMessage('Email is required')
       .isEmail()
       .withMessage('Please enter a valid email'),
       
    // check password
    body('password')
       .notEmpty()
       .withMessage('Password is required'),
       
    (req , res , next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

const validateRestaurant = [
    // check owner ID   
    body('ownerId').notEmpty().withMessage('Owner ID is required'),
    body('name').notEmpty().withMessage('Name is required'),

    (req , res , next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

const validateProduct = [
    // check restaurant ID
    body('menuId').notEmpty().withMessage('Menu ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required'),

    (req , res , next) => {
        console.log(req.body);
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]


module.exports = {
    validateRegister,
    validateLogin,
    validateRestaurant,
    validateProduct,
 
}
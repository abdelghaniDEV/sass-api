const jwt = require ("jsonwebtoken")
const User = require ("../module/user.model.js")

// verify that the token is valid for the given user account
const authenticate = (req , res , next) => {
    const token = req.header("Authorization")?.replace('Bearer ' , '');
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
}

// middleware to check if the user has the required role for the given route
const authorize = (roles) => async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized." });
    }
    next();
}

module.exports = { authenticate, authorize }
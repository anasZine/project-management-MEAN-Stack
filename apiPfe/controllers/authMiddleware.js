const Menu = require("../models/menu.model");
const User = require("../models/user.model");
const Profil = require("../models/profil.model"); // Import the Profil model
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/gestionProjet';


mongoose.connect(url);
// Get the default connection
const db = mongoose.connection;

// Event listener for successful connection
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Event listener for connection errors
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
// Middleware to check if the client is connected
exports.checkConnectionMiddleware = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        // Connection is not established
        return res.status(500).json({ error: 'Database connection error' });
    }
    // Connection is established, proceed to the next middleware
    next();
};
exports.accessControlMiddleware = async(req, res, next) => {
    await mongoose.connect(url);

    // Log the values of req.params.id and req.routeFunction
    console.log("req.params.id:", req.params.userId);
    console.log("req.routeFunction:", req.routeFunction);


    mongoose.connect(url);
    
   

    const userId = req.params.userId;
    if (!userId) {
        return res.status(401).json({ error: "User ID is missing" });
    }
    // Find the user by ID in the database
    mongoose.connect(url);

    User.findById(userId)
        .then(user => {
            if (!user) {

                return res.status(404).json({ error: "User not found" });
            }

            // Check if the user's profile ID exists
            if (!user.profil_id) {

                return res.status(401).json({ error: "User profile ID is missing" });
            }

            // Proceed to fetch the profile based on the user's profile ID
    mongoose.connect(url);

            return Profil.findById(user.profil_id);
        })
        .then(profil => {
            if (!profil) {

                console.log("Profile not found");
                return res.status(403).json({ error: "Access denied. Profile not found" });
            }
    mongoose.connect(url);
            
            const menuId = profil.menu_id;

            // Fetch the menu based on the profile's menu_id
            return Menu.findById(menuId);
        })
        .then(menu => {
            if (!menu) {

                console.log("Menu not found");
                return res.status(403).json({ error: "Access denied. Menu not found" });
            }

            console.log("Menu:", menu); // Log the menu object

            // Assuming req.routeFunction contains the function name you want to check
            const functionName = req.routeFunction;
            const hasPermission = menu[functionName]; // Check if the function is enabled in the menu

            if (!hasPermission) {
                console.log("Permission Denied");

                return res.status(403).json({ error: "Access denied. Function disabled in menu" });
            }

            console.log("Permission Granted");


            next(); // Function enabled, proceed to the route handler
        })
        .catch(err => {
            console.error("Error:", err);

            res.status(600).json({ error: err.message });
        });
};

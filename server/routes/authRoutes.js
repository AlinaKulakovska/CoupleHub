const express = require("express");
const router = express.Router(); // 👉 This creates the missing 'router' variable

// Import your register controller (make sure this path correctly points to your controller file)
const registerController = require("../controllers/RegisterController"); 
const loginController = require("../controllers/LoginController"); // Import your login controller

// Your route definition now works perfectly
router.post('/register', registerController.register);
router.post('/login', loginController.login);

// 👉 Don't forget to export it so server.js can read it!
module.exports = router;
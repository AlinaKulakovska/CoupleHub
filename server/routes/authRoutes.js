const express = require("express");
const router = express.Router(); 

// Import your controllers
const registerController = require("../controllers/RegisterController"); 
const loginController = require("../controllers/LoginController"); 

// Route definitions
router.post('/register', registerController.register);
router.post('/login', loginController.login);

// 👉 ADD THIS: Route for checking if the partner has joined yet
router.post('/check-status', loginController.checkStatus);

module.exports = router;
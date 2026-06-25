// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    // 👉 Point to the shared Couple collection instead of another User
    couple: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Couple", 
        default: null 
    }
});

module.exports = mongoose.model("User", UserSchema);
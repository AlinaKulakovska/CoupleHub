const mongoose = require("mongoose");

const truthDareSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ["truth", "care"], // stored internally as care/truth, maps to Truth/Dare
        required: true 
    },
    category: { 
        type: String,  
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("TruthDare", truthDareSchema);
const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema({

    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    anniversaryDate: Date

});

module.exports = mongoose.model("Couple", coupleSchema);
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    month: Number,
    year: Number
});

module.exports = mongoose.model("Budget", budgetSchema);

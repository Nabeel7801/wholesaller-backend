const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    parent: { type: String, required: false },
    image: { type: String, required: false },
    title: { type: String, required: false },
});

const Categories = mongoose.model("categories", categoriesSchema)

module.exports = Categories
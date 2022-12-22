const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    parent: { type: String, required: false },
    image: { type: String, required: false },
    title: { type: String, required: false },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Categories = mongoose.model("categories", categoriesSchema)

module.exports = Categories
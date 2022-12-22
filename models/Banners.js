const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    reference: { type: String, required: false },
    title: { type: String, required: false },
    categories: { type: Array, required: false },
    redirect_categories: { type: Array, required: false },
    image: { type: String, required: false },
    Link: { type: String, required: false },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Banners = mongoose.model("banners", bannerSchema)

module.exports = Banners
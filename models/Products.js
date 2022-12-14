const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    hsn_code: { type: String, required: false},
    reference: { type: String, required: false },
    cost_price: { type: Number, required: false },
    tags: { type: Array, required: false },
    price: { type: Number, required: false },
    tax_rate: { type: Number, required: false},
    main_category: { type: String, required: false },
    sub_category: { type: String, required: false },
    child_category: { type: String, required: false },
    image: { type: String, required: false },
    description: { type: String, required: false }
});

const Products = mongoose.model("products", productsSchema)

module.exports = Products
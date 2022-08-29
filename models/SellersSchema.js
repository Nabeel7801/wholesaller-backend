const mongoose = require("mongoose");

const sellersSchema = new mongoose.Schema({
    identity: { type: String, required: false },
    name: { type: String, required: false },
    business_type: { type: String, required: false },
    category: { type: String, required: false },
    sub_category: { type: String, required: false },
    cities: { type: Array, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    zipcodes: {type: Array, required: false},
    token: { type: String, required: false },
});

const Sellers = mongoose.model("sellers", sellersSchema)

module.exports = Sellers
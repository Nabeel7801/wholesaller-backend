const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: Object, required: false },
    zipcode: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false }
});

const Customers = mongoose.model("customers", customersSchema)

module.exports = Customers
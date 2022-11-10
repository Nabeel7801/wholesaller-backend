const mongoose = require("mongoose");

const warehousesSchema = new mongoose.Schema({
    identity: { type: String, required: false },
    name: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    zipcodes: {type: Array, required: false},
    token: { type: String, required: false },
});

const Warehouses = mongoose.model("warehouses", warehousesSchema)

module.exports = Warehouses
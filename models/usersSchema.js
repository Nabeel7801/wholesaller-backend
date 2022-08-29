const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    outlet_name: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    pincode: { type: String, required: false },
    referral: { type: String, required: false },
    status: { type: String, required: false },
    document: { type: mongoose.Schema.Types.ObjectId, required: false },
    token: { type: String, required: false },
});

const Users = mongoose.model("users", usersSchema)

module.exports = Users
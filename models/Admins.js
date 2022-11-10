const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema({
    name: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    token: { type: String, required: false },
});

const Admins = mongoose.model("admins", adminsSchema)

module.exports = Admins
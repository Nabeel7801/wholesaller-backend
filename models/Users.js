const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
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
    document: { type: mongoose.Schema.Types.ObjectId, required: false }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
  
UserSchema.methods.matchPassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};
  
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};
  
const Users = mongoose.model("users", UserSchema)

module.exports = Users
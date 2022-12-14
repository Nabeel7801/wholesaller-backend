const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    outlet_name: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: Object, required: false },
    pincode: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Customers = mongoose.model("customers", customersSchema)

module.exports = Customers
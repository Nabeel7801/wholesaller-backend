const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    reference: { type: String, required: false },
    date: { type: String, required: false },
    user_id: { type: String, required: false },
    customer_id: { type: String, required: false },
    dealer_type: { type: String, required: false },
    dealer_id: { type: String, required: false},
    basket: { type: Array, required: false },
    delivery_fees: { type: Number, required: false },
    total: { type: Number, required: false },
    status: { type: String, required: false },
    returned: { type: Boolean, required: false },
    delivered_at: {type: String, required: false }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Orders = mongoose.model("orders", ordersSchema)

module.exports = Orders
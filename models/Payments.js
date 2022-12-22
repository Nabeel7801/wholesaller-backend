const mongoose = require("mongoose");

const paymentsSchema = new mongoose.Schema({
    customer_id: { type: String, required: false},
    invoice_id: { type: String, required: false},
    reference: { type: String, required: false },
    date: { type: String, required: false },
    amount: { type: Number, required: false},
    bank_charges: {type: Number, required: false},
    payment_mode: { type: String, required: false},
    deposited_to: { type: String, required: false},
    reference_number: { type: String, required: false},
    notes: { type: String, required: false},
    type: { type: String, required: false},
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Payments = mongoose.model("payments", paymentsSchema)

module.exports = Payments
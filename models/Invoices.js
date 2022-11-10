const mongoose = require("mongoose");

const invoicesSchema = new mongoose.Schema({
    reference: { type: String, required: false },
    date: { type: String, required: false },
    customer_id: { type: String, required: false },
    order_id: { type: String, required: false },
    due_date: { type: String, required: false },
    status: { type: String, required: false},
    amount: { type: Number, required: false},
    delivery_fees: { type: Number, required: false},
    balance_due: { type: Number, required: false },
});

const Invoices = mongoose.model("invoices", invoicesSchema)

module.exports = Invoices
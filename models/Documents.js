const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema({
    document: { type: String, required: false },
    type: { type: String, required: false },
    status: { type: String, required: false },
    upload_time: { type: String, required: false },
});

const Documents = mongoose.model("documents", documentsSchema)

module.exports = Documents
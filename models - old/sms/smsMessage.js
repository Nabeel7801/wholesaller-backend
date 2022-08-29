const mongoose = require('mongoose');

const smsMessage = new mongoose.Schema({
  Body: { type: String },
  From: { type: String },
  ApiResponse: {
    type: Object,
  },
});

module.exports = mongoose.model('smsMessage', smsMessage);

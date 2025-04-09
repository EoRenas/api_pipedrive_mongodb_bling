const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  value: { type: Number, required: true },
  title: { type: String, required: true },
  client: { type: String, required: true }
});

module.exports = mongoose.model('Order', OrderSchema);

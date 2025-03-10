const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  info: { type: String, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);

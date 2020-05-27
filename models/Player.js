const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    phoneNumber: String,
    email: String,
    addressOne: String,
    addressTwo: String,
    postcode: String,
    position: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    photo: String,
    information: String
});

module.exports = mongoose.model('Players', playerSchema);

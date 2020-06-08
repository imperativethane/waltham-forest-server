const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
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
    information: String,
    emergencyContact: {
        type: Schema.Types.ObjectId,
        ref: 'EmergencyContact'
    },
    honours: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Honour'
        }
    ]
});

module.exports = mongoose.model('Player', playerSchema);

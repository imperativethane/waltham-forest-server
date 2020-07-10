const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    firstName: {
      type: String,
      required: true
    },
    surname: {
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
        required: true,
        default: true
    },
    photo: String,
    information: String,
    emergencyContact: {
        firstName: String,
        surname: String,
        relationship: String,
        phoneNumber: String
    },
    honours: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Honour'
        }
    ],
    awards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Award'
        }
    ], 
    appearances: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Appearance'
        }
    ]
});

module.exports = mongoose.model('Player', playerSchema);

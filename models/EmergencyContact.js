const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emergencyContactSchema = new Schema({ 
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
         required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    relationship: String

});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
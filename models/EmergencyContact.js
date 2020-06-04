const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emergencyContactSchema = new Schema({ 
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    relationship: String,
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }

});

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
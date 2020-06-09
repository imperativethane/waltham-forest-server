const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const awardsSchema = new Schema({ 
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    award: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Award', awardsSchema);
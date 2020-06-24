const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appearanceSchema = new Schema({
    leagueResult: {
        type: Schema.Types.ObjectId,
        ref: 'LeagueResults',
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    starter: {
        type: Boolean,
        default: false
    },
    substitute: {
        type: Boolean,
        default: false
    },
    goalsScored: {
        type: Number,
        default: 0
    },
    assists: {
        type: Number,
        default: 0
    },
    yellowCard: {
        type: Boolean,
        default: false
    },
    redCard: {
        type: Boolean,
        default: false
    },
    penaltyScored: {
        type: Number,
        default: 0
    },
    penaltyMissed: {
        type: Number,
        default: 0
    },
    penaltyConceded: {
        type: Number,
        default: 0
    },
    manOfTheMatch: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Appearance', appearanceSchema);
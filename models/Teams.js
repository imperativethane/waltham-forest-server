const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gamesPlayed: {
        type: Number,
        required: true,
        default: 0
    },
    gamesWon: {
        type: Number,
        required: true,
        default: 0
    },
    gamesDraw: {
        type: Number,
        required: true,
        default: 0
    },
    gamesLost: {
        type: Number,
        required: true,
        default: 0
    },
    goalsScored: {
        type: Number,
        required: true,
        default: 0
    },
    goalsAgainst: {
        type: Number,
        required: true,
        default: 0
    },
    goalDifference: {
        type: Number,
        required: true,
        default: 0
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    leagueResults: [
        {
            type: Schema.Types.ObjectId,
            ref: 'LeagueResult'
        }
    ]
});

module.exports = mongoose.model('Team', teamSchema);

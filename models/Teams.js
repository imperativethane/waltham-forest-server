const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gamesPlayed: {
        type: Number,
        required: true
    },
    gamesWon: {
        type: Number,
        required: true
    },
    gamesDraw: {
        type: Number,
        required: true
    },
    gamesLost: {
        type: Number,
        required: true
    },
    goalsScored: {
        type: Number,
        required: true
    },
    goalsAgainst: {
        type: Number,
        required: true
    },
    goalDifference: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    leagueResults: [
        {
            type: Schema.Types.ObjectId,
            ref: 'LeagueResult'
        }
    ]
});

module.exports = mongoose.model('Team', teamSchema);

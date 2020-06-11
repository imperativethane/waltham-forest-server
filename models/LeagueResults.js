const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leagueResultSchema = new Schema({
    homeTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    homeScore: {
        type: Number,
        required: true
    },
    awayTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    awayScore: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('LeagueResult', leagueResultSchema);
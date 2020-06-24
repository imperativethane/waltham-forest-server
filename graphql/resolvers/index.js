const playerResolver = require('./players');
const emergencyContactResolver = require('./emergencyContact');
const honoursResolver = require('./honours');
const awardsResolver = require('./awards');
const teamsResolver = require('./teams');
const leagueResultsResolver = require('./leagueResults');
const appearancesResolver = require('./appearances');

const rootResolver = {
    ...playerResolver,
    ...emergencyContactResolver,
    ...honoursResolver,
    ...awardsResolver,
    ...teamsResolver,
    ...leagueResultsResolver,
    ...appearancesResolver
};

module.exports = rootResolver;
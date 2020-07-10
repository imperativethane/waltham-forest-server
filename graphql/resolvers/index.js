const playerResolver = require('./players');
const honoursResolver = require('./honours');
const awardsResolver = require('./awards');
const teamsResolver = require('./teams');
const leagueResultsResolver = require('./leagueResults');
const appearancesResolver = require('./appearances');

const rootResolver = {
    ...playerResolver,
    ...honoursResolver,
    ...awardsResolver,
    ...teamsResolver,
    ...leagueResultsResolver,
    ...appearancesResolver
};

module.exports = rootResolver;
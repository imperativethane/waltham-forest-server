const playerResolver = require('./players');
const emergencyContactResolver = require('./emergencyContact');
const honoursResolver = require('./honours');
const awardsResolver = require('./awards');

const rootResolver = {
    ...playerResolver,
    ...emergencyContactResolver,
    ...honoursResolver,
    ...awardsResolver
};

module.exports = rootResolver;
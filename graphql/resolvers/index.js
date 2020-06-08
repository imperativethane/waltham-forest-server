const playerResolver = require('./players');
const emergencyContactResolver = require('./emergencyContact');
const honoursResolver = require('./honours');

const rootResolver = {
    ...playerResolver,
    ...emergencyContactResolver,
    ...honoursResolver
};

module.exports = rootResolver;
const playerResolver = require('./players');
const emergencyContactResolver = require('./emergencyContact');

const rootResolver = {
    ...playerResolver,
    ...emergencyContactResolver
};

module.exports = rootResolver;
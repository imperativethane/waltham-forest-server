const mongoose = require('mongoose');
const Player = require('../../models/Player');
const EmergencyContact = require('../../models/EmergencyContact');

const player = async playerId => {
    try {
        const player = await Player.findById(playerId)
        return {
            ...player._doc,      
        };
    } catch (err) {
        throw err;
    }
};

const runInTransaction = async (mutations) => {
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        const value = await mutations(session);
        await session.commitTransaction();
        return value;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    };
};

exports.player = player;
exports.runInTransaction = runInTransaction;
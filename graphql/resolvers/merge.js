const mongoose = require('mongoose');
const Player = require('../../models/Player');
const EmergencyContact = require('../../models/EmergencyContact');
const Award = require('../../models/Awards');
const Honour = require('../../models/Honours');

const transformData = result => {
    return {
        ...result._doc,
        player: player.bind(this, result._doc.player)
    };
};

const checkPlayer = async playerId => {
    const checkPlayer = await Player.findById(playerId);
    if (!checkPlayer) {
        throw new Error('Player does not exist on the database')
    };
    return checkPlayer
};

const awards = async awardIds => {
    try {
        const awards = await Award.find({_id: {$in: awardIds}});
        return awards.map(award => {
            return transformData(award)
        });
    } catch (err) {
        throw err;
    };
};

const honours = async honourIds => {
    try {
        const honours = await Honour.find({_id: {$in: honourIds}});
        return honours.map(honour => {
            return transformData(honour)
        });
    } catch (err) {
        throw err;
    };
};

const emergencyContact = async emergencyContactId => {
    try {
        const emergencyContact = await EmergencyContact.findById(emergencyContactId);
        return transformData(emergencyContact);
    } catch (err) {
        throw err;
    };
};

const player = async playerId => {
    try {
        const player = await Player.findById(playerId);
        return {
            ...player._doc,
            awards: awards.bind(this, player._doc.awards),
            honours: honours.bind(this, player._doc.honours),
            emergencyContact: emergencyContact.bind(this, player._doc.emergencyContact)
        };
    } catch (err) {
        throw err;
    };
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

exports.checkPlayer = checkPlayer;
exports.transformData = transformData;
exports.player = player;
exports.runInTransaction = runInTransaction;
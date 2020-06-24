const mongoose = require('mongoose');
const Player = require('../../models/Player');
const EmergencyContact = require('../../models/EmergencyContact');
const Award = require('../../models/Awards');
const Honour = require('../../models/Honours');
const LeagueResult = require('../../models/LeagueResults');
const Team = require('../../models/Teams');

const { dateToString } = require('../../helpers/date');

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

const checkPlayer = async playerId => {
    const checkPlayer = await Player.findById(playerId);
    if (!checkPlayer) {
        throw new Error('Player does not exist on the database')
    };
    return checkPlayer
};

const transformPlayerData = async player => {
    return {
        ...player._doc,
        awards: awards.bind(this, player._doc.awards),
        honours: honours.bind(this, player._doc.honours),
        emergencyContact: emergencyContact.bind(this, player._doc.emergencyContact)
    }
}

const player = async playerId => {
    try {
        const player = await Player.findById(playerId);
        return transformPlayerData(player);
    } catch (err) {
        throw err;
    };
};

const players = async playerIds => {
    try {
        const players = await Player.find({_id: {$in: playerIds}});
        return players.map(player => {
            return transformPlayerData(player)
        });
    } catch (err) {
        throw err;
    };
};

const transformData = result => {
    return {
        ...result._doc,
        player: player.bind(this, result._doc.player)
    };
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

const checkLeagueResult = async leagueResultId => {
    const checkLeagueResult = await LeagueResult.findById(leagueResultId);
    if (!checkLeagueResult) {
        throw new Error('This result does not exist in the database');
    };
    return checkLeagueResult;
};
const transformResultData = async leagueResult => {
    const transformData = {
        ...leagueResult._doc,
        homeTeam: team.bind(this, leagueResult._doc.homeTeam),
        awayTeam: team.bind(this, leagueResult._doc.awayTeam),
        date: dateToString(leagueResult._doc.date)
    };
    return transformData;
};

const leagueResult = async leagueResultId => {
    try {
        const leagueResult = await LeagueResult.findById(leagueResultId);
        return transformResultData(leagueResult);
    } catch (err) {
        throw err;
    };
};

const leagueResults = async leagueResultIds => {
    try {
        const leagueResults = await LeagueResult.find({_id: {$in: leagueResultIds}});
        return leagueResults.map(leagueResult => {
            return transformResultData(leagueResult)
        });
    } catch (err) {
        throw err;
    }

};

const checkTeam = async teamId => {
    const checkTeam = await Team.findById(teamId);
    if (!checkTeam) {
        throw new Error('This team does not exist in the database');
    };
    return checkTeam;
};

const transformTeamData = team => {
    return {
        ...team._doc,
        leagueResults: leagueResults.bind(this, team._doc.leagueResults)
    };
};

const team = async teamId => {
    try {
        const team = await Team.findById(teamId);
        return transformTeamData(team);
    } catch (err) {
        throw err;
    }

};

exports.runInTransaction = runInTransaction;

exports.checkPlayer = checkPlayer;
exports.player = player;
exports.transformData = transformData;

exports.checkTeam = checkTeam;
exports.transformTeamData = transformTeamData;
exports.team = team;

exports.checkLeagueResult = checkLeagueResult;
exports.transformResultData = transformResultData;
exports.leagueResult = leagueResult;
exports.leagueResults = leagueResults;


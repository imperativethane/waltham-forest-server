const Team = require('../../models/Teams');
const LeagueResult = require('../../models/LeagueResults');
const mongoose = require('mongoose');

const { transformTeamData, checkTeam } = require('./merge');

module.exports = {
    teams: async () => {
        try {
            const teams = await Team.find();
            return teams.map(team => {
                return transformTeamData(team);
            });
        } catch (err) {
            throw err;
        };
    },
    createTeam: async ({teamInput}) => {
        const checkTeam = await Team.findOne({name: teamInput.name});
        if (checkTeam) {
            throw new Error('This team already exists.')
        };

        const newTeam = new Team({
            name: teamInput.name,
            gamesWon: 0,
            gamesDraw: 0,
            gamesLost: 0,
            gamesPlayed: 0,
            goalsScored: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
        });

        let createdTeam;
        try {
            const result = await newTeam.save();
            createdTeam = {
                ...result._doc
            };
            return createdTeam;
        } catch (err) {
            throw err;
        };
    },
    deleteTeam: async ({teamId}) => {
        if (teamId === '5ee34d1bc2ac4d68d4fb9a58') {
            throw new Error('Cannot delete Waltham Forest Utd from the database');
        };

        const teamToDelete = await Team.findById(teamId);
        if (!teamToDelete) {
            throw new Error('Team does not exist on the database');
        };
        const leagueResults = teamToDelete.leagueResults;
        try {
            LeagueResult.find({_id: {$in: leagueResults}})
            .cursor()
            .eachAsync(async function(leagueResult, i) {
                if(leagueResult.homeTeam === teamToDelete) {
                    const awayTeam = await checkTeam(leagueResult.awayTeam);
                    awayTeam.gamesPlayed -= 1
                    if (leagueResult.homeScore > leagueResult.awayScore) {
                        awayTeam.gamesLost -= 1;
                    } else if (leagueResult.homeScore === leagueResult.awayScore) {
                        awayTeam.gamesDraw -= 1;
                        awayTeam.points -= 1;
                    } else {
                        awayTeam.gamesWon -= 1;
                        awayTeam.points -= 3;
                    };
                    awayTeam.goalsScored -= leagueResult.awayScore;
                    awayTeam.goalsAgainst -= leagueResult.homeScore;
                    awayTeam.goalDifference -= (leagueResult.awayScore - leagueResult.homeScore);
                    
                    const awayTeamIndex = awayTeam.leagueResults.indexOf(leagueResult._id);
                    awayTeam.leagueResults.splice(awayTeamIndex, 1);
                    let session = await mongoose.startSession();
                    session.startTransaction();
                    await awayTeam.save({session: session});
                    await Team.deleteOne({_id: teamToDelete}, {session: session});
                    await session.commitTransaction();
                    session.endSession();
                } else {
                    const homeTeam = await checkTeam(leagueResult.homeTeam);
                    homeTeam.gamesPlayed -= 1
                    if (leagueResult.homeScore > leagueResult.awayScore) {
                        homeTeam.gamesWon -= 1;
                        homeTeam.points -= 3;
                    } else if (leagueResult.homeScore === leagueResult.awayScore) {
                        homeTeam.gamesDraw -= 1;
                        homeTeam.points -= 1;
                    } else {
                        homeTeam.gamesLost -= 1;
                    };
                    homeTeam.goalsScored -= leagueResult.homeScore;
                    homeTeam.goalsAgainst -= leagueResult.awayScore;
                    homeTeam.goalDifference -= (leagueResult.homeScore - leagueResult.awayScore);
                    
                    const homeTeamIndex = homeTeam.leagueResults.indexOf(leagueResult._id);
                    homeTeam.leagueResults.splice(homeTeamIndex, 1);
                    let session = await mongoose.startSession();
                    session.startTransaction();
                    await homeTeam.save({session: session});
                    await Team.deleteOne({_id: teamToDelete}, {session: session});
                    await session.commitTransaction();
                    session.endSession();
                };
            });
            const deletedTeam = transformTeamData(teamToDelete);
            return deletedTeam;
        } catch (err) {
            throw err;
        }
    }
};
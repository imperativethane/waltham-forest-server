const Team = require('../../models/Teams');

const { transformTeamData } = require('./merge');

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
        if (teamId === '5ee0b40e896c9222b86f1454') {
            throw new Error('Cannot delete Waltham Forest from the database');
        };

        const teamToDelete = await Team.findById(teamId);
        if (!teamToDelete) {
            throw new Error('Team does not exist on the database');
        };

        try {
            await Team.findOneAndDelete({_id: teamId});
            return transformTeamData(teamToDelete);
        } catch (err) {
            throw err;
        };
    }
};
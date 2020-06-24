const Appearance = require('../../models/Appearances');
const Player = require('../../models/Player');
const LeagueResults = require('../../models/LeagueResults');

const { checkPlayer, checkLeagueResult, player, leagueResult, runInTransaction, transformAppearanceData, checkAppearance } = require('./merge');

const leagueResultData = (appearance, leagueResultData) => {
    if (leagueResultData === null) {
        return null;
    } else {
        return leagueResult.bind(this, appearance._doc.leagueResult)
    }
}

module.exports = {
    playerAppearances: async ({playerId}) => {
        try {
            checkPlayer(playerId);
            const playerAppearances = await Appearance.find({player: playerId});
            return playerAppearances.map(appearance => {
                return transformAppearanceData(appearance)
            })
        } catch (err) {
            throw err;
        };
    },
    resultAppearances: async ({leagueResultId}) => {
        try {
            checkLeagueResult(leagueResultId);
            const resultAppearances = await Appearance.find({leagueResult: leagueResultId});
            return resultAppearances.map(appearance => {
                return transformAppearanceData(appearance)
            })
        } catch (err) {
            throw err;
        };
    },
    createAppearance: async ({appearanceInput}) => {
        const player = await checkPlayer(appearanceInput.player);
        const leagueResult = await checkLeagueResult(appearanceInput.leagueResult);

        const appearance = new Appearance({
            player: appearanceInput.player,
            leagueResult: appearanceInput.leagueResult,
            starter: appearanceInput.starter,
            substitute: appearanceInput.substitute,
            goalsScored: appearanceInput.goalsScored,
            assists: appearanceInput.assists,
            yellowCard: appearanceInput.yellowCard,
            redCard: appearanceInput.redCard,
            penaltyScored: appearanceInput.penaltyScored,
            penaltyMissed: appearanceInput.penaltyMissed,
            penaltyConceded: appearanceInput.penaltyConceded,
            manOfTheMatch: appearanceInput.manOfTheMatch
        });

        let savedAppearance
        try {
            await runInTransaction(async session => {
                const saveAppearance = await appearance.save({session: session});
                player.appearances.push(appearance);
                await player.save({session: session});
                leagueResult.appearances.push(appearance);
                await leagueResult.save({session: session});
                savedAppearance = transformAppearanceData(saveAppearance);
            });
            return savedAppearance;
        } catch (err) {
            throw err;
        }
    }, 
    updateAppearance: async ({appearanceId, appearanceInput}) => {
        try {
            const appearanceToUpdate = await Appearance.findByIdAndUpdate(appearanceId, {
                starter: appearanceInput.starter || false,
                substitute: appearanceInput.substitute || false,
                goalsScored: appearanceInput.goalsScored || 0,
                assists: appearanceInput.assists || 0, 
                yellowCard: appearanceInput.yellowCard || false,
                redCard: appearanceInput.redCard || false,
                penaltyScored: appearanceInput.penaltyScored || 0,
                penaltyMissed: appearanceInput.penaltyMissed || 0,
                penaltyConceded: appearanceInput.penaltyConceded || 0,
                manOfTheMatch: appearanceInput.manOfTheMatch || false
            }, {
                new: true,
                useFindAndModify: false
            });
            return transformAppearanceData(appearanceToUpdate);
        } catch (err) {
            throw err;
        };
    },
    deleteAppearance: async ({appearanceId}) => {
        const appearance = await checkAppearance(appearanceId);
        console.log(appearance);
        const playerToUpdate = await checkPlayer(appearance.player);
        const leagueResultToUpdate = await LeagueResults.findById(appearance.leagueResult);
        console.log(leagueResultToUpdate);

        let deletedAppearance;
        try {
            await runInTransaction(async session => {
                await Appearance.findByIdAndDelete(appearanceId, {session: session});
                
                const playerIndex = playerToUpdate.appearances.indexOf(appearance._id);
                playerToUpdate.appearances.splice(playerIndex, 1);
                await playerToUpdate.save({session: session});

                if (leagueResultToUpdate) {
                    const leagueResultIndex = leagueResultToUpdate.appearances.indexOf(appearance._id);
                    leagueResultToUpdate.appearances.splice(leagueResultIndex, 1);
                    await leagueResultToUpdate.save({session: session});
                }

                deletedAppearance = {
                    ...appearance._doc,
                    leagueResult: leagueResultData(appearance, leagueResultToUpdate),
                    player: player.bind(this, appearance._doc.player)  
                };
            })
            return deletedAppearance;
        } catch (err) {
            throw err;
        }
    }
};
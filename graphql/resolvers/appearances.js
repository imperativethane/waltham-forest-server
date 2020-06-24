const Appearance = require('../../models/Appearances');
const Player = require('../../models/Player');

const { checkPlayer, checkLeagueResult, player, leagueResult, runInTransaction } = require('./merge');

const transformAppearanceData = async appearance => {
    return {
        ...appearance._doc,
        leagueResult: leagueResult.bind(this, appearance._doc.leagueResult),
        player: player.bind(this, appearance._doc.player)   
    };
};

const checkAppearance = async appearanceId => {
    const appearance = await Appearance.findById(appearanceId);
    if (!appearance) {
        throw new Error('This appearance does not exist on the database.')
    };
    return appearance;
};

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
        //Check if the appearance exists on the database. 
        //If it exists then it needs to be deleted from the appearance collection.
        //It also needs to be removed from the Players.appearances and LeagueResults.appearances arrays.
        const appearanceToDelete = await checkAppearance(appearanceId);
        const player = await checkPlayer(appearanceToDelete.player);
        const leagueResult = await checkLeagueResult(appearanceToDelete.leagueResult);
        try {
            runInTransaction(async session => {
                await Appearance.findByIdAndDelete(appearanceId, {session: session});
                const playerIndex = player.appearances.indexOf(apperanceId);
                player.splice(playerIndex, 1);
                await player.save({session: session});


            })
        } catch (err) {
            throw err;
        }
    }
};
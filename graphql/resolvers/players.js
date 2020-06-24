const Player = require('../../models/Player');
const Appearance = require('../../models/Appearances');
const LeagueResults = require('../../models/LeagueResults');

const { transformPlayerData, runInTransaction, checkPlayer} = require('./merge');

module.exports = {
    players: async () => {
        try {
            const players = await Player.find();
            return players.map(player => {
                return transformPlayerData(player);
            })
        } catch (err) {
            throw err;
        }
    },
    createPlayer: async ({playerInput}) => {
        const player = new Player({
            name: playerInput.name,
            phoneNumber: playerInput.phoneNumber,
            email: playerInput.email,
            addressOne: playerInput.addressOne,
            addressTwo: playerInput.addressTwo,
            postcode: playerInput.postcode,
            position: playerInput.position,
            photo: playerInput.photo,
            information: playerInput.information,
            active: true
        })

        let createdPlayer
        try {
            const result = await player.save();
            createdPlayer = transformPlayerData(result);
            return createdPlayer;
        } catch (err) {
            throw err;
        }
    },
    deletePlayer: async ({playerId}) => {
        const playerToDelete = await checkPlayer(playerId);
        const appearances = playerToDelete.appearances;

        let deletedPlayer
        try {
            await runInTransaction(async session => {
                await Player.deleteOne({_id: playerId}, {session: session});

                await Appearance.find({_id: {$in: appearances}}, null, {session: session})
                .cursor()
                .eachAsync(async (appearance, i) => {
                    const leagueResult = await LeagueResults.findById(appearance.leagueResult);
                    const appearanceIndex = leagueResult.appearances.indexOf(appearance._id);
                    leagueResult.appearances.splice(appearanceIndex, 1);
                    await leagueResult.save();
                });

                await Appearance.deleteMany({_id: {$in: playerToDelete.appearances}}, {session: session});

                deletedPlayer = transformPlayerData(playerToDelete);
            });
            return deletedPlayer;
        } catch (err) {
            throw err
        };
    },
    updatePlayer: async ({playerId, playerInput}) => {
        try {
            const updatePlayer = await Player.findOneAndUpdate({_id: playerId}, {
                name: playerInput.name,
                phoneNumber: playerInput.phoneNumber,
                email: playerInput.email,
                addressOne: playerInput.addressOne,
                addressTwo: playerInput.addressTwo,
                postcode: playerInput.postcode,
                position: playerInput.position,
                photo: playerInput.photo,
                information: playerInput.information,
                active: true
        }, {
            new: true,
            omitUndefined: true,
            useFindAndModify: false
        });
            const updatedPlayer = transformPlayerData(updatePlayer);
            return updatedPlayer;
        } catch (err) {
            throw err
        };
    }
}
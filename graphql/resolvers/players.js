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
            firstName: playerInput.firstName,
            surname: playerInput.surname,
            position: playerInput.position,
        })

        if (playerInput.phoneNumber.trim() !== "") {
            player.phoneNumber = playerInput.phoneNumber
        };
        
        if (playerInput.email.trim() !== "") {
            player.email = playerInput.email
        };

        if (playerInput.addressOne.trim() !== "") {
            player.addressOne = playerInput.addressOne
        };

        if (playerInput.addressTwo.trim() !== "") {
            player.addressTwo = playerInput.addressTwo
        };

        if (playerInput.postcode.trim() !== "") {
            player.postcode = playerInput.postcode
        };

        if (playerInput.information.trim() !== "") {
            player.information = playerInput.information
        };

        try {
            const savePlayer = await player.save();

            return transformPlayerData(savePlayer);
        } catch (err) {
            throw err;
        }
    },
    deletePlayer: async ({playerId}) => {
        const deletePlayer = await checkPlayer(playerId);
        const appearances = deletePlayer.appearances;

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

                await Appearance.deleteMany({_id: {$in: deletePlayer.appearances}}, {session: session});

                deletedPlayer = transformPlayerData(deletePlayer);
            });
            return deletedPlayer;
        } catch (err) {
            throw err
        };
    },
    updatePlayer: async ({playerId, playerInput}) => {
        try {
            const updatePlayer = await Player.findOneAndUpdate({_id: playerId}, {
                firstName: playerInput.firstName,
                surname: playerInput.surname,
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
        return transformPlayerData(updatePlayer);
        } catch (err) {
            throw err
        };
    }
}
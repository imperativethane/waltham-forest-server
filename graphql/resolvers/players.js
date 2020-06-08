const Player = require('../../models/Player');

const updateProperty = (playerInput, field) => {
    return playerInput[field] || undefined
}

module.exports = {
    players: async () => {
        try {
            const players = await Player.find();
            return players.map(player => {
                return {
                    ...player._doc
                }
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
            createdPlayer = {
                ...result._doc
            };
            return createdPlayer;
        } catch (err) {
            throw err;
        }
    },
    deletePlayer: async ({playerId}) => {
        const checkPlayer = await Player.findOne({_id: playerId});
        if(!checkPlayer) {
            throw new Error('Player does not exist in database')
        };
        try {
            await Player.deleteOne({_id: playerId});
            const deletedPlayer = {
                ...checkPlayer._doc
            };
            return deletedPlayer;
        } catch (err) {
            throw err
        };
    },
    updatePlayer: async ({playerId, playerInput}) => {
        try {
            const updatePlayer = await Player.findOneAndUpdate({_id: playerId}, {
                name: updateProperty(playerInput, 'name'),
                phoneNumber: updateProperty(playerInput, 'phoneNumber'),
                email: updateProperty(playerInput, 'email'),
                addressOne: updateProperty(playerInput, 'addressOne'),
                addressTwo: updateProperty(playerInput, 'addressTwo'),
                postcode: updateProperty(playerInput, 'postcode'),
                position: updateProperty(playerInput, 'position'),
                photo: updateProperty(playerInput, 'photo'),
                information: updateProperty(playerInput, 'information'),
                active: true
        }, {
            new: true,
            omitUndefined: true,
            useFindAndModify: false
        });
            const updatedPlayer = {
                ...updatePlayer._doc
            };
            return updatedPlayer;
        } catch (err) {
            throw err
        };
    }
}
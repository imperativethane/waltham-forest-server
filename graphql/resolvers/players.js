const Player = require('../../models/Player');

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
    createPlayer: async (args) => {
        const player = new Player({
            name: args.playerInput.name,
            phoneNumber: args.playerInput.phoneNumber,
            email: args.playerInput.email,
            addressOne: args.playerInput.addressOne,
            addressTwo: args.playerInput.addressTwo,
            postcode: args.playerInput.postcode,
            position: args.playerInput.position,
            photo: args.playerInput.photo,
            information: args.playerInput.information,
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
    }
}
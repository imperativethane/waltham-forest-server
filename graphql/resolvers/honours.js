const Honour = require('../../models/Honours');
const Player = require('../../models/Player');

const { player, runInTransaction} = require('./merge');

module.exports = {
    honours: async ({playerId}) => {
       try {
           const honours = await Honour.find({player: playerId});
           return honours.map(honour => {
               return {
                   ...honour._doc,
                   player: player.bind(this, honour._doc.player)
               };
           });
       } catch (err) {
           throw err;
       }
    },
    createHonour: async ({playerId, honourInput}) => {
        const honour = new Honour({
            honour: honourInput.honour,
            season: honourInput.season,
            player: playerId
        });
        let createdHonour;
        try {
            const checkPlayer = await Player.findById(playerId);
            if (!checkPlayer) {
                throw new Error('Player does not exist on the database')
            };
            await runInTransaction(async session => {
                const result = await honour.save({session: session});
                checkPlayer.honours.push(honour);
                await checkPlayer.save({session: session});
                createdHonour = {
                    ...result._doc,
                    player: player.bind(this, result._doc.player) 
                };
            });
            return createdHonour; 
        } catch (err) {
            throw err;
        }
    },
    deleteHonour: async ({honourId}) => {
        try {
            const checkHonour = await Honour.findById(honourId);
            if (!checkHonour) {
                throw new Error('Honour does not exist on the database')
            };
            let deletedHonour;
            await runInTransaction(async session => {
                await Honour.deleteOne({_id: honourId}, {session: session});
                const checkPlayer = await Player.findById(checkHonour.player);
                const index = checkPlayer.honours.indexOf(honourId);
                checkPlayer.honours.splice(index, 1)
                checkPlayer.save({session: session})
                deletedHonour = {
                    ...checkHonour._doc,
                    player: player.bind(this, checkHonour._doc.player)
                };
            });
            return deletedHonour;
        } catch (err) {
            throw err;
        };
    }
};
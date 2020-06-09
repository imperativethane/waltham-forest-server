const Honour = require('../../models/Honours');

const {checkPlayer, runInTransaction, transformData} = require('./merge');

module.exports = {
    honours: async ({playerId}) => {
       try {
           await checkPlayer(playerId);
           const honours = await Honour.find({player: playerId});
           return honours.map(honour => {
               return transformData(honour);
           });
       } catch (err) {
           throw err;
       };
    },
    createHonour: async ({playerId, honourInput}) => {
        const honour = new Honour({
            honour: honourInput.honour,
            season: honourInput.season,
            player: playerId
        });
        let createdHonour;
        try {
            const playerHonoured = await checkPlayer(playerId);
            await runInTransaction(async session => {
                const result = await honour.save({session: session});
                playerHonoured.honours.push(honour);
                await playerHonoured.save({session: session});
                createdHonour = transformData(result);
            });
            return createdHonour; 
        } catch (err) {
            throw err;
        };
    },
    deleteHonour: async ({honourId}) => {
        try {
            const checkHonour = await Honour.findById(honourId);
            if (!checkHonour) {
                throw new Error('Honour does not exist on the database');
            };
            let deletedHonour;
            await runInTransaction(async session => {
                await Honour.deleteOne({_id: honourId}, {session: session});
                const playerAwarded = checkPlayer(checkHonour.player);
                const index = playerAwarded.honours.indexOf(honourId);
                playerAwarded.honours.splice(index, 1);
                playerAwarded.save({session: session});
                deletedHonour = transformData(checkHonour);
            });
            return deletedHonour;
        } catch (err) {
            throw err;
        };
    }
};
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
        const player = await checkPlayer(playerId);
        
        const honour = new Honour({
            honour: honourInput.honour,
            season: honourInput.season,
            player: playerId
        });

        let createdHonour;
        try {
            await runInTransaction(async session => {
                const saveHonour = await honour.save({session: session});
                
                player.honours.push(honour);
                await player.save({session: session});

                createdHonour = transformData(saveHonour);
            });
            return createdHonour; 
        } catch (err) {
            throw err;
        };
    },
    deleteHonour: async ({honourId}) => {
        const deleteHonour = await Honour.findById(honourId);
        if (!deleteHonour) {
            throw new Error('Honour does not exist on the database');
        };

        const player = await checkPlayer(deleteHonour.player);

        let deletedHonour;
        try {
            await runInTransaction(async session => {
                await Honour.deleteOne({_id: honourId}, {session: session});

                const honourIndex = player.honours.indexOf(honourId);
                player.honours.splice(honourIndex, 1);
                player.save({session: session});

                deletedHonour = transformData(deleteHonour);
            });
            return deletedHonour;
        } catch (err) {
            throw err;
        };
    }
};
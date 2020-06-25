const Award = require('../../models/Awards');

const {checkPlayer, runInTransaction, transformData} = require('./merge');

module.exports = {
    awards: async ({playerId}) => {
       try {
            await checkPlayer(playerId);
            const awards = await Award.find({player: playerId});
            return awards.map(award => {
                return transformData(award);
            });
        } catch (err) {
           throw err;
        }
    },
    createAward: async ({playerId, awardInput}) => {
        const player = await checkPlayer(playerId);

        const award = new Award({
            award: awardInput.award,
            season: awardInput.season,
            player: playerId
        });

        let createdAward;
        try {
            await runInTransaction(async session => {
                const saveAward = await award.save({session: session});

                player.awards.push(award);
                await player.save({session: session});

                createdAward = transformData(saveAward);
            });
            return createdAward; 
        } catch (err) {
            throw err;
        }
    },
    deleteAward: async ({awardId}) => {
        const deleteAward = await Award.findById(awardId);
        if (!deleteAward) {
            throw new Error('Award does not exist on the database')
        };
        const player = await checkPlayer(deleteAward.player);

        let deletedAward;
        try {
            await runInTransaction(async session => {
                await Award.deleteOne({_id: awardId}, {session: session});
                
                const awardIndex = player.awards.indexOf(awardId);
                player.awards.splice(awardIndex, 1);
                await player.save({session: session});

                deletedAward = transformData(deleteAward); 
            });
            return deletedAward;
        } catch (err) {
            throw err;
        };
    }
};
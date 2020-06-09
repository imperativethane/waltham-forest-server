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
        const award = new Award({
            award: awardInput.award,
            season: awardInput.season,
            player: playerId
        });
        console.log(award, 'award created')
        let createdAward;
        try {
            const playerAwarded = await checkPlayer(playerId);
            await runInTransaction(async session => {
                const result = await award.save({session: session});
                playerAwarded.awards.push(award);
                await playerAwarded.save({session: session});
                createdAward = transformData(result);
            });
            return createdAward; 
        } catch (err) {
            throw err;
        }
    },
    deleteAward: async ({awardId}) => {
        try {
            const checkAward = await Award.findById(awardId);
            if (!checkAward) {
                throw new Error('Award does not exist on the database')
            };
            let deletedAward;
            await runInTransaction(async session => {
                await Award.deleteOne({_id: awardId}, {session: session});
                const playerAwarded = await checkPlayer(checkAward.player);
                const index = playerAwarded.awards.indexOf(awardId);
                playerAwarded.awards.splice(index, 1);
                await playerAwarded.save({session: session});
                deletedAward = transformData(checkAward); 
            });
            return deletedAward;
        } catch (err) {
            throw err;
        };
    }
};
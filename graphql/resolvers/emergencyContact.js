const EmergencyContact = require('../../models/EmergencyContact');
const Player = require('../../models/Player');

const { player, runInTransaction, checkPlayer, transformData } = require('./merge');

module.exports = {
    playerEmergencyContact: async ({playerId}) => {
        try {
            const result = await EmergencyContact.findOne({player: playerId});
            return transformData(result);
        } catch (err) {
            throw err;
        };
    },
    createEmergencyContact: async ({playerId, emergencyContactInput}) => {
        const emergencyContact = new EmergencyContact({
            name: emergencyContactInput.name,
            phoneNumber: emergencyContactInput.phoneNumber,
            relationship: emergencyContactInput.relationship,
            player: playerId
        });
        let createdEmergencyContact;
        try {
            const player = await checkPlayer(playerId);

            const checkContact = await EmergencyContact.findOne({player: playerId});
            if (checkContact) {
                throw new Error('Player already has an Emergency Contact')
            };

            await runInTransaction(async session => {
                const result = await emergencyContact.save({session: session});
                createdEmergencyContact = transformData(result);
                player.emergencyContact = emergencyContact;
                await player.save({session: session});
            });
            return createdEmergencyContact;
        } catch (err) {
            throw err;
        };
    },
    deleteEmergencyContact: async ({playerId}) => {
        try {
            await checkPlayer(playerId);
            const emergencyContact = await EmergencyContact.findOne({player: playerId});
            if (!emergencyContact) {
                throw new Error('This player does not have an emergency contact listed');
            };

            let deletedPlayer;
            await runInTransaction(async session => {
                await EmergencyContact.deleteOne({player: playerId}, {session: session});
                await Player.findOneAndUpdate(
                    { _id: playerId }, 
                    { $unset: {emergencyContact: ""} }, 
                    { 
                        useFindAndModify: false,
                        session: session
                    }
                );
        
                deletedPlayer = transformData(emergencyContact);
            });
            return deletedPlayer;
        } catch (err) {
            throw err;
        };
        
    },
    updateEmergencyContact: async ({emergencyContactInput, playerId}) => {
        try {
            const updateEmergencyContact = await EmergencyContact.findOneAndUpdate({player: playerId}, {
                name: emergencyContactInput.name || undefined,
                phoneNumber: emergencyContactInput.phoneNumber || undefined,
                relationship: emergencyContactInput.relationship || undefined
            }, {
                new: true,
                omitUndefined: true,
                useFindAndModify: false
            });
            const updatedEmergencyContact = transformData(updateEmergencyContact);
            return updatedEmergencyContact;
        } catch (err) {
            throw err;
        };
    }    
}
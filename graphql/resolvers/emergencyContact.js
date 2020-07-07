const EmergencyContact = require('../../models/EmergencyContact');
const Player = require('../../models/Player');

const { runInTransaction, checkPlayer, transformData } = require('./merge');

module.exports = {
    playerEmergencyContact: async ({playerId}) => {
        try {
            const emergencyContact = await EmergencyContact.findOne({player: playerId});
            return transformData(emergencyContact);
        } catch (err) {
            throw err;
        };
    },
    createEmergencyContact: async ({playerId, emergencyContactInput}) => {
        const player = await checkPlayer(playerId);
        
        const checkContact = await EmergencyContact.findOne({player: playerId});
        if (checkContact) {
            throw new Error('Player already has an Emergency Contact')
        };
        
        const emergencyContact = new EmergencyContact({
            firstName: emergencyContactInput.firstName,
            surname: emergencyContactInput.surname,
            phoneNumber: emergencyContactInput.phoneNumber,
            relationship: emergencyContactInput.relationship,
            player: playerId
        });

        let createdEmergencyContact;
        try {
            await runInTransaction(async session => {
                const saveEmergencyContact = await emergencyContact.save({session: session});

                player.emergencyContact = emergencyContact;
                await player.save({session: session});

                createdEmergencyContact = transformData(saveEmergencyContact);
            });
            return createdEmergencyContact;
        } catch (err) {
            throw err;
        };
    },
    deleteEmergencyContact: async ({playerId}) => {
        await checkPlayer(playerId);

        const emergencyContact = await EmergencyContact.findOne({player: playerId});
        if (!emergencyContact) {
            throw new Error('This player does not have an emergency contact listed');
        };

        let deletedPlayer;
        try {
            await runInTransaction(async session => {
                await EmergencyContact.deleteOne({player: playerId}, {session: session});
                await Player.findOneAndUpdate(
                    { _id: playerId }, 
                    { $unset: {emergencyContact: null} }, 
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
        await checkPlayer(playerId);

        try {
            const updateEmergencyContact = await EmergencyContact.findOneAndUpdate({player: playerId}, {
                firstName: emergencyContactInput.firstName,
                surname: emergencyContactInput.surname,
                phoneNumber: emergencyContactInput.phoneNumber,
                relationship: emergencyContactInput.relationship
            }, {
                new: true,
                omitUndefined: true,
                useFindAndModify: false
            });
            return transformData(updateEmergencyContact); 
        } catch (err) {
            throw err;
        };
    }    
}
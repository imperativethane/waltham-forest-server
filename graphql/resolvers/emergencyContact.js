const EmergencyContact = require('../../models/EmergencyContact');
const Player = require('../../models/Player');

const { player, runInTransaction } = require('./merge');

module.exports = {
    playerEmergencyContact: async ({playerId}) => {
        try {
            const result = await EmergencyContact.findOne({player: playerId})
            return {
                ...result._doc,
                player: player.bind(this, result._doc.player)
            }
        } catch (err) {
            throw err;
        }

    },
    createEmergencyContact: async ({playerId, emergencyContactInput}) => {
        const emergencyContact = new EmergencyContact({
            name: emergencyContactInput.name,
            phoneNumber: emergencyContactInput.phoneNumber,
            relationship: emergencyContactInput.relationship,
            player: playerId
        })
        let createdEmergencyContact
        try {
            const checkPlayer = await Player.findById(args.playerId);

            if (!checkPlayer) {
                throw new Error('Player not found.')
            }

            const checkContacts = await EmergencyContact.findOne({player: args.playerId});
            
            if (checkContacts) {
                throw new Error('Player already has an Emergency Contact')
            }
            await runInTransaction(async session => {
                const result = await emergencyContact.save({session: session});
                createdEmergencyContact = {
                    ...result._doc,
                    player: player.bind(this, result._doc.player)
                }
                checkPlayer.emergencyContact = emergencyContact;
                await checkPlayer.save({session: session});
            });
            return createdEmergencyContact;
        } catch (err) {
            throw err;
        }
    },
    deleteEmergencyContact: async ({playerId}) => {
        try {
            const emergencyContact = await EmergencyContact.findOne({player: playerId})
            if (!emergencyContact) {
                throw new Error('This player does not have an emergency contact listed')
            };
            let deletedPlayer;
            await runInTransaction(async session => {
                await EmergencyContact.deleteOne({player: playerId}, {session: session})
                await Player.findOneAndUpdate(
                    { _id: playerId }, 
                    { $unset: {emergencyContact: ""} }, 
                    { 
                        useFindAndModify: false,
                        session: session
                    }
                );
        
                deletedPlayer = {
                    ...emergencyContact._doc,
                    player: player.bind(this, emergencyContact._doc.player)
                };
            });
            return deletedPlayer;
        } catch (err) {
            throw err;
        }
        
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
            const updatedEmergencyContact = {
                ...updateEmergencyContact._doc,
                player: player.bind(this, updateEmergencyContact._doc.player)
            };
            return updatedEmergencyContact;
        } catch (err) {
            throw err
        };
    }    
}
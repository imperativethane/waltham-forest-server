const EmergencyContact = require('../../models/EmergencyContact');
const Player = require('../../models/Player');

const player = async playerId => {
    try {
        const player = await Player.findById(playerId)
        return {
            ...player._doc,      
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    playerEmergencyContact: async args => {
        try {
            const result = await EmergencyContact.findOne({player: args.playerId})
            return {
                ...result._doc,
                player: player.bind(this, result._doc.player)
            }
        } catch (err) {
            throw err;
        }

    },
    createEmergencyContact: async args => {
        const emergencyContact = new EmergencyContact({
            name: args.emergencyContactInput.name,
            phoneNumber: args.emergencyContactInput.phoneNumber,
            relationship: args.emergencyContactInput.relationship,
            player: args.playerId
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

            const result = await emergencyContact.save();
            createdEmergencyContact = {
                ...result._doc,
                player: player.bind(this, result._doc.player)
            }
            checkPlayer.emergencyContact = emergencyContact;
            checkPlayer.save();

            return createdEmergencyContact;
        } catch (err) {
            throw err;
        }
    },
    deleteEmergencyContact: async args => {
        try {
            const emergencyContact = await EmergencyContact.findOne({player: args.playerId})
            if (!emergencyContact) {
                throw new Error('This player does not have an emergency contact listed')
            };
    
            await EmergencyContact.deleteOne({player: args.playerId})
            await Player.findOneAndUpdate(
                { _id: args.playerId }, 
                { $unset: {emergencyContact: ""} }, 
                { useFindAndModify: false }
            );
    
            const deletedPlayer = {
                ...emergencyContact._doc,
                player: player.bind(this, emergencyContact._doc.player)
            };
            return deletedPlayer;
        } catch (err) {
            throw err;
        }
        
    },
    updateEmergencyContact: async args => {
        try {
            const updateEmergencyContact = await EmergencyContact.findOneAndUpdate({player: args.playerId}, {
                name: args.emergencyContactInput.name || undefined,
                phoneNumber: args.emergencyContactInput.phoneNumber || undefined,
                relationship: args.emergencyContactInput.relationship || undefined
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
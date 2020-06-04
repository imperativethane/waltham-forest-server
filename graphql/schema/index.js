const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type EmergencyContact {
        _id: ID!
        name: String!
        phoneNumber: String!
        relationship: String
        player: Player!
    }

    type Player {
        _id: ID!
        name: String!
        phoneNumber: String
        email: String
        addressOne: String
        addressTwo: String
        postcode: String
        position: String!
        active: Boolean!
        photo: String
        information: String
    }

    input PlayerInput {
        name: String!
        phoneNumber: String
        email: String
        addressOne: String
        addressTwo: String
        postcode: String
        position: String!
        photo: String
        information: String
    }

    input PlayerUpdate {
        name: String
        phoneNumber: String
        email: String
        addressOne: String
        addressTwo: String
        postcode: String
        position: String
        photo: String
        information: String
    }

    input EmergencyContactInput {
        name: String!
        phoneNumber: String!
        relationship: String
    }

    input EmergencyContactUpdate {
        name: String
        phoneNumber: String
        relationship: String
    }

    type RootQuery {
        players: [Player!]!
        playerEmergencyContact(playerId: ID!): EmergencyContact!
    }

    type RootMutation {
        createPlayer(playerInput: PlayerInput): Player
        deletePlayer(playerId: ID!): Player!
        updatePlayer(playerId: ID!, playerInput: PlayerUpdate): Player!
        createEmergencyContact(playerId: ID!, emergencyContactInput: EmergencyContactInput): EmergencyContact!
        deleteEmergencyContact(playerId: ID!): EmergencyContact!
        updateEmergencyContact(playerId: ID!, emergencyContactInput: EmergencyContactUpdate): EmergencyContact!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
        honours: [Honour]
    }

    type EmergencyContact {
        _id: ID!
        name: String!
        phoneNumber: String!
        relationship: String
        player: Player!
    }

    type Honour {
        _id: ID!
        honour: String!
        season: String!
        player: Player!
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

    input HonourInput {
        honour: String!
        season: String!
    }

    type RootQuery {
        players: [Player!]!
        playerEmergencyContact(playerId: ID!): EmergencyContact!
        honours(playerId: ID!): [Honour!]!
    }

    type RootMutation {
        createPlayer(playerInput: PlayerInput): Player
        deletePlayer(playerId: ID!): Player!
        updatePlayer(playerId: ID!, playerInput: PlayerUpdate): Player!
        createEmergencyContact(playerId: ID!, emergencyContactInput: EmergencyContactInput): EmergencyContact!
        deleteEmergencyContact(playerId: ID!): EmergencyContact!
        updateEmergencyContact(playerId: ID!, emergencyContactInput: EmergencyContactUpdate): EmergencyContact!
        createHonour(playerId: ID!, honourInput: HonourInput): Honour!
        deleteHonour(honourId: ID!): Honour!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
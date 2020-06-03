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

    type RootQuery {
        players: [Player!]!
    }

    type RootMutation {
        createPlayer(playerInput: PlayerInput): Player
        deletePlayer(playerId: ID!): Player!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
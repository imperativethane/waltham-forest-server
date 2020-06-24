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
        honours: [Honour!]
        awards: [Award!]
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

    type Award {
        _id: ID!
        award: String!
        season: String!
        player: Player!
    }

    type Team {
        _id: ID!
        name: String!
        gamesPlayed: Int!
        gamesWon: Int!
        gamesDraw: Int!
        gamesLost: Int!
        goalsScored: Int!
        goalsAgainst: Int!
        goalDifference: Int!
        points: Int!
        leagueResults: [LeagueResult!]
    }

    type LeagueResult {
        _id: ID!
        homeTeam: Team!
        homeScore: Int!
        awayTeam: Team!
        awayScore: Int!
        date: String!
        appearances: [Appearance!]
    }

    type Appearance {
        _id: ID!
        leagueResult: LeagueResult!
        player: Player!
        starter: Boolean!
        substitute: Boolean!
        goalsScored: Int!
        assists: Int!
        yellowCard: Boolean!
        redCard: Boolean!
        penaltyScored: Int!
        penaltyMissed: Int!
        penaltyConceded: Int!
        manOfTheMatch: Boolean!
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

    input AwardInput {
        award: String!
        season: String!
    }

    input TeamInput {
        name: String!
    }

    input LeagueResultInput {
        homeTeam: ID!
        homeScore: Int!
        awayTeam: ID!
        awayScore: Int!
        date: String!
    }

    input AppearanceInput {
        leagueResult: ID!
        player: ID!
        starter: Boolean
        substitute: Boolean
        goalsScored: Int
        assists: Int
        yellowCard: Boolean
        redCard: Boolean
        penaltyScored: Int
        penaltyMissed: Int
        penaltyConceded: Int
        manOfTheMatch: Boolean
    }

    input AppearanceUpdate {
        starter: Boolean
        substitute: Boolean
        goalsScored: Int
        assists: Int
        yellowCard: Boolean
        redCard: Boolean
        penaltyScored: Int
        penaltyMissed: Int
        penaltyConceded: Int
        manOfTheMatch: Boolean
    }

    type RootQuery {
        players: [Player!]!
        playerEmergencyContact(playerId: ID!): EmergencyContact!
        honours(playerId: ID!): [Honour!]!
        awards(playerId: ID!): [Award!]!
        teams: [Team!]!
        leagueResults: [LeagueResult!]!
        playerAppearances(playerId: ID!): [Appearance!]!
        resultAppearances(resultId: ID!): [Appearance!]!
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
        createAward(playerId: ID!, awardInput: AwardInput): Award!
        deleteAward(awardId: ID!): Award!
        createTeam(teamInput: TeamInput): Team!
        deleteTeam(teamId: ID!): Team!
        createLeagueResult(leagueResultInput: LeagueResultInput): LeagueResult!
        deleteLeagueResult(resultId: ID!): LeagueResult!
        createAppearance(appearanceInput: AppearanceInput): Appearance!
        updateAppearance(appearanceId: ID! appearanceInput: AppearanceUpdate): Appearance!
        deleteAppearance(appearanceId: ID!) Appearance!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)
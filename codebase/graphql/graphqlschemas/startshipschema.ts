import { buildSchema } from 'graphql';


export const StarShipSchema = buildSchema(`
  enum ShipClass {
    GALAXY,
    INTREPID,
    VESSEL,
    COMBAT,
    CARGO
  },

  type SpaceShip {
    model: String!
    class: ShipClass!
    year: Int!
    name: String!
    versions: [String!]!
    warpdrive: Boolean!
  },

  interface ISpaceShip {
    model: String!
    class: ShipClass!
    year: Int!
    warpdrive: Boolean!
  },

  type CargoShip implements ISpaceShip {
    model: String!
    class: ShipClass!
    year: Int!
    warpdrive: Boolean!
    capacity: Int!
    maxSpeed: Int!
  },

  type IntrepidShip implements ISpaceShip {
    model: String!
    class: ShipClass!
    year: Int!
    warpdrive: Boolean!
    maxSpeed: Int!
    maxWarp: Float!
    torpedoBays: Int!
    shieldPower: Float!
  },

  input ShipInput {
    model: String!
    class: ShipClass!
    year: Int!
    warpdrive: Boolean!
    maxSpeed: Int
    maxWarp: Float
    torpedoBays: Int
    shieldPower: Float
  },

  type Ship {
    ships: [ISpaceShip]
  }
`);

module.exports = StarShipSchema;
import * as express from 'express';
import * as bodyParser from 'body-parser'; //json
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
// types: String, Int, Float, Boolean, ID
var schema = buildSchema(`
  type Query {
    hello: String
    miNombre: String
    soyguapo(name: String!): String
  }
`);

var typesInterfacesInputs = buildSchema(`
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

  type Query {
    ships: [ISpaceShip]
  }
`);

// Define a variable to provide a resolver function for each API endpoint within the query
var endpointQueries = {
  soyguapo: ({name}) => {
    return name + " " + (Math.random()<0.6 ? "eres guapo" : "no eres guapo");
  }, 
  hello: () => {
    return 'Hello world!';
  },
  miNombre: () => {
    return "rigo";
  }
};

var shipQueries = {

};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: endpointQueries,
  graphiql: true,
}));

app.use('/starships', graphqlHTTP({
  schema: typesInterfacesInputs,
  rootValue: shipQueries,
  graphiql: true,
}));

app.listen(5000);
console.log('Running a GraphQL API server at   ');
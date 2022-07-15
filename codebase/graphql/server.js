"use strict";
exports.__esModule = true;
var express = require("express");
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
// Construct a schema, using GraphQL schema language
// types: String, Int, Float, Boolean, ID
var schema = (0, graphql_1.buildSchema)("\n  type Query {\n    hello: String\n    miNombre: String\n    soyguapo(name: String!): String\n  }\n");
var typesInterfacesInputs = (0, graphql_1.buildSchema)("\n  enum ShipClass {\n    GALAXY,\n    INTREPID,\n    VESSEL,\n    COMBAT,\n    CARGO\n  },\n\n  type SpaceShip {\n    model: String!\n    class: ShipClass!\n    year: Int!\n    name: String!\n    versions: [String!]!\n    warpdrive: Boolean!\n  },\n\n  interface ISpaceShip {\n    model: String!\n    class: ShipClass!\n    year: Int!\n    warpdrive: Boolean!\n  },\n\n  type CargoShip implements ISpaceShip {\n    model: String!\n    class: ShipClass!\n    year: Int!\n    warpdrive: Boolean!\n    capacity: Int!\n    maxSpeed: Int!\n  },\n\n  type IntrepidShip implements ISpaceShip {\n    model: String!\n    class: ShipClass!\n    year: Int!\n    warpdrive: Boolean!\n    maxSpeed: Int!\n    maxWarp: Float!\n    torpedoBays: Int!\n    shieldPower: Float!\n  },\n\n  input ShipInput {\n    model: String!\n    class: ShipClass!\n    year: Int!\n    warpdrive: Boolean!\n    maxSpeed: Int\n    maxWarp: Float\n    torpedoBays: Int\n    shieldPower: Float\n  },\n\n  type Query {\n    ships: [ISpaceShip]\n  }\n");
// Define a variable to provide a resolver function for each API endpoint within the query
var endpointQueries = {
    soyguapo: function (_a) {
        var name = _a.name;
        return name + " " + (Math.random() < 0.6 ? "eres guapo" : "no eres guapo");
    },
    hello: function () {
        return 'Hello world!';
    },
    miNombre: function () {
        return "rigo";
    }
};
var shipQueries = {};
var app = express();
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: endpointQueries,
    graphiql: true
}));
app.use('/starships', (0, express_graphql_1.graphqlHTTP)({
    schema: typesInterfacesInputs,
    rootValue: shipQueries,
    graphiql: true
}));
app.listen(5000);
console.log('Running a GraphQL API server at   ');

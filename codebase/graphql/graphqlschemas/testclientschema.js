"use strict";
exports.__esModule = true;
exports.TestClientSchema = void 0;
var graphql_1 = require("graphql");
// Construct a schema, using GraphQL schema language
// types: String, Int, Float, Boolean, ID
exports.TestClientSchema = (0, graphql_1.buildSchema)("\n  type TestClient {\n    hello: String\n    miNombre: String\n    soyguapo(name: String!): String\n  }\n");
module.exports = exports.TestClientSchema;

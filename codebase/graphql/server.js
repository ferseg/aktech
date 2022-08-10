"use strict";
exports.__esModule = true;
var express = require("express");
var express_graphql_1 = require("express-graphql");
var graphqlschemas_1 = require("./graphqlschemas");
var graphqlresolvers_1 = require("./graphqlresolvers");
var app = express();
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: graphqlschemas_1.TestClientSchema,
    rootValue: graphqlresolvers_1.TestClientResolver,
    graphiql: true
}));
app.use('/starships', (0, express_graphql_1.graphqlHTTP)({
    schema: graphqlschemas_1.StarShipSchema,
    rootValue: graphqlresolvers_1.StarShipResolver,
    graphiql: true
}));
app.listen(5000);
console.log('Running a GraphQL API server at 5000');

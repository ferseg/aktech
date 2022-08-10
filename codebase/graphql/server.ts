import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import {TestClientSchema, StarShipSchema} from './graphqlschemas';
import {StarShipResolver, TestClientResolver} from './graphqlresolvers';


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: TestClientSchema,
  rootValue: TestClientResolver,
  graphiql: true,
}));

app.use('/starships', graphqlHTTP({
  schema: StarShipSchema,
  rootValue: StarShipResolver,
  graphiql: true,
}));

app.listen(5000);
console.log('Running a GraphQL API server at 5000');
import { buildSchema } from 'graphql';


// Construct a schema, using GraphQL schema language
// types: String, Int, Float, Boolean, ID
export const TestClientSchema = buildSchema(`
  type TestClient {
    hello: String
    miNombre: String
    soyguapo(name: String!): String
  }
`);

module.exports = TestClientSchema;
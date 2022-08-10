import { buildSchema } from 'graphql';

// Define a variable to provide a resolver function for each API endpoint within the query
export const TestClientResolver = {
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

module.exports = TestClientResolver;
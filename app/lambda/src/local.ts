import { ApolloServer } from 'apollo-server';
import { createConfig } from './config';
// const env = require('./env.json');
const port = 3000;

const server = new ApolloServer(createConfig({}, '../schema.graphql'));

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
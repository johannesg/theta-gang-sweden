import { Resolvers } from "../types/gen-types";

export const resolvers : Resolvers = {
    Query: {
        hello: () => "Tjoho!"
    }
}
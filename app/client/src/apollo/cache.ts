import { InMemoryCache } from "@apollo/client";
import { TypedTypePolicies } from './types';

const typePolicies: TypedTypePolicies = {

};

export const cache = new InMemoryCache({
    typePolicies
});

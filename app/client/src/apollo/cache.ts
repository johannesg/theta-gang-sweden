import { InMemoryCache, makeVar } from "@apollo/client";
import { Instrument } from "./types";

export const cache = new InMemoryCache();

export const currentInstrument = makeVar<string>("");
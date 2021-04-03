import { InMemoryCache, makeVar } from "@apollo/client";
import { getCurrentMonth } from "../utils/date";
import { Instrument, OptionType } from "./types";

export const cache = new InMemoryCache();

export const currentInstrument = makeVar<string>("");

export const currentOptionType = makeVar<OptionType>(OptionType.Standard);

export const currentExpiry = makeVar<string>(getCurrentMonth());
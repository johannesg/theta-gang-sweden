import { makeVar } from "@apollo/client";
import { getCurrentMonth } from "../utils/date";
import { CallOrPut, OptionType } from "./types";

export const currentInstrument = makeVar<string>("");

export const currentOptionType = makeVar<OptionType>(OptionType.Standard);

export const currentExpiry = makeVar<string>(getCurrentMonth());

export const selectedOption = makeVar<CallOrPut | null>(null);
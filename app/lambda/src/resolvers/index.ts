import { CallOrPutType, InstrumentDetails, OptionDetails, OptionType, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { mergeOptionsLists, ParsedOptionsData, parseOptionDetails, parseOptionsOverview, parseOptionsPage, parseOptionsQuote, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';
import { getDaysFromNow } from '@theta-gang/shared/src/date';
import { transformOverview } from "./transform-data";
import { DateTime } from "luxon";
import { calcGreeksCall, calcGreeksPut } from "@theta-gang/shared/src/calc-greeks";

async function getOptionDetails(id: string | undefined): Promise<OptionDetails> {
    if (!id)
        return {};

    const html = await getOptionInfo(id);
    const doc = cheerio.load(html);
    return parseOptionDetails(doc);
}

function calcGreeks(underlying: InstrumentDetails, option: OptionDetails) {

    const type = option.type!;
    // const underlyingPrice = underlying.lastPrice ?? 0;
    const underlyingPrice = underlying.buyPrice && underlying.sellPrice
        ? ((underlying.buyPrice! + underlying.sellPrice!) / 2)
        : underlying.lastPrice ?? 0;

    const price = (option.bid! + option.ask!) / 2;
    // const price = option.last ?? 0;
    const strike = option.strike!;
    const dte = getDaysFromNow(option.expires!);
    const interest = option.interest ?? -.003;

    // console.log({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice });

    const res = type == CallOrPutType.Call
        ? calcGreeksCall({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice })
        : calcGreeksPut({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice });

    option.IV = res.iv;
    option.delta = res.delta;
    option.theta = res.theta;
    option.rho = res.rho;
    option.gamma = res.gamma;
    option.vega = res.vega;
}

async function loadAndParseOptionsList(id: string, type: OptionType, expires: string, tab: string): Promise<ParsedOptionsData> {
    const html = await getOptionsList(id, type, expires, tab);
    const doc = cheerio.load(html);
    switch (tab) {
        case "overview":
            return parseOptionsOverview(doc);
        case "quote":
            return parseOptionsQuote(doc);
        default:
            throw `Invalid tab type: ${tab}`;
    }
}

async function loadOptionsMatrix(id: string, type: OptionType, expires: string) {
    const start = DateTime.now();
    const [overview, quote] = await Promise.all([
        loadAndParseOptionsList(id, type, expires, "overview"),
        loadAndParseOptionsList(id, type, expires, "quote")]);

    let ms = -start.diffNow("milliseconds").milliseconds;
    console.log(`Fetch options list: ${ms}`)
    const optionsList = mergeOptionsLists(overview, quote);
    ms = -start.diffNow("milliseconds").milliseconds;
    console.log(`Merged options list: ${ms}`)
    const matrix = transformOverview(optionsList);
    ms = -start.diffNow("milliseconds").milliseconds;
    console.log(`Transformed options list: ${ms}`)

    matrix.matrix.forEach(x => {
        x.options.forEach(o => {
            calcGreeks(matrix.underlying!, o.call!);
            calcGreeks(matrix.underlying!, o.put!);
        })
    })
    ms = -start.diffNow("milliseconds").milliseconds;
    console.log(`Calc greeks: ${ms}`)
    return matrix;
}

export const resolvers: Resolvers = {
    Query: {
        instruments: async () => {
            const html = await getInstruments();
            const doc = cheerio.load(html);
            return parseStockList(doc);
        },
        matrix: async (_, { id, type, expires, includeDetails }) => {
            return loadOptionsMatrix(id, type, expires);
        },
        optionDetails: async (_, { id }) => {
            return await getOptionDetails(id);
        }
    }
}
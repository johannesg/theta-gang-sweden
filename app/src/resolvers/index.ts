import { CallOrPutType, InstrumentDetails, OptionDetails, OptionType, OptionsMatrix } from "../types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { mergeOptionsLists, ParsedOptionsData, parseOptionDetails, parseOptionsOverview, parseOptionsPage, parseOptionsQuote, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';
import { getDaysFromNow } from '../utils/date';
import { transformOverview } from "./transform-data";
import { DateTime } from "luxon";
import { calcGreeksCall, calcGreeksPut } from "../utils/calc-greeks";

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

async function loadOptionsList(id: string, type: OptionType, expires: string, tab: string, page?: number): Promise<cheerio.Selector> {
    const html = await getOptionsList(id, type, expires, tab, page);
    return cheerio.load(html);
}

async function loadOptionsLists(id: string, type: OptionType, expires: string, tab: string, pages: number[]): Promise<cheerio.Selector[]> {
    console.log(`Fetching extra ${pages.length} pages for ${id}, type: ${type}, tab: ${tab}`);
    return Promise.all(pages.map(page => loadOptionsList(id, type, expires, tab, page)));
}

async function loadAndParseOptionsList(id: string, type: OptionType, expires: string, tab: string): Promise<ParsedOptionsData> {
    const doc = await loadOptionsList(id, type, expires, tab);
    switch (tab) {
        case "overview":
            return parseOptionsOverview(doc, async pages => loadOptionsLists(id, type, expires, tab, pages));
        case "quote":
            return parseOptionsQuote(doc, async pages => loadOptionsLists(id, type, expires, tab, pages));
        default:
            throw `Invalid tab type: ${tab}`;
    }
}

export async function loadOptionsMatrix(id: string, type: OptionType, expires: string) : Promise<OptionsMatrix> {
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

export async function loadInstruments() {
    console.log("Get instruments from avanza");
    const html = await getInstruments();
    const doc = cheerio.load(html);
    return parseStockList(doc);
}

export async function loadOptionDetails(id: string | undefined): Promise<OptionDetails> {
    if (!id)
        return {};

    const html = await getOptionInfo(id);
    const doc = cheerio.load(html);
    return parseOptionDetails(doc);
}


import { CallOrPutType, InstrumentDetails, OptionDetails, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { parseOptionInfo, parseOptionsOverview, parseOptionsPage, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';
import { getDaysFromNow, getNextMonth } from "../utils/date";
import { transformOverview } from "./transform-data";
import { DateTime } from "luxon";
import { calc_delta_call, calc_delta_put, calc_gamma, calc_iv_call, calc_iv_put, calc_rho_call, calc_rho_put, calc_theta_call, calc_theta_put, calc_vega, calc_vega2 } from "../utils/calc-greeks";

async function getOptionDetails(id: string | undefined): Promise<OptionDetails> {
    if (!id)
        return {};

    const html = await getOptionInfo(id);
    const doc = cheerio.load(html);
    return parseOptionInfo(doc);
}

function calcGreeks(underlying: InstrumentDetails, option: OptionDetails) {

    const type = option.type!;
    // const underlyingPrice = underlying.lastPrice ?? 0;
    const underlyingPrice = (underlying.buyPrice! + underlying.sellPrice!) / 2;
    const price = (option.bid! + option.ask!) / 2;
    // const price = option.last ?? 0;
    const strike = option.strike!;
    const dte = getDaysFromNow(option.expires!);
    const interest = option.interest!
    let IV = 0;


    switch (type) {
        case CallOrPutType.Call:
            IV = calc_iv_call(underlyingPrice, strike, dte, interest, price);
            if (!IV)
                break;
            option.IV2 = IV;
            option.delta2 = calc_delta_call(underlyingPrice, strike, dte, IV, interest);
            option.theta2 = calc_theta_call(underlyingPrice, strike, dte, IV, interest);
            option.rho2 = calc_rho_call(underlyingPrice, strike, dte, IV, interest);
            option.gamma2 = calc_gamma(underlyingPrice, strike, dte, IV, interest);
            option.vega2 = calc_vega(underlyingPrice, strike, dte, IV, interest);
            break;
        case CallOrPutType.Put:
            IV = calc_iv_put(underlyingPrice, strike, dte, interest, price);
            if (!IV)
                break;
            option.IV2 = IV;
            option.delta2 = calc_delta_put(underlyingPrice, strike, dte, IV, interest);
            option.theta2 = calc_theta_put(underlyingPrice, strike, dte, IV, interest);
            option.rho2 = calc_rho_put(underlyingPrice, strike, dte, IV, interest);
            option.gamma2 = calc_gamma(underlyingPrice, strike, dte, IV, interest);
            option.vega2 = calc_vega(underlyingPrice, strike, dte, IV, interest);
            break;
    }
}

export const resolvers: Resolvers = {
    Query: {
        instruments: async () => {
            const html = await getInstruments();
            const doc = cheerio.load(html);
            return parseStockList(doc);
        },
        matrix: async (_, { id, type, expires, includeDetails }) => {
            const start = DateTime.now();
            const html = await getOptionsList(id, type, expires, "overview");
            const doc = cheerio.load(html);

            let ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Fetch options list: ${ms}`)

            const optionsList = parseOptionsOverview(doc);
            ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Parsed options list: ${ms}`)
            const matrix = transformOverview(optionsList);

            ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Transformed options list: ${ms}`)

            if (includeDetails) {
                const allPromises = matrix.matrix.flatMap(m => {
                    return m.options.flatMap(x => {
                        const p1 = getOptionDetails(x.call?.href!)
                            .then(d => {
                                x.call = { ...x.call, ...d };
                                calcGreeks(matrix.underlying!, x.call);
                            });

                        const p2 = getOptionDetails(x.put?.href!)
                            .then(d => {
                                x.put = { ...x.put, ...d }
                                calcGreeks(matrix.underlying!, x.put);
                            });

                        return [p1, p2];
                    });
                });
                await Promise.all(allPromises);


            }

            ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Fetched options details: ${ms}`)

            return matrix;
        },
        optionDetails: async (_, { id }) => {
            return await getOptionDetails(id);
        }
    }
}
import { CallOrPutType, InstrumentDetails, OptionDetails, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { parseOptionInfo, parseOptionsOverview, parseOptionsPage, parseStockList } from "./parse-data";
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

    const res = type == CallOrPutType.Call
        ? calcGreeksCall({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice })
        : calcGreeksPut({ daysToExpiration: dte, price, riskFreeInterestRate: interest, strike, underlyingPrice });

    option.IV2 = res.iv;
    option.delta2 = res.delta;
    option.theta2 = res.theta;
    option.rho2 = res.rho;
    option.gamma2 = res.gamma;
    option.vega2 = res.vega;
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
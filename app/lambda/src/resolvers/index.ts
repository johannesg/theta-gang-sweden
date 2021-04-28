import { CallOrPutType, InstrumentDetails, OptionDetails, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { mergeOptionsLists, parseOptionDetails, parseOptionsOverview, parseOptionsPage, parseOptionsQuote, parseStockList } from "./parse-data";
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

export const resolvers: Resolvers = {
    Query: {
        instruments: async () => {
            const html = await getInstruments();
            const doc = cheerio.load(html);
            return parseStockList(doc);
        },
        matrix: async (_, { id, type, expires, includeDetails }) => {
            const start = DateTime.now();
            const [html_o, html_q] = await Promise.all([getOptionsList(id, type, expires, "overview"), getOptionsList(id, type, expires, "quote") ]);

            const doc_o = cheerio.load(html_o);
            const doc_q = cheerio.load(html_q);

            let ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Fetch options list: ${ms}`)

            const overview = parseOptionsOverview(doc_o);
            const quote = parseOptionsQuote(doc_q);

            const optionsList = mergeOptionsLists(overview, quote);

            ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Parsed options list: ${ms}`)
            const matrix = transformOverview(optionsList);

            ms = -start.diffNow("milliseconds").milliseconds;
            console.log(`Transformed options list: ${ms}`)

            matrix.matrix.forEach(x => {
                x.options.forEach(o => {
                    calcGreeks(matrix.underlying!, o.call!);
                    calcGreeks(matrix.underlying!, o.put!);
                })
            })

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
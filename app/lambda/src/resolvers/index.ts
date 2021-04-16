import { OptionDetails, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { parseOptionInfo, parseOptionsOverview, parseOptionsPage, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';
import { getNextMonth } from "../utils/date";
import { transformOverview } from "./transform-data";

async function getOptionDetails(id: string | undefined): Promise<OptionDetails> {
    if (!id)
        return {};

    const html = await getOptionInfo(id);
    const doc = cheerio.load(html);
    return parseOptionInfo(doc);
}

export const resolvers: Resolvers = {
    Query: {
        instruments: async () => {
            const html = await getInstruments();
            const doc = cheerio.load(html);
            return parseStockList(doc);
        },
        matrix: async (_, { id, type, expires, includeDetails }) => {
            const html = await getOptionsList(id, type, expires, "overview");
            const doc = cheerio.load(html);
            const optionsList = parseOptionsOverview(doc);
            const matrix = transformOverview(optionsList);

            const allPromises = matrix.matrix.flatMap(m => {
                return m.options.flatMap(x => {
                    const p1 = getOptionDetails(x.call?.href!)
                        .then(d => x.call = { ...x.call, ...d });

                    const p2 = getOptionDetails(x.put?.href!)
                        .then(d => x.put = { ...x.put, ...d });

                    return [p1, p2];
                });
            });
            await Promise.all(allPromises);

            return matrix;
        },
        optionDetails: async (_, { id }) => {
            return await getOptionDetails(id);
        }
    }
}
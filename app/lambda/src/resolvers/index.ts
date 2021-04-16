import { OptionDetails, Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { parseOptionInfo, parseOptionsPage, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';
import { getNextMonth } from "../utils/date";

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
        options: async (_, { id, type, expires, includeDetails }) => {
            const html = await getOptionsList(id, type, expires, "matrix");
            const doc = cheerio.load(html);
            const optionsList = parseOptionsPage(doc);

            if (includeDetails) {
                // const allPromises = optionsList.options.flatMap(x => {
                //     const p1 = getOptionDetails(x.call?.href)
                //         .then(d => x.callDetails = d);

                //     const p2 = getOptionDetails(x.put?.href)
                //         .then(d => x.putDetails = d);

                //     return [ p1, p2 ];
                // });

                // await Promise.all(allPromises);
            }

            return optionsList;
        },
        optionDetails: async (_, { id }) => {
            return await getOptionDetails(id);
        }
    }
}
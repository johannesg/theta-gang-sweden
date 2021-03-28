import { Resolvers } from "../types/gen-types";
import { getInstruments, getOptionInfo, getOptionsList } from "./fetch-data";
import { parseOptionInfo, parseOptionsPage, parseStockList } from "./parse-data";
import * as cheerio from 'cheerio';

export const resolvers : Resolvers = {
    Query: {
        instruments: async () => {
            const html = await getInstruments();
            const doc = cheerio.load(html);
            return parseStockList(doc);
        },
        options: async (_, { id }) => {
            const html = await getOptionsList(id);
            const doc = cheerio.load(html);
            return parseOptionsPage(doc);
        },
        optionDetails: async (_, { id }) => {
            const html = await getOptionInfo(id);
            const doc = cheerio.load(html);
            return parseOptionInfo(doc);
        }
    }
}
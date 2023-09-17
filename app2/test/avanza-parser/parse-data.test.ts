import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs/promises';
import { mergeOptionsLists, parseOptionDetails, parseOptionsOverview, parseOptionsPage, parseOptionsQuote, parseStockList } from '../../src/resolvers/parse-data';
import * as util from 'util';

import * as cheerio from 'cheerio';
import { transformOverview } from '../../src/resolvers/transform-data';

function jsonToString(data: object): string {
    return JSON.stringify(data, (key, value) => {
        if (value instanceof Map) {
            return Object.fromEntries(value.entries())
        } else {
            return value;
        }
    }, 4);
}

async function fetchOmxList(tab: string, page: number) : Promise<cheerio.Selector> {
    const data = await fs.readFile(`test/avanza-parser/data/OMX-Weeklies-${tab}-${page}.html`);
    return cheerio.load(data);
}

fs.mkdir("out", { recursive: true});

describe("parse tests", () => {
    test("can parse stock list", async () => {
        const data = await fs.readFile("test/avanza-parser/optionslist_overview.html");

        const doc = cheerio.load(data);

        const res = parseStockList(doc);
        // console.log(res);
        expect(res).not.toBeNull();
        expect(res).toContainEqual({ id: "26188", name: "AAK" });
    });


    test("can parse options list matrix", async () => {
        const data = await fs.readFile("test/avanza-parser/optionslist_matrix.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsPage(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list overview", async () => {
        const data = await fs.readFile("test/avanza-parser/optionslist_overview.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsOverview(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list quote", async () => {
        const data = await fs.readFile("test/avanza-parser/optionslist_quote.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsQuote(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });


    test("can merge options lists", async () => {
        const overviewData = await fs.readFile("test/avanza-parser/optionslist_overview.html");
        const quoteData = await fs.readFile("test/avanza-parser/optionslist_quote.html");

        const overview = await parseOptionsOverview(cheerio.load(overviewData));
        const quote = await parseOptionsQuote(cheerio.load(quoteData));
        const res = mergeOptionsLists(overview, quote);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list overview and transform", async () => {
        const overviewData = await fs.readFile("test/avanza-parser/optionslist_overview.html");
        const quoteData = await fs.readFile("test/avanza-parser/optionslist_quote.html");

        const overview = await parseOptionsOverview(cheerio.load(overviewData));
        const quote = await parseOptionsQuote(cheerio.load(quoteData));
        const merged = mergeOptionsLists(overview, quote);

        const res = transformOverview(merged);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.matrix, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list and transform (omx)", async () => {
        const overviewData = await fetchOmxList("overview", 1);
        const quoteData = await fetchOmxList("quote", 1);

        const overview = await parseOptionsOverview(overviewData);
        await fs.writeFile("out/omx-overview.json", jsonToString(overview));

        const quote = await parseOptionsQuote(quoteData);
        await fs.writeFile("out/omx-quote.json", jsonToString(quote));

        const merged = mergeOptionsLists(overview, quote);
        await fs.writeFile("out/omx-merged.json", jsonToString(merged));

        const res = transformOverview(merged);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.matrix, {showHidden: false, depth: null}))
        await fs.writeFile("out/omx-result.json", jsonToString(res));
        expect(res).not.toBeNull();
    });

    test("can fetch more (omx)", async () => {
        const overviewData = await fetchOmxList("overview", 1);
        const quoteData = await fetchOmxList("quote", 1);

        const overview = await parseOptionsOverview(overviewData, async pageNumbers => {
            return await Promise.all(pageNumbers.map(async page => await fetchOmxList("overview", page)));
        });

        await fs.writeFile("out/fetchmore-omx-overview.json", jsonToString(overview));

        const quote = await parseOptionsQuote(quoteData, async pageNumbers => {
            return await Promise.all(pageNumbers.map(async page => await fetchOmxList("quote", page)));
        });

        await fs.writeFile("out/fetchmore-omx-quote.json", jsonToString(quote));

        const merged = mergeOptionsLists(overview, quote);
        await fs.writeFile("out/fetchmore-omx-merged.json", jsonToString(merged));

        const res = transformOverview(merged);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.matrix, {showHidden: false, depth: null}))
        await fs.writeFile("out/fetchmore-omx-result.json", jsonToString(res));
        expect(res).not.toBeNull();
    });

    test("can parse option info", async () => {
        const data = await fs.readFile("test/avanza-parser/optioninfo.html");

        const doc = cheerio.load(data);
        const res = await parseOptionDetails(doc);

        // console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });
});

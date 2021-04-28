import * as fs from 'fs/promises';
import { mergeOptionsLists, parseOptionDetails, parseOptionsOverview, parseOptionsPage, parseOptionsQuote, parseStockList } from '../src/resolvers/parse-data';
import * as util from 'util';

import * as cheerio from 'cheerio';
import { transformOverview } from '../src/resolvers/transform-data';

describe("parse tests", () => {
    test("can parse stock list", async() => {
        const data = await fs.readFile("test/optionslist_overview.html");

        const doc = cheerio.load(data);

        const res = parseStockList(doc);
        // console.log(res);
        expect(res).not.toBeNull();
        expect(res).toContainEqual({ id: "26188", name: "AAK"});
    });


    test("can parse options list matrix", async () => {
        const data = await fs.readFile("test/optionslist_matrix.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsPage(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list overview", async () => {
        const data = await fs.readFile("test/optionslist_overview.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsOverview(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list quote", async () => {
        const data = await fs.readFile("test/optionslist_quote.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsQuote(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });


    test("can merge options lists", async () => {
        const overviewData = await fs.readFile("test/optionslist_overview.html");
        const quoteData = await fs.readFile("test/optionslist_quote.html");

        const overview = parseOptionsOverview(cheerio.load(overviewData));
        const quote = parseOptionsQuote(cheerio.load(quoteData));
        const res = mergeOptionsLists(overview, quote);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list overview and transform", async () => {
        const overviewData = await fs.readFile("test/optionslist_overview.html");
        const quoteData = await fs.readFile("test/optionslist_quote.html");

        const overview = parseOptionsOverview(cheerio.load(overviewData));
        const quote = parseOptionsQuote(cheerio.load(quoteData));
        const merged = mergeOptionsLists(overview, quote);

        const res = transformOverview(merged);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        console.log(util.inspect(res.matrix, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse option info", async () => {
        const data = await fs.readFile("test/optioninfo.html");

        const doc = cheerio.load(data);
        const res = await parseOptionDetails(doc);

        // console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });
});
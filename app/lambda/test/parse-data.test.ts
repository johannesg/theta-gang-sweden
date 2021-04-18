import * as fs from 'fs/promises';
import { parseOptionInfo, parseOptionsOverview, parseOptionsPage, parseStockList } from '../src/resolvers/parse-data';
import * as util from 'util';

import * as cheerio from 'cheerio';
import { transformOverview } from '../src/resolvers/transform-data';

describe("parse tests", () => {
    test("can parse stock list", async() => {
        const data = await fs.readFile("test/optionslist.html");

        const doc = cheerio.load(data);

        const res = parseStockList(doc);
        // console.log(res);
        expect(res).not.toBeNull();
        expect(res).toContainEqual({ id: "26188", name: "AAK"});
    });


    test("can parse options list", async () => {
        const data = await fs.readFile("test/optionslist.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsPage(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list 2", async () => {
        const data = await fs.readFile("test/optionslist2.html");

        const doc = cheerio.load(data);

        const res = await parseOptionsOverview(doc);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.options, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse options list 2 and transform", async () => {
        const data = await fs.readFile("test/optionslist2.html");

        const doc = cheerio.load(data);

        const overview = parseOptionsOverview(doc);
        const res = transformOverview(overview);
        // console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        // console.log(util.inspect(res.matrix, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse option info", async () => {
        const data = await fs.readFile("test/optioninfo.html");

        const doc = cheerio.load(data);
        const res = await parseOptionInfo(doc);

        // console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });
});
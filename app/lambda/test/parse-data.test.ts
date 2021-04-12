import * as fs from 'fs/promises';
import { parseOptionInfo, parseOptionsPage, parseStockList } from '../src/resolvers/parse-data';
import * as util from 'util';

import * as cheerio from 'cheerio';

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
        console.log(util.inspect(res.underlying, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse option info", async () => {
        const data = await fs.readFile("test/optioninfo.html");

        const doc = cheerio.load(data);
        const res = await parseOptionInfo(doc);

        console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });
});
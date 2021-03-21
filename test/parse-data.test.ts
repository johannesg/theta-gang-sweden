import * as fs from 'fs/promises';
import { parseOptionInfo, parseOptionsPage, parseStockList } from '../src/parse-data';
import { JSDOM } from 'jsdom';
import * as util from 'util';

describe("parse tests", () => {
    test.skip("can parse stock list", async() => {
        const data = await fs.readFile("test/optionslist.html");

        const dom = new JSDOM(data);

        const res = await parseStockList(dom.window.document);
        // console.log(res);
        expect(res).not.toBeNull();
        expect(res).toContainEqual({ id: "26188", name: "AAK"});
    });


    test.skip("can parse options list", async () => {
        const data = await fs.readFile("test/optionslist.html");

        const dom = new JSDOM(data);

        const res = await parseOptionsPage(dom.window.document);
        // console.log(res);
        console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });

    test("can parse option info", async () => {
        const data = await fs.readFile("test/optioninfo.html");

        const dom = new JSDOM(data);

        const res = await parseOptionInfo(dom.window.document);

        console.log(util.inspect(res, {showHidden: false, depth: null}))
        expect(res).not.toBeNull();
    });
});
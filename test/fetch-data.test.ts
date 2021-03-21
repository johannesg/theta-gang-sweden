import { getOptionsList, getOptionInfo } from "../src/fetch-data";
import * as fs from 'fs/promises';

describe.skip("fetch data tests", () => {
    test("can get options list", async () => {
        const res = await getOptionsList(52636);

        await fs.writeFile("optionslist.html", res);

        // console.log(res);
        expect(res).not.toBeNull();
    });

    test("can get options info", async () => {
        const res = await getOptionInfo('/optioner/om-optionen.html/1178323/noki1d36');

        await fs.writeFile("optioninfo.html", res);

        console.log(res);
        expect(res).not.toBeNull();

    });
});
import { getOptionsList, getOptionInfo } from "../src/resolvers/fetch-data";
import * as fs from 'fs/promises';
import { OptionType } from "../src/types";

describe.skip("fetch data tests", () => {
    test("can get options list", async () => {
        const res = await getOptionsList('52636', OptionType.Standard, "2021-05", "matrix");

        await fs.writeFile("optionslist.html", res);

        expect(res).not.toBeNull();
    });

    test("can get options info", async () => {
        const res = await getOptionInfo('/optioner/om-optionen.html/1178323/noki1d36');

        await fs.writeFile("optioninfo.html", res);

        expect(res).not.toBeNull();
    });
});
import { DateTime } from 'luxon';
import { getDaysFrom, getDaysFromNow, getNextMonth } from '../src/date';

describe("datetime tests", () => {
    test("next month", () => {
        // console.log(getNextMonth());
    })

    test("DTE", () => {
        expect(getDaysFrom("2021-05-07", "2021-05-06")).toBe(1);
        // expect(getDaysFromNow("2021-05-07")).toBe(1);
    });
});
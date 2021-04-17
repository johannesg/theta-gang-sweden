import { OptionMatrixItem, OptionsMatrix, OptionsWithExpiry } from "../types";
import { ParsedOptionsOverview } from "./parse-data";

export type ReduceResult = Record<string, Record<string, OptionMatrixItem>>

export function transformOverview(overview: ParsedOptionsOverview): OptionsMatrix {
    const lastPrice = overview.underlying.lastPrice!;
    const allOptions = overview.options.reduce<ReduceResult>((acc, cur) => {
        const key = cur.expires!;
        acc[key] = acc[key] || {};

        const strikes = acc[key];
        strikes[cur.strike!] = strikes[cur.strike!] || { strike: cur.strike! };

        const item = strikes[cur.strike!];

        switch (cur.type) {
            case "CALL": item.call = cur;
            case "PUT": item.put = cur;
        }

        return acc;
    }, {});

    const res: OptionsWithExpiry[] = Object.keys(allOptions)
        .map(expires => {
            const topt = Object.values(allOptions[expires]).sort((a, b) => a.strike! - b.strike!);
            const idx = topt.findIndex(item => lastPrice <= item.strike!);
            const start = Math.max(0, idx - 10);
            const options = topt.slice(start, start + 20);
            // console.log(`idx: ${idx}, start: ${start}, count: ${topt.length}`);
            return {
                expires,
                options
            };
        });

    return {
        underlying: overview.underlying,
        matrix: res.sort((a, b) => a.expires.localeCompare(b.expires))
    };
}
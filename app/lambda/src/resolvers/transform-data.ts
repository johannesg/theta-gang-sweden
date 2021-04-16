import { OptionMatrixItem, OptionsMatrix, OptionsWithExpiry } from "../types";
import { ParsedOptionsOverview } from "./parse-data";

export type ReduceResult = Record<string, Record<string, OptionMatrixItem>>

export function transformOverview(overview: ParsedOptionsOverview): OptionsMatrix {
    const lastPrice = overview.underlying.lastPrice!;
    const options = overview.options.reduce<ReduceResult>((acc, cur) => {
        const distance = Math.abs(cur.strike! - lastPrice) / lastPrice;
        if (distance > 0.20)
            return acc;

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

    const res: OptionsWithExpiry[] = [];

    Object.keys(options)
        .forEach(t => res.push({
            expires: t,
            options: Object.values(options[t]).sort((a, b) => a.strike! - b.strike!)
        }));

    return {
        underlying: overview.underlying,
        matrix: res.sort((a, b) => a.expires.localeCompare(b.expires))
    };
}
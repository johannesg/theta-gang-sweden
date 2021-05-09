import { html } from "cheerio";
import { OptionMatrixItem, OptionsMatrix, OptionsWithExpiry } from "../types";
import { ParsedOptionsData } from "./parse-data";

type ReduceResult = Map<string, Map<number, OptionMatrixItem>>

function compute<K,V>(m: Map<K,V>, key: K, fn: (key: K) => V): V {
    let val = m.get(key);
    if (val)
        return val;

    val = fn(key);
    m.set(key, val);
    return val;
}

export function transformOverview(overview: ParsedOptionsData): OptionsMatrix {
    const allOptions = Array.from(overview.options.values()).reduce<ReduceResult>((acc, cur) => {
        const key = cur.expires!;

        const strikes = compute(acc, key, k => new Map<number, OptionMatrixItem>());
        const item = compute(strikes, cur.strike!, strike => ({ strike }));

        switch (cur.type) {
            case "CALL":
                item.call = cur;
                break;
            case "PUT":
                item.put = cur;
                break;
        }

        return acc;
    }, new Map());

    const lastPrice = overview.underlying.lastPrice!;
    const res: OptionsWithExpiry[] = Array.from(allOptions.keys())
        .map(expires => {
            const options = Array.from(allOptions.get(expires)!.values()).sort((a, b) => a.strike! - b.strike!);
            // const idx = topt.findIndex(item => lastPrice <= item.strike!);
            // const start = Math.max(0, idx - 10);
            // const options = topt.slice(start, start + 20);
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
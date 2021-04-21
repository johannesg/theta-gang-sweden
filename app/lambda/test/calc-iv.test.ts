//
// Credits: https://kevinpmooney.blogspot.com/2017/07/calculating-implied-volatility-from.html
//
import { jStat } from 'jstat';

const { sqrt, pow, log, exp, abs } = Math;

function norm_cdf(z: number) {
    var mean = 0, sd = 1;
    return jStat.normal.cdf(z, mean, sd);
}

function norm_pdf(z: number) {
    var mean = 0, sd = 1;
    return jStat.normal.pdf(z, mean, sd);
}

function d(sigma: number, S: number, K: number, r: number, t: number) : [ number, number ] {
    const d1 = 1 / (sigma * sqrt(t)) * ( log(S/K) + (r + pow(sigma, 2) / 2) * t);
    const d2 = d1 - sigma * sqrt(t);
    return [d1, d2];
}

function call_price(sigma: number, S: number, K: number, r: number, t: number, d1: number, d2: number) : number {
    return norm_cdf(d1) * S - norm_cdf(d2) * K * exp(-r * t);
}

function calc_iv(underlying: number, strike: number, dte: number, interest: number, callPrice: number) : number {
    const [ S, K, r, t, C0 ] = [ underlying, strike, interest, dte / 365, callPrice ];

    const [abstol, max_iter] = [1e-4, 1e3];

    let [epsilon, i, vol] = [1.0, 0, 0.5];

    while (epsilon > abstol) {
        if (i > max_iter)
            throw "Failed to find root. Too many iterations";

        i++;
        const orig = vol;
        const [d1, d2] = d(vol, S, K, r, t);
        const fun_val = call_price(vol, S, K, r, t, d1, d2) - C0;
        const vega = S * norm_pdf(d1) * sqrt(t);
        vol = -fun_val / vega + vol;
        epsilon = abs(fun_val);
    }

    return vol;
}

describe("calculate IV", () => {
    const underlying = 100;
    const strike = 105;

    const interest = 0.01;
    const dte = 30;

    const callPrice = 2.30;

    const vol = 0.50;

    test("IV", () => {
        expect(calc_iv(underlying, strike, dte, interest, callPrice)).toBe(0.3688563249143389);
    });
});

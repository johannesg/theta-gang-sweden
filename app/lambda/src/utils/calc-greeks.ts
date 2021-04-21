//
// Formulas calculating greeks originally by Michael Rechenthin, PhD
// https://www.tastytrade.com/shows/the-skinny-on-options-data-science/episodes/option-pricing-calculator-10-06-2016
//
// Formula for IV originally by Kevin Mooney.
// https://kevinpmooney.blogspot.com/2017/07/calculating-implied-volatility-from.html
//
import { jStat } from 'jstat';

const { abs, sqrt, pow, log, exp } = Math;

function norm_cdf(z: number) {
    var mean = 0, sd = 1;
    return jStat.normal.cdf(z, mean, sd);
}

function norm_pdf(z: number) {
    var mean = 0, sd = 1;
    return jStat.normal.pdf(z, mean, sd);
}

function d(vol: number, S: number, K: number, r: number, t: number) : [ number, number ] {
    const d1 = 1 / (vol * sqrt(t)) * ( log(S/K) + (r + pow(vol, 2) / 2) * t);
    const d2 = d1 - vol * sqrt(t);
    return [d1, d2];
}

function d_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    const a = (vol * sqrt(dte));
    const b = log(underlying / strike);
    const c = pow(vol, 2);

    return (1 / a) * (b + (interest + (c) / 2) * dte)
}

function Nd_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    const a = pow(d_one(underlying, strike, dte, vol, interest), 2);
    const b = sqrt(2 * 3.14159);
    return exp(-a / 2) / (b);
}

function d_two(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    return d_one(underlying, strike, dte, vol, interest) - vol * sqrt(dte)
}

export function calc_price_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return norm_cdf(d_one(underlying, strike, dte, vol, interest)) * underlying - norm_cdf(d_two(underlying, strike, dte, vol, interest)) * strike * exp(-interest * dte)
}

export function calc_price_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return norm_cdf(-d_two(underlying, strike, dte, vol, interest)) * strike * exp((-interest) * dte) - norm_cdf(-d_one(underlying, strike, dte, vol, interest)) * underlying
}

export function calc_delta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365;
    return norm_cdf(d_one(underlying, strike, dte, vol, interest))
}

export function calc_delta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return norm_cdf(d_one(underlying, strike, dte, vol, interest)) - 1
}

export function calc_gamma(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return Nd_one(underlying, strike, dte, vol, interest) / (underlying * (vol * sqrt(dte)))
}

export function calc_vega(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return underlying * Nd_one(underlying, strike, dte, vol, interest) * sqrt(dte) * 0.01
}

export function calc_rho_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return strike * dte * exp(-interest * dte) * norm_cdf(d_two(underlying, strike, dte, vol, interest)) * 0.01
}

export function calc_rho_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return -strike * dte * exp(-interest * dte) * norm_cdf(-d_two(underlying, strike, dte, vol, interest)) * 0.01
}

export function calc_theta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return (-(underlying * vol * Nd_one(underlying, strike, dte, vol, interest)) / (2 * sqrt(dte)) - interest * strike * exp(-interest * (dte)) * norm_cdf(d_two(underlying, strike, dte, vol, interest))) / 365
}

export function calc_theta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return (-(underlying * vol * Nd_one(underlying, strike, dte, vol, interest)) / (2 * sqrt(dte)) + interest * strike * exp(-interest * (dte)) * norm_cdf(-d_two(underlying, strike, dte, vol, interest))) / 365
}

function call_price(sigma: number, S: number, K: number, r: number, t: number, d1: number, d2: number) : number {
    return norm_cdf(d1) * S - norm_cdf(d2) * K * exp(-r * t);
}

export function calc_iv(underlying: number, strike: number, dte: number, interest: number, callPrice: number) : number {
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

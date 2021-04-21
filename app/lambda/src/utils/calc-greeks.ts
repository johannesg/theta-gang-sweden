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

// S = underlying price
// K = strike
// t = time to expiration in years
// r = risk free interest
// sigma = implied volatility

function d(sigma: number, S: number, K: number, r: number, t: number): [number, number] {
    const d1 = 1 / (sigma * sqrt(t)) * (log(S / K) + (r + pow(sigma, 2) / 2) * t);
    const d2 = d1 - sigma * sqrt(t);
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

function _calc_price_call(S: number, K: number, r: number, t: number, d1: number, d2: number): number {
    return norm_cdf(d1) * S - norm_cdf(d2) * K * exp(-r * t);
}

function _calc_price_put(S: number, K: number, r: number, t: number, d1: number, d2: number): number {
    return -norm_cdf(-d1) * S + norm_cdf(-d2) * K * exp(-r * t) ;
}

export function calc_price_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, d2] = d(vol, underlying, strike, interest, t);
    return _calc_price_call(underlying, strike, interest, t, d1, d2);
}

export function calc_price_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, d2] = d(vol, underlying, strike, interest, t);
    return _calc_price_put(underlying, strike, t, interest, d1, d2);
}

export function calc_delta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, _] = d(vol, underlying, strike, interest, t);
    return norm_cdf(d1);
}

export function calc_delta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, _] = d(vol, underlying, strike, interest, t);
    return norm_cdf(d1) - 1
}

export function calc_gamma(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365
    return Nd_one(underlying, strike, t, vol, interest) / (underlying * (vol * sqrt(t)))
}

export function calc_vega2(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r] = [underlying, strike, dte / 365, interest];
    const [d1, d2] = d(vol, S, K, r, t);
    const v = S * norm_pdf(d1) * sqrt(t);
    return v;
}

export function calc_vega(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365
    return underlying * Nd_one(underlying, strike, t, vol, interest) * sqrt(t) * 0.01
        // const vega = S * norm_pdf(d1) * sqrt(t);
        // return vega(vol, underlying, strike, interest, t);

    // const a = pow(d_one(underlying, strike, dte, vol, interest), 2);
    // const b = sqrt(2 * 3.14159);
    // return exp(-a / 2) / (b);
}

export function calc_rho_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [_, d2] = d(vol, underlying, strike, interest, t);
    return strike * t * exp(-interest * t) * norm_cdf(d2) * 0.01
}

export function calc_rho_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [_, d2] = d(vol, underlying, strike, interest, t);
    return -strike * t * exp(-interest * t) * norm_cdf(-d2) * 0.01
}

export function calc_theta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [_, d2] = d(vol, underlying, strike, interest, t);
    return (-(underlying * vol * Nd_one(underlying, strike, t, vol, interest))
        / (2 * sqrt(t)) - interest * strike * exp(-interest * (t)) 
        * norm_cdf(d2)) / 365
}

export function calc_theta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [_, d2] = d(vol, underlying, strike, interest, t);
    return (-(underlying * vol * Nd_one(underlying, strike, t, vol, interest))
        / (2 * sqrt(t)) + interest * strike * exp(-interest * (t))
        * norm_cdf(-d2)) / 365
}

function _calc_iv(underlying: number, strike: number, dte: number, interest: number,
     price: number, pricefn: Function): number {
    const [S, K, r, t] = [underlying, strike, interest, dte / 365];

    const [tol, max_iter] = [1e-4, 1e3];

    let [epsilon, i, vol] = [1.0, 0, 0.5];

    while (epsilon > tol) {
        if (i > max_iter)
            throw "Failed to find root. Too many iterations";

        i++;
        const orig_vol = vol;
        const [d1, d2] = d(vol, S, K, r, t);
        const fun_val = pricefn(S, K, r, t, d1, d2) - price;
        const vega = S * norm_pdf(d1) * sqrt(t);
        vol = -fun_val / vega + vol;
        epsilon = abs( (vol - orig_vol) / orig_vol);
    }

    return vol;
}

export function calc_iv_call(underlying: number, strike: number, dte: number, interest: number, price: number): number {
    return _calc_iv(underlying, strike, dte, interest, price, _calc_price_call);
}

export function calc_iv_put(underlying: number, strike: number, dte: number, interest: number, price: number): number {
    return _calc_iv(underlying, strike, dte, interest, price, _calc_price_put);
}

//
// Formulas calculating greeks originally by Michael Rechenthin, PhD
// https://www.tastytrade.com/shows/the-skinny-on-options-data-science/episodes/option-pricing-calculator-10-06-2016
//
// Formula for IV originally by Kevin Mooney.
// https://kevinpmooney.blogspot.com/2017/07/calculating-implied-volatility-from.html
//
// Huge inspiration from this github repo: https://github.com/kpmooney/numerical_methods_youtube
//
import { jStat } from 'jstat';

const { abs, sqrt, pow, log, exp } = Math;

function norm_cdf(z: number) : number {
    var mean = 0, sd = 1;
    return jStat.normal.cdf(z, mean, sd);
}

function norm_pdf(z: number) : number {
    var mean = 0, sd = 1;
    return jStat.normal.pdf(z, mean, sd);
}

// S = underlying price
// K = strike
// t = time to expiration in years
// r = risk free interest
// sigma = implied volatility

function d(sigma: number, S: number, K: number, r: number, t: number): [d1: number, d2: number] {
    const d1 = 1 / (sigma * sqrt(t)) * (log(S / K) + (r + pow(sigma, 2) / 2) * t);
    const d2 = d1 - sigma * sqrt(t);
    return [d1, d2];
}

// function d_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
//     const a = (vol * sqrt(dte));
//     const b = log(underlying / strike);
//     const c = pow(vol, 2);

//     return (1 / a) * (b + (interest + (c) / 2) * dte)
// }

// function Nd_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
//     const a = pow(d_one(underlying, strike, dte, vol, interest), 2);
//     const b = sqrt(2 * 3.14159);
//     return exp(-a / 2) / (b);
// }

// function d_two(underlying: number, strike: number, dte: number, vol: number, interest: number) {
//     return d_one(underlying, strike, dte, vol, interest) - vol * sqrt(dte)
// }

function _price_call(S: number, K: number, r: number, t: number, d1: number, d2: number): number {
    return norm_cdf(d1) * S - norm_cdf(d2) * K * exp(-r * t);
}

function _price_put(S: number, K: number, r: number, t: number, d1: number, d2: number): number {
    return -norm_cdf(-d1) * S + norm_cdf(-d2) * K * exp(-r * t);
}

function _delta_call(d1: number) {
    return norm_cdf(d1);
}

function _delta_put(d1: number) {
    return norm_cdf(d1) - 1
}

function _gamma(S: number, K: number, t: number, r: number, vol: number, d2: number) : number {
    return (K * exp(-r * t) * (norm_pdf(d2) / (pow(S, 2) * vol * sqrt(t))));
}

function _theta_call(S: number, K: number, t: number, r: number, sigma: number, d1: number, d2: number): number {
    return -S * sigma * norm_pdf(d1) / (2 * sqrt(t)) - r * K * exp(-r * t) * norm_cdf(d2)
}

function _theta_put(S: number, K: number, t: number, r: number, sigma: number, d1: number, d2: number): number {
    return -S * sigma * norm_pdf(-d1) / (2 * sqrt(t)) - r * K * exp(-r * t) * norm_cdf(-d2)
}

function _vega(S: number, t: number, d1: number): number {
    return S * norm_pdf(d1) * sqrt(t);
}

function _rho_call(K: number, t: number, r: number, d2: number): number {
    return K * t * exp(-r * t) * norm_cdf(d2) * 0.01
}

function _rho_put(K: number, t: number, r: number, d2: number): number {
    return -K * t * exp(-r * t) * norm_cdf(-d2) * 0.01
}

function _calc_iv(S: number, K: number, t: number, r: number,
    price: number, calc_price: Function): number {

    const [tol, max_iter] = [1e-4, 1e3];

    let [epsilon, i, vol] = [1.0, 0, 0.5];

    while (epsilon > tol) {
        if (i > max_iter)
            throw "Failed to find root. Too many iterations";

        i++;
        const orig_vol = vol;
        const [d1, d2] = d(vol, S, K, r, t);
        const fun_val = calc_price(S, K, r, t, d1, d2) - price;
        const vega = _vega(S, t, d1);
        vol = -fun_val / vega + vol;
        epsilon = abs((vol - orig_vol) / orig_vol);
    }

    return vol;
}



export function calc_price_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, d2] = d(vol, underlying, strike, interest, t);
    return _price_call(underlying, strike, interest, t, d1, d2);
}

export function calc_price_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1, d2] = d(vol, underlying, strike, interest, t);
    return _price_put(underlying, strike, t, interest, d1, d2);
}

export function calc_delta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1] = d(vol, underlying, strike, interest, t);
    return _delta_call(d1);
}

export function calc_delta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const t = dte / 365;
    const [d1] = d(vol, underlying, strike, interest, t);
    return _delta_put(d1);
}

export function calc_gamma(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r] = [underlying, strike, dte / 365, interest];
    const [, d2] = d(vol, underlying, strike, interest, t);
    return _gamma(S, K, t, r, vol, d2);
}

// export function calc_gamma(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
//     const t = dte / 365
//     return Nd_one(underlying, strike, t, vol, interest) / (underlying * (vol * sqrt(t)))
// }

export function calc_vega(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r] = [underlying, strike, dte / 365, interest];
    const [d1] = d(vol, S, K, r, t);
    const v = _vega(S, t, d1);
    return v / 100;
}

// export function calc_vega(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
//     const t = dte / 365
//     return underlying * Nd_one(underlying, strike, t, vol, interest) * sqrt(t) * 0.01
// }

export function calc_rho_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r, sigma] = [underlying, strike, dte / 365, interest, vol];
    const [_, d2] = d(sigma, S, K, r, t);
    return _rho_call(K, t, r, d2);
}

export function calc_rho_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r, sigma] = [underlying, strike, dte / 365, interest, vol];
    const [_, d2] = d(sigma, S, K, r, t);
    return _rho_put(K, t, r, d2);
}

// export function calc_theta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
//     const t = dte / 365;
//     const [_, d2] = d(vol, underlying, strike, interest, t);
//     return (-(underlying * vol * Nd_one(underlying, strike, t, vol, interest))
//         / (2 * sqrt(t)) - interest * strike * exp(-interest * (t))
//         * norm_cdf(d2)) / 365
// }

// export function calc_theta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
//     const t = dte / 365;
//     const [_, d2] = d(vol, underlying, strike, interest, t);
//     return (-(underlying * vol * Nd_one(underlying, strike, t, vol, interest))
//         / (2 * sqrt(t)) + interest * strike * exp(-interest * (t))
//         * norm_cdf(-d2)) / 365
// }

export function calc_theta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r, sigma] = [underlying, strike, dte / 365, interest, vol];
    const [d1, d2] = d(sigma, S, K, r, t);
    const theta = _theta_call(S, K, t, r, sigma, d1, d2);

    return theta / 365;
}

export function calc_theta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    const [S, K, t, r, sigma] = [underlying, strike, dte / 365, interest, vol];
    const [d1, d2] = d(sigma, S, K, r, t);
    const theta = _theta_put(S, K, t, r, sigma, d1, d2);

    return theta / 365;
}

export function calc_iv_call(underlying: number, strike: number, dte: number, interest: number, price: number): number {
    const t = dte / 365;
    return _calc_iv(underlying, strike, t, interest, price, _price_call);
}

export function calc_iv_put(underlying: number, strike: number, dte: number, interest: number, price: number): number {
    const t = dte / 365;
    return _calc_iv(underlying, strike, t, interest, price, _price_put);
}

export type OptionInfo = {
    underlyingPrice: number,
    price: number
    strike: number,
    daysToExpiration: number,
    riskFreeInterestRate: number,
}

export type OptionGreeks = {
    iv: number,
    delta: number,
    gamma: number,
    theta: number,
    vega: number,
    rho: number
}

export function calcGreeksCall(info: OptionInfo) : OptionGreeks {
    const [S, K, r, t, price] = [info.underlyingPrice, info.strike, info.riskFreeInterestRate, info.daysToExpiration / 365, info.price];

    const sigma = _calc_iv(S, K, t, r, price, _price_call);
    if (!sigma)
        return { iv: 0, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0};

    const [d1, d2] = d(sigma, S, K, r, t);
    const delta = _delta_call(d1);
    const gamma = _gamma(S, K, t, r, sigma, d2);
    const theta = _theta_call(S, K, t, r, sigma, d1, d2) / 365;
    const vega = _vega(S, t, d1) / 100;
    const rho = _rho_call(K, t, r, d2);

    return { iv: sigma, delta, gamma, theta, vega, rho };
}

export function calcGreeksPut(info: OptionInfo) {
    const [S, K, r, t, price] = [info.underlyingPrice, info.strike, info.riskFreeInterestRate, info.daysToExpiration / 365, info.price];

    const sigma = _calc_iv(S, K, t, r, price, _price_put);
    if (!sigma)
        return { iv: 0, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0};

    const [d1, d2] = d(sigma, S, K, r, t);
    const delta = _delta_put(d1);
    const gamma = _gamma(S, K, t, r, sigma, d2);
    const theta = _theta_put(S, K, t, r, sigma, d1, d2) / 365;
    const vega = _vega(S, t, d1) / 100;
    const rho = _rho_put(K, t, r, d2);

    return { iv: sigma, delta, gamma, theta, vega, rho };
}
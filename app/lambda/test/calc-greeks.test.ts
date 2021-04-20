//
// Formulas extracted from options calculator by Michael Rechenthin, PhD
// https://www.tastytrade.com/shows/the-skinny-on-options-data-science/episodes/option-pricing-calculator-10-06-2016
//
import { jStat } from 'jstat';

function normsdist(z: number) {
    var mean = 0, sd = 1;
    return jStat.normal.cdf(z, mean, sd);
}

function d_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    const a = (vol * Math.sqrt(dte));
    const b = Math.log(underlying / strike);
    const c = Math.pow(vol, 2);

    return (1 / a) * (b + (interest + (c) / 2) * dte)
}

function Nd_one(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    const a = Math.pow(d_one(underlying, strike, dte, vol, interest), 2);
    const b = Math.sqrt(2 * 3.14159);
    return Math.exp(-a / 2) / (b);
}

function d_two(underlying: number, strike: number, dte: number, vol: number, interest: number) {
    return d_one(underlying, strike, dte, vol, interest) - vol * Math.sqrt(dte)
}

function calc_price_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return normsdist(d_one(underlying, strike, dte, vol, interest)) * underlying - normsdist(d_two(underlying, strike, dte, vol, interest)) * strike * Math.exp(-interest * dte)
}

function calc_price_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return normsdist(-d_two(underlying, strike, dte, vol, interest)) * strike * Math.exp((-interest) * dte) - normsdist(-d_one(underlying, strike, dte, vol, interest)) * underlying
}

function calc_delta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365;
    return normsdist(d_one(underlying, strike, dte, vol, interest))
}

function calc_delta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return normsdist(d_one(underlying, strike, dte, vol, interest)) - 1
}

function calc_gamma(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return Nd_one(underlying, strike, dte, vol, interest) / (underlying * (vol * Math.sqrt(dte)))
}

function calc_vega(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return underlying * Nd_one(underlying, strike, dte, vol, interest) * Math.sqrt(dte) * 0.01
}

function calc_rho_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return strike * dte * Math.exp(-interest * dte) * normsdist(d_two(underlying, strike, dte, vol, interest)) * 0.01
}

function calc_rho_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return -strike * dte * Math.exp(-interest * dte) * normsdist(-d_two(underlying, strike, dte, vol, interest)) * 0.01
}

function calc_theta_call(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return (-(underlying * vol * Nd_one(underlying, strike, dte, vol, interest)) / (2 * Math.sqrt(dte)) - interest * strike * Math.exp(-interest * (dte)) * normsdist(d_two(underlying, strike, dte, vol, interest))) / 365
}

function calc_theta_put(underlying: number, strike: number, dte: number, vol: number, interest: number): number {
    dte = dte / 365
    return (-(underlying * vol * Nd_one(underlying, strike, dte, vol, interest)) / (2 * Math.sqrt(dte)) + interest * strike * Math.exp(-interest * (dte)) * normsdist(-d_two(underlying, strike, dte, vol, interest))) / 365
}

describe("calculate greeks", () => {
    const underlyingPrice = 50;
    const strike = 45;
    const dte = 40;
    const vol = 0.20;
    const interest = 0.003;

    test("delta call", () => {
        expect(calc_price_call(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("5.0883800");
        expect(calc_price_put(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("0.0735879");
        expect(calc_delta_call(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("0.9483874");
        expect(calc_delta_put(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("-0.0516126");
        expect(calc_gamma(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("0.0319523");
        expect(calc_vega(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("0.0175081");
        expect(calc_theta_call(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("-0.0047250");
        expect(calc_theta_put(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("-0.0043552");
        expect(calc_rho_call(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("0.0463901");
        expect(calc_rho_put(underlyingPrice, strike, dte, vol, interest).toFixed(7)).toBe("-0.0029087");
    });
});
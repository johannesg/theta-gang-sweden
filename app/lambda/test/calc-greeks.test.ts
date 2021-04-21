import { calc_delta_call, calc_delta_put, calc_gamma, calc_iv, calc_price_call, calc_price_put, calc_rho_call, calc_rho_put, calc_theta_call, calc_theta_put, calc_vega } from '../src/utils/calc-greeks';

describe("calculate greeks", () => {
    const underlying = 50;
    const strike = 45;
    const dte = 40;
    const vol = 0.20;
    const interest = 0.003;

    test("price", () => {
        expect(calc_price_call(underlying, strike, dte, vol, interest)).toBe(5.088380000200118);
        expect(calc_price_put(underlying, strike, dte, vol, interest)).toBe(0.07358791136165532);
    });
    test("delta", () => {
        expect(calc_delta_call(underlying, strike, dte, vol, interest)).toBe(0.9483873825790621);
        expect(calc_delta_put(underlying, strike, dte, vol, interest)).toBe(-0.05161261742093792);
    });
    test("gamma", () => {
        expect(calc_gamma(underlying, strike, dte, vol, interest)).toBe(0.03195231728952847);
    });
    test("theta", () => {
        expect(calc_theta_call(underlying, strike, dte, vol, interest)).toBe(-0.004724955703733377);
        expect(calc_theta_put(underlying, strike, dte, vol, interest)).toBe(-0.004355214268847118);
    });
    test("vega", () => {
        expect(calc_vega(underlying, strike, dte, vol, interest)).toBe(0.017508119062755328);
    });
    test("rho", () => {
        expect(calc_rho_call(underlying, strike, dte, vol, interest)).toBe(0.046390125072606016);
        expect(calc_rho_put(underlying, strike, dte, vol, interest)).toBe(-0.002908732912228553);
    });
});

describe("calculate IV", () => {
    const underlying = 100;
    const strike = 105;

    const interest = 0.01;
    const dte = 30;

    const callPrice = 2.30;

    test("IV", () => {
        expect(calc_iv(underlying, strike, dte, interest, callPrice)).toBe(0.3688563249143389);
    });
});
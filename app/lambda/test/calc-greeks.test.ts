import { calc_delta_call, calc_delta_put, calc_gamma, calc_iv_call, calc_iv_put, calc_price_call, calc_price_put, calc_rho_call, calc_rho_put, calc_theta_call, calc_theta_put, calc_vega } from '../src/utils/calc-greeks';

describe("calculate greeks", () => {
    const underlying = 50;
    const strike = 45;
    const dte = 40;
    const vol = 0.20;
    const interest = 0.003;

    test("price", () => {
        expect(calc_price_call(underlying, underlying - 5, dte, vol, interest)).toBe(5.088380000200118);
        expect(calc_price_put(underlying, underlying - 5, dte, vol, interest)).toBe(0.07358791136165532);
        expect(calc_price_call(underlying, underlying, dte, vol, interest)).toBe(1.3284438205903086);
        expect(calc_price_put(underlying, underlying, dte, vol, interest)).toBe(1.3120081663253593);
        expect(calc_price_call(underlying, underlying + 5, dte, vol, interest)).toBe(0.11785618156992461);
        expect(calc_price_put(underlying, underlying + 5, dte, vol, interest)).toBe(5.099776961878476);
    });
    test("delta", () => {
        expect(calc_delta_call(underlying, underlying - 5, dte, vol, interest)).toBe(0.9483873825790621);
        expect(calc_delta_put(underlying, underlying - 5, dte, vol, interest)).toBe(-0.05161261742093792);
        expect(calc_delta_call(underlying, underlying, dte, vol, interest)).toBe(0.5151840132766417);
        expect(calc_delta_put(underlying, underlying, dte, vol, interest)).toBe(-0.48481598672335835);
        expect(calc_delta_call(underlying, underlying + 5, dte, vol, interest)).toBe(0.0805357799996716);
        expect(calc_delta_put(underlying, underlying + 5, dte, vol, interest)).toBe(-0.9194642200003285);
    });
    test("gamma", () => {
        expect(calc_gamma(underlying, underlying - 5, dte, vol, interest)).toBe(0.03195231728952847);
        expect(calc_gamma(underlying, underlying, dte, vol, interest)).toBe(0.12042370119920676);
        expect(calc_gamma(underlying, underlying + 5, dte, vol, interest)).toBe(0.045135654795373105);
    });
    test("theta", () => {
        expect(calc_theta_call(underlying, underlying - 5, dte, vol, interest)).toBe(-0.004724955703733377);
        expect(calc_theta_put(underlying, underlying - 5, dte, vol, interest)).toBe(-0.004355214268847118);
        expect(calc_theta_call(underlying, underlying, dte, vol, interest)).toBe(-0.0166971981657262);
        expect(calc_theta_put(underlying, underlying, dte, vol, interest)).toBe(-0.016286374349185912);
        expect(calc_theta_call(underlying, underlying + 5, dte, vol, interest)).toBe(-0.006215094625270948);
        expect(calc_theta_put(underlying, underlying + 5, dte, vol, interest)).toBe(-0.005763188427076632);
    });
    test("vega", () => {
        expect(calc_vega(underlying, underlying - 5, dte, vol, interest)).toBe(0.017508119062755328);
        expect(calc_vega(underlying, underlying, dte, vol, interest)).toBe(0.06598558969819548);
        expect(calc_vega(underlying, underlying + 5, dte, vol, interest)).toBe(0.024731865641300334);
    });
    test("rho", () => {
        expect(calc_rho_call(underlying, underlying - 5, dte, vol, interest)).toBe(0.046390125072606016);
        expect(calc_rho_put(underlying, underlying - 5, dte, vol, interest)).toBe(-0.002908732912228553);
        expect(calc_rho_call(underlying, underlying, dte, vol, interest)).toBe(0.02677343215697728);
        expect(calc_rho_put(underlying, underlying, dte, vol, interest)).toBe(-0.028003076715061116);
        expect(calc_rho_call(underlying, underlying + 5, dte, vol, interest)).toBe(0.004283761992782088);
        expect(calc_rho_put(underlying, underlying + 5, dte, vol, interest)).toBe(-0.05597039776646016);
    });
});

describe("calculate IV", () => {
    const underlying = 100;
    const strike = 105;

    const interest = 0.01;
    const dte = 30;

    const price = 2.30;

    test("IV Call", () => {
        expect(calc_iv_call(underlying, 105, dte, interest, price)).toBe(0.3688563249143389);
        expect(calc_iv_call(underlying, 100, dte, interest, price)).toBe(0.19759119494593871);
        // expect(calc_iv_call(underlying, 95, dte, interest, price)).toBe(0.3688563249143389);
    });

    test("IV Put", () => {
        expect(calc_iv_put(underlying, 95, dte, interest, price)).toBe(0.3931007096285325);
        expect(calc_iv_put(underlying, 100, dte, interest, price)).toBe(0.20478119460977465);
        // expect(calc_iv_put(underlying, 105, dte, interest, price)).toBe(0.3931007096285325);
    });
});
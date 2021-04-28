import { calcGreeksCall, calcGreeksPut, calc_delta_call, calc_delta_put, calc_gamma, calc_iv_call, calc_iv_put, calc_price_call, calc_price_put, calc_rho_call, calc_rho_put, calc_theta_call, calc_theta_put, calc_vega } from '../src/calc-greeks';

describe("calculate greeks", () => {
    const underlying = 50;
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
        expect(calc_gamma(underlying, underlying - 5, dte, vol, interest)).toBe(0.03195230379504172);
        expect(calc_gamma(underlying, underlying, dte, vol, interest)).toBe(0.12042365034042156);
        expect(calc_gamma(underlying, underlying + 5, dte, vol, interest)).toBe(0.04513563573314076);
    });
    test("theta", () => {
        expect(calc_theta_call(underlying, underlying - 5, dte, vol, interest)).toBe(-0.004724953855173549);
        expect(calc_theta_put(underlying, underlying - 5, dte, vol, interest)).toBe(-0.0043988434139707175);
        expect(calc_theta_call(underlying, underlying, dte, vol, interest)).toBe(-0.016697191198769328);
        expect(calc_theta_put(underlying, underlying, dte, vol, interest)).toBe(-0.016706413532954954);
        expect(calc_theta_call(underlying, underlying + 5, dte, vol, interest)).toBe(-0.006215092014006244);
        expect(calc_theta_put(underlying, underlying + 5, dte, vol, interest)).toBe(-0.006602741782308831);
    });
    test("vega", () => {
        expect(calc_vega(underlying, underlying - 5, dte, vol, interest)).toBe(0.01750811166851601);
        expect(calc_vega(underlying, underlying, dte, vol, interest)).toBe(0.06598556183036798);
        expect(calc_vega(underlying, underlying + 5, dte, vol, interest)).toBe(0.024731855196241517);
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

    test("IV Call", () => {
        const underlying = 100;
        const interest = 0.01;
        const dte = 30;
        const price = 2.30;
        expect(calc_iv_call(underlying, 105, dte, interest, price)).toBe(0.3688563249143389);
        expect(calc_iv_call(underlying, 100, dte, interest, price)).toBe(0.19759119494593871);
        // expect(calc_iv_call(underlying, underlying - 5, dte, interest, price)).toBe(0.3688563249143389);
    });

    test("IV Put", () => {
        const underlying = 100;
        const interest = 0.01;
        const dte = 30;
        const price = 2.30;
        expect(calc_iv_put(underlying, underlying - 5, dte, interest, price)).toBe(0.3931007096285325);
        expect(calc_iv_put(underlying, underlying, dte, interest, price)).toBe(0.20478119460977465);
        // expect(calc_iv_put(underlying, underlying + 5, dte, interest, price)).toBe(0.3931007096285325);
    });


    const strikes: [cbid: number, cask: number, strike: number, pbid: number, pask: number, civ: number, piv: number][] = [
        [14.75, 15.75, 190, 1.20, 1.60, 0.25525683864819165, 0.2696559917004907],
        [10.75, 11.75, 195, 2.00, 2.50, 0.24965897976004325, 0.2523352851014894],
        [7.20, 8.00, 200, 3.30, 4.00, 0.2347685690355809, 0.2392617767685735],
        [4.40, 4.95, 205, 5.40, 6.10, 0.22337272395086133, 0.22865990687351023],
        [2.45, 2.95, 210, 8.30, 9.20, 0.22069156751757504, 0.2252211526981929],
        [1.15, 1.65, 215, 11.75, 13.00, 0.21721197055570407, 0.21834860022765754]
    ];

    test.each(strikes)(`H&M. %d,%d --- %d --- %d,%d`, (cbid, cask, strike, pbid, pask, civ, piv) => {
        const cprice = (cbid + cask) / 2;
        const pprice = (pbid + pask) / 2;
        const underlying = 204.10;
        const interest = -0.0033
        const dte = 29;
        expect(calc_iv_call(underlying, strike, dte, interest, cprice)).toBe(civ);
        expect(calc_iv_put(underlying, strike, dte, interest, pprice)).toBe(piv);
    });

    test.each(strikes)(`H&M all. %d,%d --- %d --- %d,%d`, (cbid, cask, strike, pbid, pask, civ, piv) => {
        const cprice = (cbid + cask) / 2;
        const pprice = (pbid + pask) / 2;
        const underlying = 204.10;
        const interest = -0.0033
        const dte = 29;

        // TODO: verify all greeks
        let res = calcGreeksCall({ underlyingPrice: underlying, price: cprice, daysToExpiration: dte, riskFreeInterestRate: interest, strike });
        expect(res).toMatchObject({ iv: civ });
        // console.log(res);

        res = calcGreeksPut({ underlyingPrice: underlying, price: pprice, daysToExpiration: dte, riskFreeInterestRate: interest, strike });
        expect(res).toMatchObject({ iv: piv });
        // console.log(res);
    });
});
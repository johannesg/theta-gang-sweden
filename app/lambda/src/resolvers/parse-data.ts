import numeral from '../utils/numeral';
import { CallOrPutType, Instrument, InstrumentDetails, OptionDetails, OptionMatrixItem, OptionType } from '../types';

export function parseStockList($: cheerio.Selector): Instrument[] {
    return $("#underlyingInstrumentId")
        .children()
        .map((i, e) => {
            const t = e as cheerio.TagElement;
            return {
                id: t.attribs["value"],
                name: t.lastChild?.data?.trim()
            };
        }).get();
}

export async function parseOptionsPage($: cheerio.Selector) {
    const listFilterResult = $("#listFilterResult");

    const underlyingTable = listFilterResult.find("table.optionLists").first();
    const optionsTable = listFilterResult.find("table.optionMatrix").first();


    return {
        underlying: parseUnderlyingTable(underlyingTable),
        options: parseOptionsTable($, optionsTable)
    };
}

function parseUnderlyingTable(table: cheerio.Cheerio): InstrumentDetails {
    const getAttr = (name: string) => {
        var value = table.find(`td.${name}`).text();

        return {
            num: () => {
                return { [name]: numeral(value).value() };
            },
            percent: () => {
                return { [name]: (numeral(value).value() ?? 0) / 100 };
            },
            time: () => {
                return { [name]: value };
            }
        };
    };

    var nameNode = table.find("td.instrumentName a");
    return {
        name: nameNode.attr("title") ?? "",
        href: nameNode.attr("href") ?? "",

        ...getAttr("change").num(),
        ...getAttr("changePercent").percent(),
        ...getAttr("buyPrice").num(),
        ...getAttr("sellPrice").num(),
        ...getAttr("highestPrice").num(),
        ...getAttr("lowestPrice").num(),
        ...getAttr("lastPrice").num(),
        ...getAttr("updated").time(),
        ...getAttr("totalVolumeTraded").num(),
    };
}

function parseOptionsTable($: cheerio.Selector, table: cheerio.Cheerio): OptionMatrixItem[] {
    return table.find("tbody > tr")
        .map((i, elem) => parseOptionItem(i, $(elem)))
        .get();
}

function parseOptionItem(i: number, tr: cheerio.Cheerio): OptionMatrixItem {
    const getName = (cl: string): { name: string, href: string } => {
        var nameNode = tr.find(`td.matrix.${cl}.instrumentName a`);

        return {
            name: nameNode.attr("title") ?? "",
            href: nameNode.attr("href") ?? "",
        };
    };

    const getAttr = (i: number): number => {
        const val = tr.find("td").eq(i).text();
        // return val;
        return numeral(val).value() ?? 0;
    };

    const strike = getAttr(6);

    return {
        call: {
            ...getName("tLeft"),
            type: CallOrPutType.Call,
            strike,
            buyVolume: getAttr(2),
            buy: getAttr(3),
            sell: getAttr(4),
            sellVolume: getAttr(5),
        },
        strike,
        put: {
            ...getName("tRight"),
            type: CallOrPutType.Put,
            strike,
            buyVolume: getAttr(7),
            buy: getAttr(8),
            sell: getAttr(9),
            sellVolume: getAttr(10),
        }
    }
}

function parseCallOrPut(text: string): CallOrPutType {
    switch (text) {
        case "Köp": return CallOrPutType.Call;
        case "Sälj": return CallOrPutType.Put;
    }

    throw `Invalid call or put: ${text}`;
}

function parseOptionType(text: string): OptionType {
    switch (text) {
        case "Weekly": return OptionType.Weekly;
        case "Option": return OptionType.Standard;
    }

    throw `Invalid call or put: ${text}`;
}

export function parseOptionInfo(doc: cheerio.Selector): OptionDetails {
    const quoteBar = doc("div.component.quote div ul li");
    const dd = doc("div.derivative_greeks_data dd");
    const pi = doc("ul.primaryInfo.cleanList li div span.data");

    function getPI(i: number) {
        return pi.eq(i).text();
    }

    function getGreek(i: number) {
        const val = dd.eq(i).text();
        return {
            num: () => numeral(val).value() ?? 0,
            text: () => val
        };
    }

    return {
        change: numeral(quoteBar.find("div span.change").text()).value(),
        changePercent: numeral(quoteBar.find("div span.changePercent").text()).value(),
        last: numeral(quoteBar.find("span.lastPrice").text()).value(),
        spread: numeral(quoteBar.find("span.spread").text()).value(),
        high: numeral(quoteBar.find("span.highestPrice").text()).value(),
        low: numeral(quoteBar.find("span.lowestPrice").text()).value(),
        volume: numeral(quoteBar.find("span.totalVolumeTraded").text()).value(),
        updated: quoteBar.find("span.updated").text(),

        type: parseCallOrPut(getPI(1)),
        optionType: parseOptionType(getPI(3)),
        expires: getPI(2),
        strike: numeral(getPI(4)).value(),
        parity: numeral(getPI(5)).value(),

        buyIV: getGreek(0).num() / 100,
        delta: getGreek(2).num(),
        theta: getGreek(3).num(),
        vega: getGreek(4).num(),
        sellIV: getGreek(5).num() / 100,
        gamma: getGreek(7).num(),
        rho: getGreek(8).num(),
        IV: getGreek(9).num() / 100,
    };
}

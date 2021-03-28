import * as cheerio from 'cheerio';

import './utils/numeral';
import numeral from 'numeral';

export function parseStockList($: cheerio.Selector) {
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

function parseUnderlyingTable(table: cheerio.Cheerio) {
    const getAttr = (name: string) => {
        var value = table.find(`td.${name}`).text();

        return {
            num: () => {
                return { [name]: numeral(value).value() };
            },
            time: () => {
                return { [name]: value };
            }
        };
    };

    var nameNode = table.find("td.instrumentName a");
    return {
        name: nameNode.attr("title"),
        href: nameNode.attr("href"),

        ...getAttr("change").num(),
        ...getAttr("changePercent").num(),
        ...getAttr("buyPrice").num(),
        ...getAttr("sellPrice").num(),
        ...getAttr("highestPrice").num(),
        ...getAttr("lowestPrice").num(),
        ...getAttr("lastPrice").num(),
        ...getAttr("updated").time(),
        ...getAttr("totalVolumeTraded").num(),
    };
}

function parseOptionsTable($: cheerio.Selector, table: cheerio.Cheerio) {
    return table.find("tbody > tr")
        .map((i, elem) => parseOptionItem(i, $(elem)))
        .get();
}

function parseOptionItem(i: number, tr: cheerio.Cheerio) {
    const getName = (cl: string) => {
        var nameNode = tr.find(`td.matrix.${cl}.instrumentName a`);

        return {
            name: nameNode.attr("title"),
            href: nameNode.attr("href"),
        };
    };

    const getAttr = (i: number) => {
        const val = tr.find("td").eq(i).text();
        // return val;
        return numeral(val).value();
    };

    return {
        call: {
            ...getName("tLeft"),
            buyVolume: getAttr(2),
            buy: getAttr(3),
            sell: getAttr(4),
            sellVolume: getAttr(5),
        },
        strike: getAttr(6),
        put: {
            ...getName("tRight"),
            buyVolume: getAttr(7),
            buy: getAttr(8),
            sell: getAttr(9),
            sellVolume: getAttr(10),
        }
    }
}

export async function parseOptionInfo(doc: cheerio.Selector) {
    const dd = doc("div.derivative_greeks_data dd");

    // const dd = greeks.find("dd");

    const get = (i: number) => {
        const val = dd.eq(i).text();
        return {
            num: () => numeral(val).value(),
            text: () => val
        };
    }

    return {
        buyIV: get(0).text(),
        delta: get(2).num(),
        theta: get(3).num(),
        vega: get(4).num(),
        sellIV: get(5).num(),
        gamma: get(7).num(),
        rho: get(8).num(),
        IV: get(9).text(),
    };
}


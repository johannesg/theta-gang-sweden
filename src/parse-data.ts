import * as cheerio from 'cheerio';

export async function parseStockList(doc: cheerio.Selector) {
    return doc("#underlyingInstrumentId")
        .children().toArray()
        .map((e) => {
            const t = e as cheerio.TagElement;
            return {
                id: t.attribs["value"],
                name: t.lastChild.data
            };
        });
}

export async function parseOptionsPage(doc: cheerio.Selector) {

    const listFilterResult = doc("#listFilterResult");

    const underlyingTable = listFilterResult.find("table.optionLists").first();
    const optionsTable = listFilterResult.find("table.optionMatrix").first();


    return {
        underlying: parseUnderlyingTable(underlyingTable),
        options: parseOptionsTable(optionsTable)
    };
}

function parseUnderlyingTable(table: cheerio.Cheerio) {
    const getAttr = (name: string) => {
        var value = table.find(`td.${name}`).text();

        return { [name]: value };
    };

    var nameNode = table.find("td.instrumentName a");
    return {
        name: nameNode.attr("title"),
        href: nameNode.attr("href"),

        ...getAttr("change"),
        ...getAttr("changePercent"),
        ...getAttr("buyPrice"),
        ...getAttr("sellPrice"),
        ...getAttr("highestPrice"),
        ...getAttr("lowestPrice"),
        ...getAttr("lastPrice"),
        ...getAttr("updated"),
        ...getAttr("totalVolumeTraded"),
    };
}

function parseOptionsTable(table: cheerio.Cheerio) {
    return table.find("tr")
        .map(parseOptionItem)
        .get();
}

function parseOptionItem(i : number, tr: cheerio.Element) {

    const row = cheerio(tr)

    const getName = (cl: string) => {
        var nameNode = row.find(`td.matrix.${cl}.instrumentName a`);

        return {
            name: nameNode.attr("title"),
            href: nameNode.attr("href"),
        };
    };

    const getAttr = (i: number) => {
        return row.find("rd").eq(i).text();
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
    const greeks = doc("div.derivative_greeks_data");

    const dd = greeks.find("dd");

    return {
        buyIV: dd.eq(0).text(),
        delta: dd.eq(2).text(),
        theta: dd.eq(3).text(),
        vega: dd.eq(4).text(),
        sellIV: dd.eq(0).text(),
        gamma: dd.eq(2).text(),
        rho: dd.eq(3).text(),
        IV: dd.eq(4).text(),
    };
}


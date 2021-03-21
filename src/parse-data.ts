export async function parseStockList(doc: Document) {
    var elem = doc.getElementById("underlyingInstrumentId");
    if (!elem)
        return null;

    return Array.from(elem.children)
        .map(elem => ({ id: elem.attributes.getNamedItem("value").value, name: elem.textContent }));
}

export async function parseOptionsPage(doc: Document) {

    const listFilterResult = doc.getElementById("listFilterResult")

    const underlyingTable = listFilterResult.querySelector("table.optionLists");
    const optionsTable = listFilterResult.querySelector("table.optionMatrix");


    return {
        underlying: parseUnderlyingTable(underlyingTable),
        options: parseOptionsTable(optionsTable as HTMLTableElement)
    };
}

function parseUnderlyingTable(table: Element) {
    const getAttr = (name: string) => {
        var value = table.querySelector(`td.${name}`).textContent;

        return { [name]: value };
    };

    var nameNode = table.querySelector("td.instrumentName a");
    return {
        name: nameNode.getAttribute("title"),
        href: nameNode.getAttribute("href"),

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

function parseOptionsTable(table: HTMLTableElement) {
    return Array.from(table.tBodies.item(0).rows)
        .map(parseOptionItem);
}

function parseOptionItem(tr: HTMLTableRowElement) {

    const getName = (cl: string) => {
        var nameNode = tr.querySelector(`td.matrix.${cl}.instrumentName a`);

        return {
            name: nameNode.getAttribute("title"),
            href: nameNode.getAttribute("href"),
        };
    };

    const getAttr = (i: number) => {
        return tr.cells.item(i).textContent;
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

export async function parseOptionInfo(doc: Document) {
    const greeks = doc.querySelector("div.derivative_greeks_data");

    const dls = greeks.querySelectorAll("dl");
    const dd1 = dls.item(0).getElementsByTagName("dd");
    const dd2 = dls.item(1).getElementsByTagName("dd");

    const get = (dd: HTMLCollectionOf<HTMLElement>, i : number) => {
        return dd.item(i).querySelector("span").textContent;
    };

    return {
        buyIV: get(dd1, 0),
        delta: get(dd1, 2),
        theta: get(dd1, 3),
        vega: get(dd1, 4),
        sellIV: get(dd2, 0),
        gamma: get(dd2, 2),
        rho: get(dd2, 3),
        IV: get(dd2, 4),
    };
}


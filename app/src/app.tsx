import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { loadInstruments, loadOptionsMatrix } from './resolvers';
import { getDaysFromNow, getNextMonths } from './utils';
import { OptionType } from './types';
import numeral from 'numeral';
import { PropsWithChildren } from "@kitajs/html";

export const app = new Elysia()
    .use(html())
    .get("/", ({ html }) => html(index()))
    .get("/instruments", async ({ html }) => html(await instruments()))
    .post("/matrix", async ({ body: { instrument, type, expiry }, html }: any) =>
        html(await matrix(instruments, type, expiry)))
    .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"));

function index() {
    return <BaseHtml>
        <body class="flex flex-col w-full h-screen" >
            <div class="w-full bg-primary-600 h-16 drop-shadow-xl p-6 flex items-center">
                <p class="text-white tracking-wide  font-medium font-sans text-xl">Theta Gang Sweden</p>
            </div>

            <div class="p-4" hx-get="/instruments" hx-trigger="load">
                Loading
            </div>

            <div class="p-4" id="matrix">
            </div>
        </body>
    </BaseHtml>
}


async function instruments() {
    const instruments = await loadInstruments();
    const months = getNextMonths(24);
    return <form hx-post="/matrix" hx-trigger="change" hx-target="#matrix">
        <div class="flex gap-3">
            <Select name="instrument" label="Instrument">
                <option value="" selected>Choose an instrument</option>
                {instruments.map(i => (<option value={i.id} safe>{i.name}</option>))}
            </Select>

            <Select name="type" label="Type">
                <option value={OptionType.Standard}>Standard</option>
                <option value={OptionType.Weekly}>Weekly</option>
            </Select>

            <Select name="expiry" label="Expiry">
                {months.map(m => (<option safe>{m}</option>))}
            </Select>
        </div>
        <div class="mt-4">
            <button hx-post="/matrix" class="py-1.5 px-3 font-sans uppercase bg-primary-600 rounded-sm text-white hover:bg-blue-800 flex items-center justify-center">
                Refresh
            </button>
        </div>
    </form>
}

async function matrix(instrument: string, type: string, expiry: string) {
    // const { instrument, type, expiry } = await req.parseBody();

    const { matrix, underlying } = await loadOptionsMatrix(instrument, type, expiry);
    return <div>
        <p>Instrument: {underlying?.name}</p>
        <p>Type: {type}</p>
        <p>Expiry: {expiry}</p>

        <div class="mt-4">
            <table class="matrix-table">
                <thead class="p-2">
                    <tr class="border-b">
                        <th class="p-1 pl-4 text-left">Name</th>
                        <th class="text-right">Change</th>
                        <th class="text-right">Percent</th>
                        <th class="text-right">Last</th>
                        <th class="text-right">Bid</th>
                        <th class="text-right">Ask</th>
                        <th class="text-right">High</th>
                        <th class="text-right">Low</th>
                        <th class="text-right">Updated</th>
                        <th class="pr-4 text-right">Volume</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-1 pl-4 text-left">{underlying?.name}</td>
                        <td class="text-right">{underlying?.change}</td>
                        <td class="text-right" safe>{numeral(underlying?.changePercent).format("0.00%")}</td>
                        <td class="text-right">{underlying?.lastPrice}</td>
                        <td class="text-right">{underlying?.buyPrice}</td>
                        <td class="text-right">{underlying?.sellPrice}</td>
                        <td class="text-right">{underlying?.highestPrice}</td>
                        <td class="text-right">{underlying?.lowestPrice}</td>
                        <td class="text-right">{underlying?.updated}</td>
                        <td class="pr-4 text-right">{underlying?.totalVolumeTraded}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            <table class="matrix-table border-collapse">
                <thead>
                    <tr class="border-b">
                        <th class="p-1 pl-4 text-right bg-yellow-300">Vega</th>
                        <th class="text-right">Theta</th>
                        <th class="text-right">Gamma</th>
                        <th class="text-right">Delta</th>
                        <th class="text-right">IV</th>
                        <th class="text-right">Vol</th>
                        <th class="text-right">Spread</th>
                        <th class="text-right">Last</th>
                        <th class="text-right">Bid</th>
                        <th class="text-right">Ask</th>
                        <th class="text-center">Strike</th>
                        <th class="text-right">Ask</th>
                        <th class="text-right">Bid</th>
                        <th class="text-right">Last</th>
                        <th class="text-right">Spread</th>
                        <th class="text-right">Vol</th>
                        <th class="text-right">IV</th>
                        <th class="text-right">Delta</th>
                        <th class="text-right">Gamma</th>
                        <th class="text-right">Theta</th>
                        <th class="pr-4 text-right">Vega</th>
                    </tr>
                </thead>
                <tbody>
                    {matrix.map(m => (<>
                        <tr class="border-b ">
                            <td colspan="9" class="p-1 font-medium text-center">CALLS</td>
                            <td colspan="3" class="font-medium text-center" safe>EXP: {m.expires} DTE: {getDaysFromNow(m.expires)}</td>
                            <td colspan="9" class="font-medium text-center">PUTS</td>
                        </tr>
                        {m.options.map(o => (<tr class="border-b">
                            <td class="p-0.5 pl-4 text-right" safe>{numeral(o.call?.vega).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.theta).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.gamma).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.delta).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.IV).format("0.00%")}</td>
                            <td class="text-right" safe>{numeral(o.call?.volume).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.spread).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.last).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.call?.bid).format("0.00")}</td>
                            <td class="text-right mx-2" safe>{numeral(o.call?.ask).format("0.00")}</td>
                            <td class="text-center bg-blue-400" safe>{numeral(o.strike).format("0")}</td>
                            <td class="text-right" safe>{numeral(o.put?.ask).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.bid).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.last).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.spread).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.volume).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.IV).format("0.00%")}</td>
                            <td class="text-right" safe>{numeral(o.put?.delta).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.gamma).format("0.00")}</td>
                            <td class="text-right" safe>{numeral(o.put?.theta).format("0.00")}</td>
                            <td class="pr-4 text-right" safe>{numeral(o.put?.vega).format("0.00")}</td>
                        </tr>
                        ))}
                    </>
                    ))}
                    <tr></tr>
                </tbody>
            </table>
        </div>
    </div>
}

function BaseHtml({ children }: PropsWithChildren) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="/public/styles.css" rel="stylesheet">
  <script src="/public/reload.js"></script>
</head>

${children}
`
}

const Select = ({ name, label, children }: PropsWithChildren<{ name: string, label: string }>) => {
    return <label class="text-xs text-gray-500">{label}
        <select name={name} class="custom-select py-2.5 px-0 w-full text-base leading-none font-normal text-gray-800 bg-transparent border-0 border-b border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 hover:border-gray-200 peer">
            {children}
        </select>
    </label>;
}

import { html } from 'hono/html';
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';
import type { FC } from 'hono/jsx'
import fs from 'fs/promises';
import { loadInstruments, loadOptionsMatrix } from './resolvers';
import { getNextMonths } from './utils';
import { OptionType } from './types';

type Option = {
    label: string
    value: string
}

const options: Option[] = [
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
    { label: "Three", value: "3" }
];

export const app = new Hono()
    // .use(html())
    .get("/", ({ html }) =>
        html(
            <BaseHtml>
                <body
                    class="flex flex-col w-full h-screen"
                // hx-get="/todos"
                // hx-swap="innerHTML"
                // hx-trigger="load"
                >
                    <div class="w-full bg-primary-600 h-16 drop-shadow-xl p-6 flex items-center">
                        <p class="text-white tracking-wide  font-medium font-sans text-xl">Theta Gang Sweden</p>
                    </div>

                    <div class="p-4" hx-get="/instruments" hx-trigger="load">
                        Loading
                    </div>

                    <div class="p-4" id="matrix">

                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th class="font-sans text-xs font-semibold">Name</th>
                                        <th>Change</th>
                                        <th>Percent</th>
                                        <th>Last</th>
                                        <th>Bid</th>
                                        <th>Ask</th>
                                        <th>High</th>
                                        <th>Low</th>
                                        <th>Updated</th>
                                        <th>Volume</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </body>
            </BaseHtml>
        )
    )
    .get("/instruments", async ({ html }) => {
        const instruments = await loadInstruments();
        const months = getNextMonths(24);
        return html(
            <form hx-post="/matrix" hx-trigger="change" hx-target="#matrix">
                <div class="flex gap-3">
                    <Select name="instrument" label="Instrument">
                        <option selected>Choose an instrument</option>
                        {instruments.map(i => (<option value={i.id}>{i.name}</option>))}
                    </Select>

                    <Select name="type" label="Type">
                        <option value={OptionType.Standard}>Standard</option>
                        <option value={OptionType.Weekly}>Weekly</option>
                    </Select>

                    <Select name="expiry" label="Expiry">
                        {months.map(m => (<option>{m}</option>))}
                    </Select>
                </div>
            </form>
        );
    })
    .post("/matrix", async ({ req, html }) => {
        const { instrument, type, expiry } = await req.parseBody();

        const matrix = await loadOptionsMatrix(instrument, type, expiry);
        return html(<div>
            <p>Instrument: {matrix.underlying?.name}</p>
            <p>Type: {type}</p>
            <p>Expiry: {expiry}</p>
        </div>)
    })
    // .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"));
    .get("/styles.css", async (c) => c.body(await fs.readFile("./tailwind-gen/styles.css")));


const BaseHtml: FC = ({ children }) => html`<!DOCTYPE html>
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
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

const Select: FC = ({ name, label, children }) => {
    return (<label class="text-xs text-gray-500">{label}
        <select name={name} class="custom-select py-2.5 px-0 w-full text-base leading-none font-normal text-gray-800 bg-transparent border-0 border-b border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 hover:border-gray-200 peer">
            {children}
        </select>
    </label>
    );
}

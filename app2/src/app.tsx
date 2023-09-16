import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

type Option = {
    label: string
    value: string
}

const options: Option[] = [
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
    { label: "Three", value: "3" }
];

export const app = new Elysia()
    .use(html())
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

                    <div class="p-4">
                    </div>
                    <div id="options">
                        <p>HEJ</p>
                    </div>
                </body>
            </BaseHtml>
        )
    )
    .get("/instruments", ({ html }) =>
        html(
            <form hx-post="/options" hx-trigger="change" hx-target="#options">
                <div class="flex gap-3">
                    <Select name="instrument" label="Instrument">
                        <option selected>Choose an instrument</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                    </Select>

                    <Select name="type" label="Type">
                        <option>2: One</option>
                        <option>2: Two</option>
                    </Select>

                    <Select name="expiry" label="Expiry">
                        <option>3: One</option>
                        <option>3: Two</option>
                    </Select>
                </div>
            </form>
        )
    )
    .post("/options", ({ body, html }) => {
        const { instrument, type, expiry } = body;
        return html(<div>
            <p>Instrument: {instrument}</p>
            <p>Type: {type}</p>
            <p>Expiry: {expiry}</p>
        </div>)
    })
    .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"));


const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

type SelectProps = { name, label: string, children: { name: string, label: string, children: elements.Children[] } }
function Select({ name, label, children }: SelectProps) {
    return (<label class="text-sm text-gray-500">{label}
        <select name={name} class="custom-select py-2.5 px-0 w-full text-lg text-gray-800 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            {children}
        </select>
    </label>
    );
}

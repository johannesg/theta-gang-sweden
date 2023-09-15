import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

type Option = {
    label: string
    value: string
}

const options : Option[] = [
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
            <Dropdown label="Loading"></Dropdown>
        </div>
        <div id="options">
        <p>HEJ</p>
        </div>
        </body> 
      </BaseHtml>
    )
  )
  .get("/instruments", ( { html }) => 
          html(
              <Dropdown label="Instrument">
                  <DropdownItem hxGet="/instrument/one" hxTarget="#options">One</DropdownItem>
                  <DropdownItem hxGet="/instrument/two" hxTarget="#options">Two</DropdownItem>
                  <DropdownItem hxGet="/instrument/three" hxTarget="#options">Three</DropdownItem>
              </Dropdown>
              )
      )
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

type DropdownProps = {
    label: string
    children?: typeof DropdownItem[]
}

type DropdownItemProps = elements.Children & {
    hxGet: string
    hxTarget: string
}

function DropdownItem({ hxGet, hxTarget, children }: DropdownItemProps) {
    return <li>
      <a
        class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
        hx-get={hxGet}
        hx-target={hxTarget}
        data-te-dropdown-item-ref
        _="on click set { innerText: my.innerText} on the previous <span[data-dropdown-label] /> "
        >{children}</a>
    </li>
}

function Dropdown({ label, children }: DropdownProps) {
    return <div class="relative" data-te-dropdown-ref>
  <button
    class="flex items-center whitespace-nowrap rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
    type="button"
    data-te-dropdown-toggle-ref
    aria-expanded="false"
    data-te-ripple-init
    data-te-ripple-color="light"
    _="on click 
        toggle .hidden on the next <ul/>
        halt"
    >
    <span data-dropdown-label>{label}</span>
    <span class="ml-2 w-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5">
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd" />
      </svg>
    </span>
  </button>
  <ul
    class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
    aria-labelledby="dropdownMenuButton1"
    data-te-dropdown-menu-ref
    _="on click from body if I do not match .hidden add .hidden"
    >
    {children}
  </ul>
</div>
    // return <select>
    // {
    //     options.map(o => <option value={o.value}>{o.label}</option>)
    // }</select>
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}


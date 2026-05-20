# ASL Arbitrage

A lightweight web client for referees to score duels. Outputs a single self-contained HTML file -- no server required.

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vite](https://vitejs.dev/) | Dev server and bundler |
| [vite-plugin-handlebars](https://github.com/alexlafroscia/vite-plugin-handlebars) | HTML templating via `.hbs` component files |
| [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | Inlines all assets into a single `.html` file |
| Custom reactive core ([`core.ts`](src/ts/core.ts)) | Lightweight reactive state with DOM bindings |

## Getting Started

**Prerequisites:** Node.js >= 18

```bash
npm install
```

## Commands

| Command | Description |
|---|---|
| `npx vite dev` | Start dev server with hot reload + auto-rebuild on file change |
| `npm run build` | Type-check and build to `dist/` |
| `npm run build-watch` | Watch mode: re-type-check and rebuild on every change |
| `npx jest` | Run all tests |
| `npx jest --watch` | Run tests in watch mode |

The dev server uses a [custom Vite plugin](vite.config.js) that triggers a full production build whenever a source file changes, so `dist/src/index.html` stays up-to-date during development.

## Reactive Core

[`src/ts/core.ts`](src/ts/core.ts) exposes a `reactive<T>()` function that wraps a plain object in a `Proxy` and:

- **DOM content binding** -- elements with `data-binding="<property>"` are updated automatically when the property changes.
- **CSS class binding** -- elements with `data-class-binding="<prop> <op> <value> ? 'trueClass' : 'falseClass'"` toggle classes via comparison expressions (`==`, `!=`, `>=`, `<=`, `>`, `<`). Multiple rules per element, separated by `;`.
- **Watchers** -- typed `watch<Property>(handler)` methods are generated for every key in the state object.

Full API documentation with code examples: [src/ts/README.md](src/ts/README.md)

## Testing

Tests use **Jest** with **ts-jest** (TypeScript support) and **jest-environment-jsdom** (DOM environment).

Component tests follow two patterns:

1. **HTML structure** -- loads the body from `dist/src/index.html` into jsdom and asserts that the expected elements, attributes, and bindings are present in the rendered output.
2. **Behavior** -- instantiates the TypeScript component class against that DOM and simulates button clicks to verify reactive state updates (text content, CSS classes).

The test tree mirrors the source tree under `src/components/`:

```
tests/
+-- board.test.ts
+-- components/
    +-- score/
        +-- score.test.ts   HTML structure + Score class behavior
```

Each component test file uses `@jest-environment jsdom` and reads `dist/src/index.html` directly, so tests validate the actual built output rather than a mock.

## Project Structure

```
src/
+-- index.html              Entry point
+-- imports.ts              Global imports
+-- components/             Handlebars components (.hbs + .ts pairs)
|   +-- score/
|       +-- score.hbs       Score component template
|       +-- score.ts        Score component class
+-- styles/                 CSS stylesheets
+-- ts/
    +-- core.ts             Reactive state engine
    +-- board.ts            Board logic
    +-- app.ts              App entry point
```

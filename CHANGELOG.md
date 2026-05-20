# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions match [package.json](package.json).

---

## [0.9.0] - 2026-05-21

### Added

#### Reactive core (`src/ts/core.ts`)
- `reactive<T>()` — wraps a plain object in a `Proxy` and syncs state to the DOM automatically
- `data-binding` attribute — sets element `textContent` when a property changes
- `data-class-binding` attribute — toggles CSS classes via comparison expressions (`==`, `!=`, `>=`, `<=`, `>`, `<`); supports multiple `;`-separated rules per element
- Typed `watch<Property>(handler)` methods generated for every key in the state object; returns an unsubscribe function
- `parseValue` — parses HTML attribute literals to typed values (`number`, `string`, `boolean`, `null`)

#### Score component (`src/components/score/`)
- `score.hbs` — Handlebars template with `data-binding`, `data-class-binding` wired to reactive state
- `score.ts` — component class managing `msg`, `isActive`, `isDisabled` reactive properties and button handlers
- Active/inactive indicator paragraphs driven by `isActive == true/false` class bindings

#### Tests
- `tests/ts/core.test.ts` — 13 unit tests for the reactive core: initial render, reactivity, all operators, value types, multiple rules
- `tests/components/score/score.test.ts` — 24 integration tests for the Score component against the built `dist/src/index.html`: HTML structure, initial state, msg toggling, class bindings, indicator visibility
- `tests/board.test.ts` — unit test for `Board.printScore()` warning

#### CI
- `.github/workflows/ci.yml` — GitHub Actions workflow: install, Vite build, Jest on every push and pull request

#### Documentation
- `README.md` — project overview, tech stack, commands, reactive core summary, testing section, project structure
- `src/ts/README.md` — full API reference for the reactive core with code examples

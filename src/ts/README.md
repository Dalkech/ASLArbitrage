# Reactive Core (`core.ts`)

`reactive<T>()` wraps a plain object in a `Proxy` and wires it to the DOM automatically. When a property changes, every bound element updates — no virtual DOM, no framework.

## Quick Start

```ts
import { reactive } from './core';

const state = reactive({
    score: 0,
    status: 'active',
    isWinning: false,
});

// Change a property — the DOM updates instantly
state.score = 15;
```

Bind elements in HTML using `data-*` attributes (see below). The `reactive()` call does an initial render for all properties, so the DOM is consistent from the first frame.

---

## DOM Bindings

### `data-binding` — text content

Sets the `textContent` of an element to the current value of a property.

```html
<span data-binding="score"></span>
<p data-binding="status"></p>
```

```ts
const state = reactive({ score: 0, status: 'ready' });
state.score = 42;    // <span> now shows "42"
state.status = 'go'; // <p> now shows "go"
```

> The element is replaced with a clean clone on each update (no stale child nodes).

---

### `data-class-binding` — comparison-based class toggle

Toggles CSS classes based on a **comparison expression**. Multiple rules can be combined in one attribute, separated by `;`.

**Syntax:** `<prop> <operator> <value> ? 'trueClass' : 'falseClass'`

Supported operators: `==`, `!=`, `>=`, `<=`, `>`, `<`

```html
<p data-class-binding="isActive == true ? '' : 'inactive'; isDisabled == true ? 'disabled' : '';"></p>
```

```ts
const state = reactive({ isActive: true, isDisabled: false });

state.isActive = false;   // adds "inactive"
state.isDisabled = true;  // adds "disabled"
state.isActive = true;    // removes "inactive"
```

**Numeric threshold example:**

```html
<div data-class-binding="score >= 10 ? 'winning' : 'losing'"></div>
```

```ts
const state = reactive({ score: 0 });
// initial render: score (0) < 10 → adds "losing"

state.score = 15;
// score (15) >= 10 → removes "losing", adds "winning"
```

**Multiple rules** on the same element, separated by `;`:

```html
<div data-class-binding="
    score >= 10 ? 'winning' : 'losing';
    score == 0  ? 'zero'   : '';
"></div>
```

```ts
const state = reactive({ score: 0 });
// → "losing" + "zero"

state.score = 10;
// → "winning" (zero removed)
```

**Visibility toggle using two elements:**

```html
<p data-class-binding="isActive == true ? '' : 'none';">active</p>
<p data-class-binding="isActive == false ? '' : 'none';">inactive</p>
```

```ts
const state = reactive({ isActive: false });
// first <p>  → "none" (hidden)
// second <p> → no class (visible)

state.isActive = true;
// first <p>  → no class (visible)
// second <p> → "none" (hidden)
```

**Value types** supported in comparisons:

| Literal in HTML | Parsed as |
|---|---|
| `10`, `3.14` | `number` |
| `'active'` | `string` (quotes stripped) |
| `true` / `false` | `boolean` |
| `null` | `null` |

- Use an empty string `''` for the side with no class change.

---

## Watchers

`reactive()` generates a typed `watch<Property>(handler)` method for every key in the state object. The handler fires after the DOM has already been updated.

```ts
const state = reactive({ score: 0, msg: 'Hello' });

// Subscribe
const unwatch = state.watchScore(next => {
    console.log('score changed to', next);
});

state.score = 5; // logs "score changed to 5"

// Unsubscribe
unwatch();
state.score = 10; // handler no longer called
```

The return value of `watch<Property>()` is an **unsubscribe function** — call it to stop receiving updates.

---

## TypeScript Types

```ts
import { type ReactiveObject, type OnChangeCallbackFn } from './core';

// ReactiveObject<T> = T & { watch<Prop>(handler): () => void }
type State = { score: number; label: string };
const state: ReactiveObject<State> = reactive({ score: 0, label: '' });

state.watchScore;  // (handler: OnChangeCallbackFn<number>) => () => void
state.watchLabel;  // (handler: OnChangeCallbackFn<string>) => () => void
```

---

## Summary

| Attribute | Triggers on | Effect |
|---|---|---|
| `data-binding="<prop>"` | any value change | sets `textContent` |
| `data-class-binding="<prop> <op> <val> ? 'a' : 'b'"` | any value change | toggles CSS classes via comparison |
| `watch<Prop>(handler)` | any value change | calls JS handler after DOM update |

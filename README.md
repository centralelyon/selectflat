# selectflat

`selectflat` is a dependency-free browser ESM reimplementation of Fil's Observable notebook [`@fil/selectflat`](https://observablehq.com/@fil/selectflat).

It keeps the same core interaction model:

- hover or focus an option to preview it
- click to commit it
- read the current state from `form.value`
- listen to `input` for live previews and `change` for committed updates

## Install

From npm:

```sh
npm install selectflat
```

Then import it in your app:

```js
import { selectFlat } from "selectflat";
```

For local development in this repository, you can import the file directly:

```js
import { selectFlat } from "./selectflat.js";
```

## Basic usage

```html
<div id="app"></div>

<script type="module">
  import { selectFlat } from "selectflat";

  const control = selectFlat({
    options: ["A", "B", "C", "D"],
    value: "B",
    output: true,
    description: "your choice"
  });

  control.addEventListener("input", () => {
    console.log("preview or current value", control.value);
  });

  document.querySelector("#app").append(control);
</script>
```

## Programmatic selection

You can set or reset the value from code:

```js
import { selectFlat } from "selectflat";

const control = selectFlat({
  options: ["A", "B", "C", "D"],
  value: "C"
});

control.setValue("A");
control.resetValue();
```

Setting `control.value = "A"` also updates the component and dispatches `input` and `change`.

## Multiple selection

```js
import { selectFlat } from "selectflat";

const control = selectFlat({
  multiple: true,
  value: ["warm", "bright"],
  options: [
    { label: "warm", value: "warm" },
    { label: "cool", value: "cool" },
    { label: "bright", value: "bright" },
    { label: "muted", value: "muted" }
  ]
});

console.log(control.value); // ["warm", "bright"]
```

When `multiple: true`, hovering an option previews that option together with the values that are already selected.

## Custom layout

You can customize the square size and strip layout with the `layout` option:

```js
import { selectFlat } from "selectflat";

const control = selectFlat({
  value: "D",
  layout: {
    size: "1.4rem",
    gap: "0.25rem",
    direction: "grid",
    wrap: "wrap"
  },
  options: ["A", "B", "C", "D", "E", "F"]
});
```

`direction: "grid"` wraps cells to the next row when the available width runs out.

## Text labels

By default, labels are hidden in the cells. You can reveal them on hover, keep them always
visible, let the cell grow to fit the text, or clip the text inside a fixed cell:

```js
import { selectFlat } from "selectflat";

const control = selectFlat({
  text: {
    visibility: "hover",
    width: "content",
    overflow: "clip"
  },
  options: ["Alpha", "Beta", "Gamma"]
});
```

`visibility` accepts `hidden`, `hover`, and `always`.
`width` accepts `fixed` or `content`.
`overflow` accepts `clip` or `ellipsis`.

## Image options

Options can render an image instead of text. Pass either an image URL, a data URL or base64 string,
or an already loaded image element from the page:

```js
import { selectFlat } from "selectflat";

const control = selectFlat({
  output: true,
  value: "fr",
  options: [
    {
      value: "fr",
      label: "France",
      image: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/fr.svg",
      fit: "contain"
    },
    {
      value: "us",
      label: "United States",
      image: document.querySelector("#us-flag"),
      fit: "contain"
    }
  ]
});
```

`fit` accepts CSS-like image fitting modes. `contain` keeps the whole image visible, `cover`
fills the square and may crop, and `fill`, `none`, and `scale-down` are also supported.
`rescale` is treated as `contain`, and `crop` or `crope` are treated as `cover`.

## Touch interaction

On touch devices:

- tap once to preview a value
- tap the same cell again to commit it
- drag across cells to preview continuously and commit on release

In multiple mode, drag gestures act like painting:

- start on an unselected cell to add cells across the drag path
- start on a selected cell to remove cells across the drag path
- forced and disabled cells are skipped

## API

`selectFlat(config)` or `selectFlat(optionsArray)`

### Config

- `options`: array of primitive values or option objects
- `value`: initial value, or an array when `multiple: true`
- `title`: optional heading shown above the control
- `description`: optional text shown next to the output
- `output`: when `true`, show the current label next to the description
- `multiple`: when `true`, allow toggling several values and return an array
- `layout`: optional layout object controlling option size and arrangement
- `text`: optional text display settings for option labels
- `submit`: optional submit button label, or `true` for a default `Apply` button

`layout` supports:

- `size`: square width and height, as a CSS length or number of pixels
- `gap`: spacing between cells, as a CSS length or number of pixels
- `direction`: `row`, `row-reverse`, `column`, `column-reverse`, or `grid`
- `wrap`: `true` / `false`, or `wrap`, `nowrap`, `wrap-reverse`

`text` supports:

- `visibility`: `hidden`, `hover`, or `always`
- `width`: `fixed` or `content`
- `overflow`: `clip` or `ellipsis`

Option objects support:

- `value`: underlying value returned from `form.value`
- `label`: label text used for tooltips, output text, and optional in-cell rendering
- `disabled`: disable selection for that option
- `forced`: when `multiple: true`, keep this option selected and do not allow it to be toggled off
- `image`: optional image URL, data URL, base64 string, or already loaded image element
- `fit`: image fit mode for this option: `contain`, `cover`, `fill`, `none`, or `scale-down`

### Return value

`selectFlat()` returns a `<form>` element with:

- `form.value`: current value, or an array when `multiple: true`
- `form.initialValue`: the initial committed value
- `form.options`: normalized option snapshot
- `form.layout`: normalized layout snapshot
- `form.output`: the `<output>` node used when `output: true`
- `form.setValue(value, options?)`: programmatically commit a value
- `form.resetValue(options?)`: restore the initial committed value

Both `setValue()` and `resetValue()` dispatch `input` and `change` by default. Pass `{ dispatch: false }` to update silently.

### Events

- `input`: fires during hover and focus previews, and after committed updates
- `change`: fires after committed click-based updates, programmatic updates, and resets

## Notes

- This module is browser-only. It creates DOM nodes and expects `document` to exist.
- The component injects scoped styles into the returned form, so no extra stylesheet is required.
- The control uses `touch-action: none` on the option strip so drag gestures work reliably on mobile.
- This rewrite uses buttons instead of a styled native `<select>`, but keeps the same flat strip interaction from the original notebook.

## Examples

The demo page lives at [examples/index.html](./examples/index.html). It includes examples for
flags, emoji icons, multiple selection, layout control, and programmatic updates.

To run it locally:

```sh
python3 -m http.server
```

Then open `http://localhost:8000/examples/`.

## Publish

This package is configured as a plain ESM npm module. A typical publish flow is:

```sh
npm test
npm publish
```

If `selectflat` is already taken on npm, update the `name` field in [package.json](./package.json) before publishing.

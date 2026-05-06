# selectflat

`selectflat` is a reimplementation of Fil's ObservableHQ notebook [`@fil/selectflat`](https://observablehq.com/@fil/selectflat).

It keeps the same core interaction model:

- hover or focus an option to preview it
- click to commit it
- read the current state from `form.value`
- listen to `input` for live previews and `change` for committed updates

An online demo using this module is available at [`@liris/selectflat`](https://observablehq.com/@fil/selectflat).

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

## API

`selectFlat(config)` or `selectFlat(optionsArray)`

### Config

- `options`: array of primitive values or option objects
- `value`: initial value, or an array when `multiple: true`
- `title`: optional heading shown above the control
- `description`: optional text shown next to the output
- `output`: when `true`, show the current label next to the description
- `multiple`: when `true`, allow toggling several values and return an array
- `submit`: optional submit button label, or `true` for a default `Apply` button

Option objects support:

- `value`: underlying value returned from `form.value`
- `label`: visible label used for tooltips and output text
- `disabled`: disable selection for that option

### Return value

`selectFlat()` returns a `<form>` element with a few useful properties:

- `form.value`: current value, or an array when `multiple: true`
- `form.options`: normalized option snapshot
- `form.output`: the `<output>` node used when `output: true`

### Events

- `input`: fires during hover and focus previews, and after committed updates
- `change`: fires after committed click-based updates and form resets

## Notes

- This module is browser-only. It creates DOM nodes and expects `document` to exist.
- The component injects scoped styles into the returned form, so no extra stylesheet is required.
- This rewrite uses buttons instead of a styled native `<select>`, but keeps the same flat strip interaction from the original notebook.

## Roadmap

- Add tests
- Include [images](https://observablehq.com/@pierreleripoll/selectflatimages)
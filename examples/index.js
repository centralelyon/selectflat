import { selectFlat } from "../selectflat.js";

function mount(target, control) {
  document.querySelector(target).append(control);
  return control;
}

function bindValue(control, target, formatter) {
  const node = document.querySelector(target);

  function render() {
    node.textContent = formatter(control.value);
  }

  control.addEventListener("input", render);
  control.addEventListener("change", render);
  render();
}

function renderSnippet(target, code) {
  document.querySelector(target).textContent = code.trim();
}

function preloadImageElements(items) {
  const holder = document.createElement("div");
  holder.hidden = true;

  const nodes = new Map();
  items.forEach(({ key, src, alt }) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.dataset.key = key;
    holder.append(image);
    nodes.set(key, image);
  });

  document.body.append(holder);
  return nodes;
}

const flagDefinitions = [
  { code: "fr", label: "France" },
  { code: "us", label: "United States" },
  { code: "de", label: "Germany" },
  { code: "gb", label: "United Kingdom" },
  { code: "jp", label: "Japan" },
  { code: "br", label: "Brazil" },
  { code: "ca", label: "Canada" },
  { code: "mx", label: "Mexico" }
];

const flagImages = preloadImageElements(
  flagDefinitions.map(({ code, label }) => ({
    key: code,
    alt: `${label} flag`,
    src: `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${code}.svg`
  }))
);

const basic = mount(
  "#example-basic",
  selectFlat({
    options: ["A", "B", "C", "D"],
    value: "B",
    output: true,
    description: "your choice"
  })
);

bindValue(basic, "#value-basic", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-basic",
  `const basic = selectFlat({
  options: ["A", "B", "C", "D"],
  value: "B",
  output: true,
  description: "your choice"
});`
);

const textHover = mount(
  "#example-text-hover",
  selectFlat({
    title: "Text labels",
    description: "label",
    output: true,
    value: "beta",
    text: {
      visibility: "hover"
    },
    options: [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta" },
      { value: "gamma", label: "Gamma" },
      { value: "delta", label: "Delta" },
      { value: "epsilon", label: "Epsilon" }
    ]
  })
);

bindValue(textHover, "#value-text-hover", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-text-hover",
  `const textHover = selectFlat({
  title: "Text labels",
  description: "label",
  output: true,
  value: "beta",
  text: {
    visibility: "hover"
  },
  options: [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "gamma", label: "Gamma" },
    { value: "delta", label: "Delta" },
    { value: "epsilon", label: "Epsilon" }
  ]
});`
);

const textContent = mount(
  "#example-text-content",
  selectFlat({
    title: "Text labels",
    description: "label",
    output: true,
    value: "gamma",
    text: {
      visibility: "always",
      width: "content"
    },
    options: [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta" },
      { value: "gamma", label: "Gamma" },
      { value: "delta", label: "Delta" },
      { value: "epsilon", label: "Epsilon" }
    ]
  })
);

bindValue(textContent, "#value-text-content", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-text-content",
  `const textContent = selectFlat({
  title: "Text labels",
  description: "label",
  output: true,
  value: "gamma",
  text: {
    visibility: "always",
    width: "content"
  },
  options: [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "gamma", label: "Gamma" },
    { value: "delta", label: "Delta" },
    { value: "epsilon", label: "Epsilon" }
  ]
});`
);

const textClip = mount(
  "#example-text-clip",
  selectFlat({
    title: "Text labels",
    description: "label",
    output: true,
    value: "epsilon",
    text: {
      visibility: "always",
      overflow: "clip"
    },
    options: [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta" },
      { value: "gamma", label: "Gamma" },
      { value: "delta", label: "Delta" },
      { value: "epsilon", label: "Epsilon" }
    ]
  })
);

bindValue(textClip, "#value-text-clip", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-text-clip",
  `const textClip = selectFlat({
  title: "Text labels",
  description: "label",
  output: true,
  value: "epsilon",
  text: {
    visibility: "always",
    overflow: "clip"
  },
  options: [
    { value: "alpha", label: "Alpha" },
    { value: "beta", label: "Beta" },
    { value: "gamma", label: "Gamma" },
    { value: "delta", label: "Delta" },
    { value: "epsilon", label: "Epsilon" }
  ]
});`
);

const flags = mount(
  "#example-flags",
  selectFlat({
    title: "Flags",
    description: "country",
    output: true,
    value: "fr",
    options: flagDefinitions.map(({ code, label }) => ({
      value: code,
      label,
      image: flagImages.get(code),
      fit: "contain"
    }))
  })
);

bindValue(flags, "#value-flags", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-flags",
  `const flags = selectFlat({
  title: "Flags",
  description: "country",
  output: true,
  value: "fr",
  options: flagDefinitions.map(({ code, label }) => ({
    value: code,
    label,
    image: flagImages.get(code),
    fit: "contain"
  }))
});`
);

const emojiUrlFallback = {
  thumbsup: "https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png?v8",
  heart: "https://github.githubassets.com/images/icons/emoji/unicode/2764.png?v8",
  rocket: "https://github.githubassets.com/images/icons/emoji/unicode/1f680.png?v8",
  tada: "https://github.githubassets.com/images/icons/emoji/unicode/1f389.png?v8",
  sparkles: "https://github.githubassets.com/images/icons/emoji/unicode/2728.png?v8",
  wave: "https://github.githubassets.com/images/icons/emoji/unicode/1f44b.png?v8",
  warning: "https://github.githubassets.com/images/icons/emoji/unicode/26a0.png?v8",
  fire: "https://github.githubassets.com/images/icons/emoji/unicode/1f525.png?v8"
};

const emojiUrl = "https://raw.githubusercontent.com/Justineo/github-hovercard/master/assets/emoji.json";
const emojiMap = await fetch(emojiUrl)
  .then((response) => response.json())
  .catch(() => emojiUrlFallback);

const emojis = mount(
  "#example-emojis",
  selectFlat({
    title: "Emojis",
    description: "reaction",
    output: true,
    value: "rocket",
    options: [
      { value: "thumbsup", label: "thumbs up", image: emojiMap.thumbsup, fit: "contain" },
      { value: "heart", label: "heart", image: emojiMap.heart, fit: "contain" },
      { value: "rocket", label: "rocket", image: emojiMap.rocket, fit: "contain" },
      { value: "tada", label: "party", image: emojiMap.tada, fit: "contain" },
      { value: "sparkles", label: "sparkles", image: emojiMap.sparkles, fit: "contain" },
      { value: "wave", label: "wave", image: emojiMap.wave, fit: "contain" },
      { value: "warning", label: "warning", image: emojiMap.warning, fit: "contain" },
      { value: "fire", label: "fire", image: emojiMap.fire, fit: "contain" }
    ]
  })
);

bindValue(emojis, "#value-emojis", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-emojis",
  `const emojiMap = await fetch("https://raw.githubusercontent.com/Justineo/github-hovercard/master/assets/emoji.json")
  .then((response) => response.json());

const emojis = selectFlat({
  title: "Emojis",
  description: "reaction",
  output: true,
  value: "rocket",
  options: [
    { value: "thumbsup", label: "thumbs up", image: emojiMap.thumbsup, fit: "contain" },
    { value: "heart", label: "heart", image: emojiMap.heart, fit: "contain" },
    { value: "rocket", label: "rocket", image: emojiMap.rocket, fit: "contain" },
    { value: "tada", label: "party", image: emojiMap.tada, fit: "contain" },
    { value: "sparkles", label: "sparkles", image: emojiMap.sparkles, fit: "contain" },
    { value: "wave", label: "wave", image: emojiMap.wave, fit: "contain" },
    { value: "warning", label: "warning", image: emojiMap.warning, fit: "contain" },
    { value: "fire", label: "fire", image: emojiMap.fire, fit: "contain" }
  ]
});`
);

const grid = mount(
  "#example-grid",
  selectFlat({
    title: "Grid layout",
    description: "cells",
    output: true,
    value: "5",
    layout: {
      size: "1.5rem",
      gap: "0.2rem",
      direction: "grid",
      wrap: "wrap"
    },
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  })
);

bindValue(grid, "#value-grid", (value) => `value = ${value}`);
renderSnippet(
  "#snippet-grid",
  `const grid = selectFlat({
  title: "Grid layout",
  description: "cells",
  output: true,
  value: "5",
  layout: {
    size: "1.5rem",
    gap: "0.2rem",
    direction: "grid",
    wrap: "wrap"
  },
  options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
});`
);

const mathHost = document.querySelector("#example-math");

const a = selectFlat({
  options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  value: 7,
  output: true,
  description: "a"
});

const b = selectFlat({
  options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  value: 8,
  output: true,
  description: "b"
});

const c = selectFlat({
  options: [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    { value: 8, disabled: true },
    { value: 9, disabled: true }
  ],
  value: 1,
  output: true,
  description: "c"
});

mathHost.append(a, b, c);

const mathValue = document.querySelector("#value-math");

function renderProduct() {
  const factors = [a.value, b.value, c.value].filter((value) => value > 1);
  const prefix = factors.length > 0 ? factors.join(" x ") : "1";
  mathValue.textContent = `${prefix} = ${a.value * b.value * c.value}`;
}

[a, b, c].forEach((control) => {
  control.addEventListener("input", renderProduct);
  control.addEventListener("change", renderProduct);
});

renderProduct();

renderSnippet(
  "#snippet-math",
  `const a = selectFlat({
  options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  value: 7,
  output: true,
  description: "a"
});

const b = selectFlat({
  options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  value: 8,
  output: true,
  description: "b"
});

const c = selectFlat({
  options: [1, 2, 3, 4, 5, 6, 7, { value: 8, disabled: true }, { value: 9, disabled: true }],
  value: 1,
  output: true,
  description: "c"
});`
);

const multiple = mount(
  "#example-multiple",
  selectFlat({
    description: "shades",
    output: true,
    multiple: true,
    value: ["warm", "bright"],
    options: [
      { label: "warm", value: "warm" },
      { label: "cool", value: "cool" },
      { label: "bright", value: "bright" },
      { label: "muted", value: "muted" }
    ]
  })
);

bindValue(
  multiple,
  "#value-multiple",
  (value) => `value = [${value.map((entry) => `"${entry}"`).join(", ")}]`
);
renderSnippet(
  "#snippet-multiple",
  `const multiple = selectFlat({
  description: "shades",
  output: true,
  multiple: true,
  value: ["warm", "bright"],
  options: [
    { label: "warm", value: "warm" },
    { label: "cool", value: "cool" },
    { label: "bright", value: "bright" },
    { label: "muted", value: "muted" }
  ]
});`
);

const multipleForced = mount(
  "#example-multiple-forced",
  selectFlat({
    description: "required tags",
    output: true,
    multiple: true,
    value: ["warm"],
    options: [
      { label: "core", value: "core", forced: true },
      { label: "warm", value: "warm" },
      { label: "cool", value: "cool" },
      { label: "bright", value: "bright" }
    ]
  })
);

bindValue(
  multipleForced,
  "#value-multiple-forced",
  (value) => `value = [${value.map((entry) => `"${entry}"`).join(", ")}]`
);
renderSnippet(
  "#snippet-multiple-forced",
  `const multipleForced = selectFlat({
  description: "required tags",
  output: true,
  multiple: true,
  value: ["warm"],
  options: [
    { label: "core", value: "core", forced: true },
    { label: "warm", value: "warm" },
    { label: "cool", value: "cool" },
    { label: "bright", value: "bright" }
  ]
});`
);

const layoutRow = mount(
  "#example-layout-row",
  selectFlat({
    description: "wide strip",
    output: true,
    value: "D",
    layout: {
      size: "1.4rem",
      gap: "0.25rem",
      direction: "row",
      wrap: "nowrap"
    },
    options: ["A", "B", "C", "D", "E", "F"]
  })
);

bindValue(
  layoutRow,
  "#value-layout-row",
  (value) =>
    `row layout = ${value}; size=${layoutRow.layout.size}; gap=${layoutRow.layout.gap}; wrap=${layoutRow.layout.wrap}`
);
renderSnippet(
  "#snippet-layout-row",
  `const layoutRow = selectFlat({
  description: "wide strip",
  output: true,
  value: "D",
  layout: {
    size: "1.4rem",
    gap: "0.25rem",
    direction: "row",
    wrap: "nowrap"
  },
  options: ["A", "B", "C", "D", "E", "F"]
});`
);

const layoutColumn = mount(
  "#example-layout-column",
  selectFlat({
    description: "vertical stack",
    output: true,
    value: 3,
    layout: {
      size: 22,
      gap: 6,
      direction: "column",
      wrap: false
    },
    options: [1, 2, 3, 4, 5]
  })
);

bindValue(
  layoutColumn,
  "#value-layout-column",
  (value) =>
    `column layout = ${value}; direction=${layoutColumn.layout.direction}; wrap=${layoutColumn.layout.wrap}`
);
renderSnippet(
  "#snippet-layout-column",
  `const layoutColumn = selectFlat({
  description: "vertical stack",
  output: true,
  value: 3,
  layout: {
    size: 22,
    gap: 6,
    direction: "column",
    wrap: false
  },
  options: [1, 2, 3, 4, 5]
});`
);

const programmatic = mount(
  "#example-programmatic",
  selectFlat({
    options: ["A", "B", "C", "D"],
    value: "C",
    output: true,
    description: "controlled value"
  })
);

const programmaticChoice = document.querySelector("#programmatic-choice");
const programmaticApply = document.querySelector("#programmatic-apply");
const programmaticReset = document.querySelector("#programmatic-reset");

programmatic.options.forEach(({ value, label, disabled }) => {
  const option = document.createElement("option");
  option.value = String(programmaticChoice.options.length);
  option.textContent = label;
  option.disabled = disabled;
  option.selected = value === programmatic.initialValue;
  programmaticChoice.append(option);
});

function findProgrammaticIndex(value) {
  return programmatic.options.findIndex(
    (option) => Object.is(option.value, value) || option.value === value
  );
}

function syncProgrammaticChoice() {
  const selectedIndex = findProgrammaticIndex(programmatic.value);
  if (selectedIndex >= 0) {
    programmaticChoice.value = String(selectedIndex);
  }
}

programmaticApply.addEventListener("click", () => {
  const selectedOption = programmatic.options[programmaticChoice.selectedIndex];
  if (selectedOption) {
    programmatic.setValue(selectedOption.value);
  }
});

programmaticReset.addEventListener("click", () => {
  programmatic.resetValue();
});

programmatic.addEventListener("input", syncProgrammaticChoice);
programmatic.addEventListener("change", syncProgrammaticChoice);

bindValue(
  programmatic,
  "#value-programmatic",
  (value) => `value = ${value} (initial = ${programmatic.initialValue})`
);
renderSnippet(
  "#snippet-programmatic",
  `const programmatic = selectFlat({
  options: ["A", "B", "C", "D"],
  value: "C",
  output: true,
  description: "controlled value"
});`
);

syncProgrammaticChoice();

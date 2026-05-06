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

syncProgrammaticChoice();

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

programmatic.addEventListener("change", syncProgrammaticChoice);

bindValue(
  programmatic,
  "#value-programmatic",
  (value) => `value = ${value} (initial = ${programmatic.initialValue})`
);

syncProgrammaticChoice();

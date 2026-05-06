const CLASS_NAME = "selectflat";

let instanceCount = 0;

function nextId() {
  instanceCount += 1;
  return `${CLASS_NAME}-${instanceCount}`;
}

function sameValue(a, b) {
  return Object.is(a, b) || a === b;
}

function toConfig(config) {
  return Array.isArray(config) ? { options: config } : { ...config };
}

function normalizeOption(option) {
  if (
    option &&
    typeof option === "object" &&
    !Array.isArray(option) &&
    ("value" in option || "label" in option || "disabled" in option)
  ) {
    const value = "value" in option ? option.value : option.label;
    const label = "label" in option ? option.label : value;

    return {
      value,
      label: String(label ?? ""),
      disabled: Boolean(option.disabled)
    };
  }

  return {
    value: option,
    label: String(option ?? ""),
    disabled: false
  };
}

function uniqueSortedIndexes(indexes) {
  return [...new Set(indexes)].sort((a, b) => a - b);
}

function indexesFromValue(options, value, multiple) {
  if (multiple) {
    if (!Array.isArray(value)) return [];

    return uniqueSortedIndexes(
      value
        .map((entry) =>
          options.findIndex((option) => sameValue(option.value, entry))
        )
        .filter((index) => index >= 0)
    );
  }

  if (value === undefined) {
    return options.length > 0 ? [0] : [];
  }

  const index = options.findIndex((option) => sameValue(option.value, value));
  if (index >= 0) return [index];

  return options.length > 0 ? [0] : [];
}

function labelsForIndexes(options, indexes) {
  return indexes.map((index) => options[index].label).join(", ");
}

function valuesForIndexes(options, indexes, multiple) {
  const values = indexes.map((index) => options[index].value);
  return multiple ? values : values[0];
}

function createScopedStyles(id, showOutput) {
  return `
#${id} {
  --selectflat-text: #18181b;
  --selectflat-muted: #57534e;
  --selectflat-surface: #fffdf8;
  --selectflat-option: #f4f4f4;
  --selectflat-selected: #18181b;
  --selectflat-hover: #ef8f35;
  --selectflat-disabled: #d6d3d1;
  --selectflat-border: #18181b;
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  font: 500 13px/1.4 "Avenir Next", "Segoe UI", sans-serif;
  color: var(--selectflat-text);
}

#${id} .${CLASS_NAME}__title {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--selectflat-muted);
}

#${id} .${CLASS_NAME}__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  min-height: 1em;
}

#${id} .${CLASS_NAME}__description {
  color: var(--selectflat-muted);
}

#${id} .${CLASS_NAME}__output {
  display: ${showOutput ? "inline-block" : "none"};
  min-width: 1ch;
  color: var(--selectflat-text);
  font-weight: 700;
}

#${id} .${CLASS_NAME}__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
}

#${id} .${CLASS_NAME}__option {
  width: 1rem;
  height: 1rem;
  margin: 0;
  padding: 0;
  border: 0.5px solid var(--selectflat-border);
  border-radius: 0;
  background: var(--selectflat-option);
  color: transparent;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  transition: transform 120ms ease, background-color 120ms ease;
}

#${id} .${CLASS_NAME}__option[data-selected="true"] {
  background: var(--selectflat-selected);
}

#${id} .${CLASS_NAME}__option[data-hovered="true"] {
  background: var(--selectflat-hover);
}

#${id} .${CLASS_NAME}__option[aria-disabled="true"] {
  background: var(--selectflat-disabled);
  border-color: var(--selectflat-muted);
  cursor: not-allowed;
}

#${id} .${CLASS_NAME}__option[aria-disabled="true"][data-hovered="true"] {
  background: #c9c6c1;
}

#${id} .${CLASS_NAME}__option:focus-visible {
  outline: 2px solid #1459c7;
  outline-offset: 2px;
}

#${id} .${CLASS_NAME}__option:active {
  transform: translateY(1px);
}

#${id} .${CLASS_NAME}__submit {
  align-self: flex-start;
  border: 1px solid var(--selectflat-border);
  background: var(--selectflat-surface);
  color: var(--selectflat-text);
  padding: 0.3rem 0.65rem;
  font: inherit;
  cursor: pointer;
}
`.trim();
}

export function selectFlat(config = {}) {
  const {
    value: initialValue,
    title,
    description,
    submit,
    multiple = false,
    output = false,
    options: rawOptions = []
  } = toConfig(config);

  const options = rawOptions.map(normalizeOption);
  const id = nextId();
  const form = document.createElement("form");
  const styles = document.createElement("style");
  const optionStrip = document.createElement("div");
  const outputNode = document.createElement("output");
  const descriptionNode = document.createElement("span");
  const metaNode = document.createElement("div");
  const buttons = [];
  const initialIndexes = indexesFromValue(options, initialValue, multiple);

  let committedIndexes = [...initialIndexes];
  let previewIndexes = null;
  let hoveredIndex = null;

  form.id = id;
  form.className = CLASS_NAME;
  styles.textContent = createScopedStyles(id, output);
  optionStrip.className = `${CLASS_NAME}__options`;
  optionStrip.setAttribute("role", multiple ? "group" : "radiogroup");
  metaNode.className = `${CLASS_NAME}__meta`;
  descriptionNode.className = `${CLASS_NAME}__description`;
  outputNode.className = `${CLASS_NAME}__output`;
  descriptionNode.textContent =
    description && output ? `${description}:` : description ?? "";

  form.append(styles);

  if (title) {
    const titleNode = document.createElement("div");
    titleNode.className = `${CLASS_NAME}__title`;
    titleNode.textContent = title;
    form.append(titleNode);
  }

  if (description || output) {
    if (description) metaNode.append(descriptionNode);
    if (output) metaNode.append(outputNode);
    form.append(metaNode);
  }

  function activeIndexes() {
    return previewIndexes ?? committedIndexes;
  }

  function syncOutput() {
    const labels = labelsForIndexes(options, activeIndexes());
    outputNode.value = labels;
    outputNode.textContent = labels;
  }

  function renderButtons() {
    const committed = new Set(committedIndexes);

    buttons.forEach((button, index) => {
      button.dataset.selected = committed.has(index) ? "true" : "false";
      button.dataset.hovered = hoveredIndex === index ? "true" : "false";
      button.setAttribute(
        "aria-checked",
        committed.has(index) ? "true" : "false"
      );
    });

    syncOutput();
  }

  function dispatchFormEvent(type) {
    form.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function commit(index) {
    if (options[index].disabled) return;

    if (multiple) {
      const selected = new Set(committedIndexes);

      if (selected.has(index)) selected.delete(index);
      else selected.add(index);

      committedIndexes = [...selected].sort((a, b) => a - b);
    } else {
      committedIndexes = [index];
    }

    renderButtons();
    dispatchFormEvent("input");
    dispatchFormEvent("change");
  }

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${CLASS_NAME}__option`;
    button.textContent = option.label;
    button.title = option.label;
    button.dataset.index = String(index);
    button.setAttribute("role", multiple ? "checkbox" : "radio");
    button.setAttribute("aria-label", option.label);
    button.setAttribute("aria-disabled", option.disabled ? "true" : "false");
    button.tabIndex = option.disabled ? -1 : 0;
    optionStrip.append(button);
    buttons.push(button);
  });

  optionStrip.addEventListener("pointerover", (event) => {
    const button = event.target.closest(`.${CLASS_NAME}__option`);
    if (!button || !optionStrip.contains(button)) return;

    hoveredIndex = Number(button.dataset.index);
    previewIndexes = options[hoveredIndex].disabled ? null : [hoveredIndex];
    renderButtons();
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("focusin", (event) => {
    const button = event.target.closest(`.${CLASS_NAME}__option`);
    if (!button || !optionStrip.contains(button)) return;

    hoveredIndex = Number(button.dataset.index);
    previewIndexes = options[hoveredIndex].disabled ? null : [hoveredIndex];
    renderButtons();
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("pointerleave", () => {
    hoveredIndex = null;
    previewIndexes = null;
    renderButtons();
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("focusout", (event) => {
    if (optionStrip.contains(event.relatedTarget)) return;

    hoveredIndex = null;
    previewIndexes = null;
    renderButtons();
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("click", (event) => {
    const button = event.target.closest(`.${CLASS_NAME}__option`);
    if (!button || !optionStrip.contains(button)) return;

    commit(Number(button.dataset.index));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    dispatchFormEvent("input");
    dispatchFormEvent("change");
  });

  form.addEventListener("reset", () => {
    queueMicrotask(() => {
      committedIndexes = [...initialIndexes];
      hoveredIndex = null;
      previewIndexes = null;
      renderButtons();
      dispatchFormEvent("input");
      dispatchFormEvent("change");
    });
  });

  Object.defineProperty(form, "value", {
    configurable: true,
    enumerable: true,
    get() {
      return valuesForIndexes(options, activeIndexes(), multiple);
    },
    set(nextValue) {
      committedIndexes = indexesFromValue(options, nextValue, multiple);
      previewIndexes = null;
      hoveredIndex = null;
      renderButtons();
    }
  });

  Object.defineProperty(form, "options", {
    configurable: true,
    enumerable: true,
    value: options.map((option) => ({ ...option }))
  });

  form.output = outputNode;
  form.append(optionStrip);

  if (submit) {
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = `${CLASS_NAME}__submit`;
    submitButton.textContent =
      typeof submit === "string" ? submit : "Apply";
    form.append(submitButton);
  }

  renderButtons();

  return form;
}

export { selectFlat as selectflat };

export default selectFlat;

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

function isElement(value) {
  return typeof Element !== "undefined" && value instanceof Element;
}

function normalizeImageFit(value) {
  const fit = typeof value === "string" ? value.toLowerCase() : "";

  if (["rescale", "contain", "fit"].includes(fit)) return "contain";
  if (["crop", "crope", "cover"].includes(fit)) return "cover";
  if (["fill", "stretch"].includes(fit)) return "fill";
  if (["none", "original"].includes(fit)) return "none";
  if (["scale-down", "scaledown"].includes(fit)) return "scale-down";

  return "contain";
}

function normalizeImage(image, defaults = {}) {
  if (image === undefined || image === null) return null;

  if (typeof image === "string") {
    return {
      src: image,
      element: null,
      alt: defaults.alt ?? "",
      fit: normalizeImageFit(defaults.fit)
    };
  }

  if (isElement(image)) {
    return {
      src: null,
      element: image,
      alt: defaults.alt ?? "",
      fit: normalizeImageFit(defaults.fit)
    };
  }

  if (typeof image === "object" && !Array.isArray(image)) {
    const element = image.element ?? image.node ?? image.el ?? null;
    const src = image.src ?? image.url ?? image.href ?? null;

    return {
      src,
      element: isElement(element) ? element : null,
      alt: image.alt ?? defaults.alt ?? "",
      fit: normalizeImageFit(
        image.fit ?? image.objectFit ?? image.mode ?? defaults.fit
      ),
      loading: image.loading,
      decoding: image.decoding,
      crossOrigin: image.crossOrigin ?? image.crossorigin,
      referrerPolicy: image.referrerPolicy ?? image.referrerpolicy
    };
  }

  return null;
}

function normalizeOption(option) {
  if (
    option &&
    typeof option === "object" &&
    !Array.isArray(option) &&
    (
      "value" in option ||
      "label" in option ||
      "image" in option ||
      "disabled" in option ||
      "forced" in option
    )
  ) {
    const value = "value" in option ? option.value : option.label;
    const label = "label" in option ? option.label : value;
    const image = normalizeImage(option.image, {
      fit: option.fit ?? option.imageFit,
      alt: option.alt
    });

    return {
      value,
      label: String(label ?? ""),
      image,
      disabled: Boolean(option.disabled),
      forced: Boolean(option.forced)
    };
  }

  return {
    value: option,
    label: String(option ?? ""),
    image: null,
    disabled: false,
    forced: false
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

function cloneValue(value) {
  return Array.isArray(value) ? [...value] : value;
}

function forcedIndexesFromOptions(options, multiple) {
  if (!multiple) return [];

  return options.reduce((indexes, option, index) => {
    if (option.forced) indexes.push(index);
    return indexes;
  }, []);
}

function toCssLength(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return typeof value === "number" ? `${value}px` : String(value);
}

function normalizeDirection(value) {
  return ["row", "row-reverse", "column", "column-reverse", "grid"].includes(value)
    ? value
    : "row";
}

function normalizeWrap(value) {
  if (typeof value === "boolean") return value ? "wrap" : "nowrap";
  return ["wrap", "nowrap", "wrap-reverse"].includes(value) ? value : "wrap";
}

function normalizeLayout(layout = {}) {
  return {
    size: toCssLength(layout.size, "1rem"),
    gap: toCssLength(layout.gap, "1px"),
    direction: normalizeDirection(layout.direction),
    wrap: normalizeWrap(layout.wrap)
  };
}

function normalizeTextVisibility(value) {
  const visibility = typeof value === "string" ? value.toLowerCase() : "";
  if (["always", "hover", "hidden"].includes(visibility)) return visibility;
  return "hidden";
}

function normalizeTextWidth(value) {
  const width = typeof value === "string" ? value.toLowerCase() : "";
  if (["content", "fit", "auto"].includes(width)) return "content";
  return "fixed";
}

function normalizeTextOverflow(value) {
  const overflow = typeof value === "string" ? value.toLowerCase() : "";
  if (["ellipsis", "clip"].includes(overflow)) return overflow;
  return "clip";
}

function normalizeText(text = {}) {
  return {
    visibility: normalizeTextVisibility(text.visibility ?? text.show),
    width: normalizeTextWidth(text.width ?? text.mode),
    overflow: normalizeTextOverflow(text.overflow)
  };
}

function normalizeDispatchOptions(options) {
  return {
    dispatch: options?.dispatch ?? true
  };
}

function createScopedStyles(id, showOutput, layout, text) {
  const isGrid = layout.direction === "grid";
  const optionDirection = isGrid ? "row" : layout.direction;
  const optionWrap = isGrid ? "wrap" : layout.wrap;

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
  --selectflat-forced-border: #1459c7;
  --selectflat-option-size: ${layout.size};
  --selectflat-option-gap: ${layout.gap};
  --selectflat-option-direction: ${optionDirection};
  --selectflat-option-wrap: ${optionWrap};
  --selectflat-text-width: ${text.width};
  --selectflat-text-overflow: ${text.overflow};
  display: ${isGrid ? "block" : "inline-flex"};
  width: ${isGrid ? "100%" : "auto"};
  max-width: 100%;
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

#${id} .${CLASS_NAME}__output-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

#${id} .${CLASS_NAME}__output-image {
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  object-fit: contain;
  flex: 0 0 auto;
}

#${id} .${CLASS_NAME}__options {
  display: flex;
  flex-direction: var(--selectflat-option-direction);
  flex-wrap: var(--selectflat-option-wrap);
  width: ${isGrid ? "100%" : "auto"};
  max-width: 100%;
  align-content: flex-start;
  gap: var(--selectflat-option-gap);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

#${id} .${CLASS_NAME}__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--selectflat-option-size);
  height: var(--selectflat-option-size);
  margin: 0;
  padding: 0;
  border: 0.5px solid var(--selectflat-border);
  border-radius: 0;
  background: var(--selectflat-option);
  color: var(--selectflat-text);
  font: inherit;
  line-height: 1;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease, background-color 120ms ease;
}

#${id} .${CLASS_NAME}__option[data-text-width="content"] {
  width: auto;
  min-width: var(--selectflat-option-size);
  padding-inline: 0.35rem;
}

#${id} .${CLASS_NAME}__option[data-text-width="fixed"] {
  width: var(--selectflat-option-size);
  padding-inline: 0;
}

#${id} .${CLASS_NAME}__label {
  display: block;
  max-width: 100%;
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: var(--selectflat-text-overflow);
  opacity: 0;
  transition: opacity 120ms ease;
}

#${id} .${CLASS_NAME}__option[data-text-visibility="always"] .${CLASS_NAME}__label,
#${id} .${CLASS_NAME}__option[data-text-visibility="hover"][data-hovered="true"] .${CLASS_NAME}__label {
  opacity: 1;
}

#${id} .${CLASS_NAME}__option[data-has-image="true"] .${CLASS_NAME}__label {
  opacity: 0;
}

#${id} .${CLASS_NAME}__option img,
#${id} .${CLASS_NAME}__option svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: var(--selectflat-image-fit, contain);
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  opacity: 0.5;
  transition: opacity 120ms ease;
}

#${id} .${CLASS_NAME}__option[data-selected="true"] img,
#${id} .${CLASS_NAME}__option[data-selected="true"] svg,
#${id} .${CLASS_NAME}__option[data-hovered="true"] img,
#${id} .${CLASS_NAME}__option[data-hovered="true"] svg {
  opacity: 1;
}

#${id} .${CLASS_NAME}__option[data-selected="true"] {
  background: var(--selectflat-selected);
}

#${id} .${CLASS_NAME}__option[data-forced="true"] {
  border-color: var(--selectflat-forced-border);
  box-shadow: inset 0 0 0 1px var(--selectflat-forced-border);
  cursor: not-allowed;
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
    layout = {},
    text = {},
    options: rawOptions = []
  } = toConfig(config);

  const options = rawOptions.map(normalizeOption);
  const forcedIndexes = forcedIndexesFromOptions(options, multiple);
  const normalizedLayout = normalizeLayout(layout);
  const normalizedText = normalizeText(text);
  const id = nextId();
  const form = document.createElement("form");
  const styles = document.createElement("style");
  const optionStrip = document.createElement("div");
  const outputNode = document.createElement("output");
  const descriptionNode = document.createElement("span");
  const metaNode = document.createElement("div");
  const buttons = [];

  form.id = id;
  form.className = CLASS_NAME;
  styles.textContent = createScopedStyles(id, output, normalizedLayout, normalizedText);
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

  function normalizeCommittedIndexes(indexes) {
    return multiple ? uniqueSortedIndexes([...forcedIndexes, ...indexes]) : indexes;
  }

  function isForcedIndex(index) {
    return multiple && forcedIndexes.includes(index);
  }

  function previewIndexesFor(index) {
    if (options[index].disabled) return null;
    if (multiple) return normalizeCommittedIndexes([...committedIndexes, index]);
    return [index];
  }

  const initialIndexes = normalizeCommittedIndexes(
    indexesFromValue(options, initialValue, multiple)
  );

  let committedIndexes = [...initialIndexes];
  let previewIndexes = null;
  let hoveredIndex = null;
  let previewPersistent = false;
  let touchTapIndex = null;
  let touchState = null;
  let suppressClickUntil = 0;

  function activeIndexes() {
    return previewIndexes ?? committedIndexes;
  }

  function sameIndexes(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    return a.every((value, index) => value === b[index]);
  }

  function setPreview(nextIndexes, nextHoveredIndex, { persistent = false } = {}) {
    previewIndexes = nextIndexes;
    hoveredIndex = nextHoveredIndex;
    previewPersistent = persistent && nextIndexes !== null;

    if (previewPersistent) {
      touchTapIndex = nextHoveredIndex;
    }

    renderButtons();
  }

  function clearPreview({ dispatch = false, force = true } = {}) {
    if (!force && previewPersistent) return false;
    if (previewIndexes === null && hoveredIndex === null && !previewPersistent) {
      return false;
    }

    previewIndexes = null;
    hoveredIndex = null;
    previewPersistent = false;
    touchTapIndex = null;
    renderButtons();

    if (dispatch) dispatchFormEvent("input");
    return true;
  }

  function isTouchPointerEvent(event) {
    return event.pointerType === "touch" || event.pointerType === "pen";
  }

  function buttonFromTarget(target) {
    const button = target?.closest(`.${CLASS_NAME}__option`);
    return button && optionStrip.contains(button) ? button : null;
  }

  function buttonFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return buttonFromTarget(element);
  }

  function cloneOutputImage(option) {
    if (!option?.image) return null;

    const { element, src, alt, loading, decoding, crossOrigin, referrerPolicy } =
      option.image;
    const imageNode = element ? element.cloneNode(true) : document.createElement("img");

    if (!element) {
      imageNode.src = src;
      imageNode.alt = alt ?? "";
      if (loading) imageNode.loading = loading;
      if (decoding) imageNode.decoding = decoding;
      if (crossOrigin !== undefined && crossOrigin !== null) {
        imageNode.crossOrigin = crossOrigin;
      }
      if (referrerPolicy) imageNode.referrerPolicy = referrerPolicy;
    }

    imageNode.removeAttribute?.("id");
    imageNode.setAttribute("aria-hidden", "true");
    if ("focusable" in imageNode) imageNode.focusable = "false";
    imageNode.classList?.add(`${CLASS_NAME}__output-image`);
    return imageNode;
  }

  function syncOutput() {
    const indexes = activeIndexes();
    const labels = labelsForIndexes(options, indexes);
    let outputText = labels;

    if (indexes.length === 1 && options[indexes[0]].image) {
      const option = options[indexes[0]];
      const inner = document.createElement("span");
      inner.className = `${CLASS_NAME}__output-inner`;
      inner.append(cloneOutputImage(option));

      const valueText = document.createElement("span");
      valueText.textContent = String(option.value ?? "");
      inner.append(valueText);

      outputNode.textContent = "";
      outputNode.append(inner);
      outputText = String(option.value ?? "");
    } else {
      outputNode.textContent = labels;
    }

    outputNode.value = outputText;
  }

  function renderButtons() {
    const committed = new Set(committedIndexes);

    buttons.forEach((button, index) => {
      const option = options[index];
      button.dataset.selected = committed.has(index) ? "true" : "false";
      button.dataset.forced = isForcedIndex(index) ? "true" : "false";
      button.dataset.hovered = hoveredIndex === index ? "true" : "false";
      button.dataset.hasImage = option.image ? "true" : "false";
      button.dataset.textVisibility = normalizedText.visibility;
      button.dataset.textWidth = normalizedText.width;
      button.setAttribute(
        "aria-checked",
        committed.has(index) ? "true" : "false"
      );

      if (option.image) {
        button.style.setProperty("--selectflat-image-fit", option.image.fit);
      } else {
        button.style.removeProperty("--selectflat-image-fit");
      }
    });

    syncOutput();
  }

  function dispatchFormEvent(type) {
    form.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function dispatchValueEvents() {
    dispatchFormEvent("input");
    dispatchFormEvent("change");
  }

  function applyCommittedIndexes(nextIndexes, { dispatch = false } = {}) {
    committedIndexes = normalizeCommittedIndexes(nextIndexes);
    if (!clearPreview()) {
      renderButtons();
    }

    if (dispatch) dispatchValueEvents();
  }

  function applyCommittedValue(nextValue, { dispatch = false } = {}) {
    applyCommittedIndexes(indexesFromValue(options, nextValue, multiple), {
      dispatch
    });
  }

  function resetCommittedValue({ dispatch = false } = {}) {
    applyCommittedIndexes(initialIndexes, { dispatch });
  }

  function multipleIndexesAfterTouchPath(pathIndexes, mode) {
    const selected = new Set(committedIndexes);

    pathIndexes.forEach((index) => {
      if (options[index].disabled || isForcedIndex(index)) return;
      if (mode === "remove") selected.delete(index);
      else selected.add(index);
    });

    return normalizeCommittedIndexes([...selected]);
  }

  function previewIndexesForTouchState(state) {
    if (!state || state.currentIndex === null) return null;

    if (multiple) {
      return multipleIndexesAfterTouchPath(state.pathIndexes, state.mode);
    }

    return previewIndexesFor(state.currentIndex);
  }

  function startTouchInteraction(index, event) {
    touchState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentIndex: index,
      moved: false,
      pathIndexes: new Set([index]),
      mode:
        multiple && committedIndexes.includes(index) ? "remove" : "add"
    };

    setPreview(previewIndexesForTouchState(touchState), index);
    dispatchFormEvent("input");
  }

  function updateTouchInteraction(index, event) {
    if (!touchState) return;

    const movedX = Math.abs(event.clientX - touchState.startX);
    const movedY = Math.abs(event.clientY - touchState.startY);
    if (movedX > 6 || movedY > 6) {
      touchState.moved = true;
    }

    if (index === null || index === touchState.currentIndex) return;
    if (options[index].disabled || isForcedIndex(index)) return;

    touchState.currentIndex = index;
    touchState.pathIndexes.add(index);
    if (touchState.pathIndexes.size > 1) {
      touchState.moved = true;
    }

    setPreview(previewIndexesForTouchState(touchState), index);
    dispatchFormEvent("input");
  }

  function commitTouchInteraction(state) {
    if (!state || state.currentIndex === null) return;

    if (multiple) {
      applyCommittedIndexes(
        multipleIndexesAfterTouchPath(state.pathIndexes, state.mode),
        { dispatch: true }
      );
    } else {
      applyCommittedIndexes([state.currentIndex], { dispatch: true });
    }
  }

  function finishTouchInteraction(event, { cancel = false } = {}) {
    if (!touchState || event.pointerId !== touchState.pointerId) return;

    const state = touchState;
    touchState = null;

    if (optionStrip.hasPointerCapture?.(event.pointerId)) {
      optionStrip.releasePointerCapture(event.pointerId);
    }

    if (cancel) {
      clearPreview({ dispatch: true });
      return;
    }

    if (state.moved) {
      commitTouchInteraction(state);
      return;
    }

    if (touchTapIndex === state.currentIndex) {
      commitTouchInteraction(state);
      return;
    }

    const nextPreview = previewIndexesForTouchState(state);
    if (!sameIndexes(nextPreview, committedIndexes)) {
      setPreview(nextPreview, state.currentIndex, { persistent: true });
      return;
    }

    clearPreview({ dispatch: true });
  }

  function commit(index) {
    if (options[index].disabled || isForcedIndex(index)) return;

    if (multiple) {
      const selected = new Set(committedIndexes);

      if (selected.has(index)) selected.delete(index);
      else selected.add(index);

      applyCommittedIndexes([...selected].sort((a, b) => a - b), {
        dispatch: true
      });
    } else {
      applyCommittedIndexes([index], { dispatch: true });
    }
  }

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${CLASS_NAME}__option`;
    button.title = option.forced ? `${option.label} (forced)` : option.label;
    button.dataset.index = String(index);
    button.setAttribute("role", multiple ? "checkbox" : "radio");
    button.setAttribute("aria-label", option.label);
    button.setAttribute(
      "aria-disabled",
      option.disabled || option.forced ? "true" : "false"
    );
    button.tabIndex = option.disabled || option.forced ? -1 : 0;

    const labelNode = document.createElement("span");
    labelNode.className = `${CLASS_NAME}__label`;
    labelNode.textContent = option.label;

    if (option.image) {
      const imageNode = cloneOutputImage(option);
      imageNode.classList.remove(`${CLASS_NAME}__output-image`);
      button.append(imageNode);
    }

    button.append(labelNode);

    optionStrip.append(button);
    buttons.push(button);
  });

  optionStrip.addEventListener("pointerover", (event) => {
    if (isTouchPointerEvent(event) || touchState) return;

    const button = event.target.closest(`.${CLASS_NAME}__option`);
    if (!button || !optionStrip.contains(button)) return;

    const index = Number(button.dataset.index);
    setPreview(previewIndexesFor(index), index);
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("focusin", (event) => {
    if (touchState) return;

    const button = event.target.closest(`.${CLASS_NAME}__option`);
    if (!button || !optionStrip.contains(button)) return;

    const index = Number(button.dataset.index);
    setPreview(previewIndexesFor(index), index);
    dispatchFormEvent("input");
  });

  optionStrip.addEventListener("pointerleave", () => {
    if (touchState) return;
    clearPreview({ dispatch: true, force: false });
  });

  optionStrip.addEventListener("focusout", (event) => {
    if (touchState) return;
    if (optionStrip.contains(event.relatedTarget)) return;
    clearPreview({ dispatch: true, force: false });
  });

  optionStrip.addEventListener("pointerdown", (event) => {
    if (!isTouchPointerEvent(event)) return;

    const button = buttonFromTarget(event.target);
    if (!button) return;

    const index = Number(button.dataset.index);
    if (options[index].disabled || isForcedIndex(index)) return;

    suppressClickUntil = Date.now() + 500;
    event.preventDefault();
    optionStrip.setPointerCapture?.(event.pointerId);
    startTouchInteraction(index, event);
  });

  optionStrip.addEventListener("pointermove", (event) => {
    if (!touchState || event.pointerId !== touchState.pointerId) return;

    event.preventDefault();
    const button = buttonFromPoint(event.clientX, event.clientY);
    const index = button ? Number(button.dataset.index) : null;
    updateTouchInteraction(index, event);
  });

  optionStrip.addEventListener("pointerup", (event) => {
    if (!touchState || event.pointerId !== touchState.pointerId) return;

    event.preventDefault();
    finishTouchInteraction(event);
  });

  optionStrip.addEventListener("pointercancel", (event) => {
    if (!touchState || event.pointerId !== touchState.pointerId) return;

    finishTouchInteraction(event, { cancel: true });
  });

  optionStrip.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) return;

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
      resetCommittedValue({ dispatch: true });
    });
  });

  Object.defineProperty(form, "value", {
    configurable: true,
    enumerable: true,
    get() {
      return valuesForIndexes(options, activeIndexes(), multiple);
    },
    set(nextValue) {
      applyCommittedValue(nextValue, { dispatch: true });
    }
  });

  Object.defineProperty(form, "initialValue", {
    configurable: true,
    enumerable: true,
    get() {
      return cloneValue(valuesForIndexes(options, initialIndexes, multiple));
    }
  });

  Object.defineProperty(form, "options", {
    configurable: true,
    enumerable: true,
    value: options.map((option) => ({ ...option }))
  });

  Object.defineProperty(form, "layout", {
    configurable: true,
    enumerable: true,
    value: { ...normalizedLayout }
  });

  form.setValue = (nextValue, options) => {
    applyCommittedValue(nextValue, normalizeDispatchOptions(options));
    return form;
  };

  form.resetValue = (options) => {
    resetCommittedValue(normalizeDispatchOptions(options));
    return form;
  };

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

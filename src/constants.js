export const MODULE_ID = "tarokka-reading";

export function modulePath(relativePath) {
  return `modules/${MODULE_ID}/${relativePath}`;
}

export function t(key, data) {
  if (data) {
    return game.i18n.format(key, data);
  }
  return game.i18n.localize(key);
}

export function renderTemplate(path, data) {
  const render = foundry?.applications?.handlebars?.renderTemplate ?? globalThis.renderTemplate;
  return render(path, data);
}

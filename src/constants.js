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

export async function confirmDialog(title, content) {
  const DialogV2 = foundry.applications?.api?.DialogV2;
  if (DialogV2) {
    return DialogV2.confirm({ window: { title }, content: `<p>${content}</p>` });
  }
  return Dialog.confirm({ title, content: `<p>${content}</p>` });
}

export function backToTokenControls() {
  setTimeout(() => {
    if (game.release.generation >= 13) {
      ui.controls.activate({ control: "tokens" });
      return;
    }
    ui.controls.initialize({ control: "token" });
  }, 0);
}

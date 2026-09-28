import { MODULE_ID, confirmDialog, modulePath, t } from "./constants.js";
import { COMMON_DECK, HIGH_DECK } from "./deck.js";
import { browseTarget, cleanOverrides, customImage, fileSlug, matchFolderImages } from "./customization.js";

const GROUPS = ["crowns", "swords", "stars", "coins", "glyphs"];
const BACK_ID = "back";

function filePickerClass() {
  return foundry.applications?.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
}

function displayedName(row) {
  const input = row.querySelector("[data-name-input]");
  if (input?.value.trim()) {
    return input.value;
  }
  return row.dataset.printedName;
}

function row(id, printedName, overrides) {
  const name = overrides[id]?.name ?? "";
  const fileName = fileSlug(name || printedName);
  return {
    id,
    printedName,
    fileName,
    showId: fileName !== id,
    name,
    image: overrides[id]?.image ?? "",
    preview: customImage(id, overrides)
  };
}

export class TarokkaCardsConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "tarokka-cards-config",
      title: t("TAROKKA.CardsConfig.Title"),
      template: modulePath("src/cards-config.html"),
      width: 640,
      height: 700,
      resizable: true,
      scrollY: [".tk-config-list"],
      classes: ["tarokka-reading", "tarokka-cards-config"],
      closeOnSubmit: true
    });
  }

  getData() {
    const overrides = game.settings.get(MODULE_ID, "cardOverrides") ?? {};
    const cards = [...HIGH_DECK, ...COMMON_DECK];
    const groups = GROUPS.map((suit) => ({
      label: t(`TAROKKA.Suits.${suit}`),
      cards: cards.filter((card) => card.suit === suit).map((card) => row(card.id, t(`TAROKKA.Cards.${card.id}`), overrides))
    }));
    const back = { label: t("TAROKKA.CardsConfig.Back"), cards: [{ ...row(BACK_ID, t("TAROKKA.CardsConfig.Back"), overrides), fileName: BACK_ID, showId: false, isBack: true }] };
    return { groups: [back, ...groups] };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".tk-config-preview").on("error", (event) => event.currentTarget.classList.add("is-missing"));
    html.find("[data-browse]").on("click", (event) => {
      const row = event.currentTarget.closest("[data-card]");
      const Picker = filePickerClass();
      new Picker({
        type: "image",
        current: row.querySelector("[data-image-input]").value,
        callback: (path) => this.setImage(row, path)
      }).browse();
    });
    html.find("[data-clear]").on("click", (event) => {
      const row = event.currentTarget.closest("[data-card]");
      row.querySelectorAll("input").forEach((input) => {
        input.value = "";
      });
      this.setImage(row, "");
    });
    html.find("[data-name-input]").on("input", (event) => {
      const row = event.currentTarget.closest("[data-card]");
      row.querySelector("[data-file-name]").textContent = fileSlug(displayedName(row));
    });
    html.find("[data-import]").on("click", () => this.importFolder(html));
    html.find("[data-reset-all]").on("click", () => this.resetAll());
  }

  setImage(row, path) {
    row.querySelector("[data-image-input]").value = path;
    const preview = row.querySelector(".tk-config-preview");
    preview.classList.toggle("is-missing", !path);
    if (path) {
      preview.src = path;
    }
  }

  importFolder(html) {
    const Picker = filePickerClass();
    const picker = new Picker({
      type: "folder",
      callback: async (path) => {
        const target = browseTarget(path, picker.activeSource ?? "data");
        const rows = html.find("[data-card]").toArray();
        const cards = rows.map((element) => ({ id: element.dataset.card, name: displayedName(element) }));
        let matches = {};
        try {
          matches = await this.findImages(Picker, target.source, target.path, cards);
        } catch (error) {
          console.error("tarokka-reading | folder import", target, error);
        }
        const count = Object.keys(matches).length;
        if (count === 0) {
          ui.notifications.warn(t("TAROKKA.CardsConfig.NothingFound", { folder: target.path || "/" }));
          return;
        }
        for (const element of rows) {
          const image = matches[element.dataset.card];
          if (image) {
            this.setImage(element, image);
          }
        }
        ui.notifications.info(t("TAROKKA.CardsConfig.Imported", { count }));
      }
    });
    picker.browse();
  }

  async findImages(Picker, source, path, cards) {
    const result = await Picker.browse(source, path);
    const matches = matchFolderImages(result.files ?? [], cards);
    if (Object.keys(matches).length > 0) {
      return matches;
    }
    const nested = await Promise.all((result.dirs ?? []).map(async (dir) => {
      const inner = await Picker.browse(source, dir);
      return matchFolderImages(inner.files ?? [], cards);
    }));
    let best = {};
    for (const candidate of nested) {
      if (Object.keys(candidate).length > Object.keys(best).length) {
        best = candidate;
      }
    }
    return best;
  }

  async resetAll() {
    const confirmed = await confirmDialog(t("TAROKKA.CardsConfig.ResetAll"), t("TAROKKA.CardsConfig.ResetAllConfirm"));
    if (!confirmed) {
      return;
    }
    await game.settings.set(MODULE_ID, "cardOverrides", {});
    this.render(false);
  }

  async _updateObject(event, formData) {
    const data = foundry.utils.expandObject(formData);
    await game.settings.set(MODULE_ID, "cardOverrides", cleanOverrides(data.name, data.image));
  }
}

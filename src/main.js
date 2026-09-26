import { MODULE_ID, t } from "./constants.js";
import { emptyPlan } from "./reading.js";
import { TarokkaReadingApp } from "./reading-app.js";
import { TarokkaCardsConfig } from "./cards-config.js";

function rerender() {
  const open = Object.values(ui.windows).find((app) => app instanceof TarokkaReadingApp);
  open?.render(false);
}

Hooks.once("init", () => {
  window.TarokkaReadingApp = TarokkaReadingApp;

  game.settings.register(MODULE_ID, "reading", {
    scope: "world",
    config: false,
    type: Object,
    default: { id: null, positions: [] },
    onChange: (reading) => TarokkaReadingApp.onReadingChanged(reading)
  });

  game.settings.register(MODULE_ID, "plan", {
    scope: "client",
    config: false,
    type: Object,
    default: emptyPlan()
  });

  game.settings.register(MODULE_ID, "secret", {
    scope: "client",
    config: false,
    type: Object,
    default: { id: null, cards: [], stages: [] }
  });

  game.settings.register(MODULE_ID, "cardOverrides", {
    scope: "world",
    config: false,
    type: Object,
    default: {},
    onChange: rerender
  });

  game.settings.registerMenu(MODULE_ID, "cardsConfig", {
    name: "TAROKKA.Settings.CardsConfig.Name",
    label: "TAROKKA.Settings.CardsConfig.Label",
    hint: "TAROKKA.Settings.CardsConfig.Hint",
    icon: "fas fa-pen",
    type: TarokkaCardsConfig,
    restricted: true
  });
});

Hooks.on("getSceneControlButtons", (controls) => {
  const control = {
    name: "tarokka",
    title: t("TAROKKA.Title"),
    icon: "fas fa-diamond",
    order: 110,
    tools: {
      open: {
        name: "open",
        title: t("TAROKKA.Open"),
        icon: "fas fa-diamond",
        button: true,
        onChange: (event, active) => {
          if (active) {
            new TarokkaReadingApp().render(true);
          }
        }
      }
    },
    activeTool: "open"
  };
  if (Array.isArray(controls)) {
    controls.push({ ...control, tools: Object.values(control.tools).map((tool) => ({ ...tool, onClick: () => new TarokkaReadingApp().render(true) })) });
    return;
  }
  controls.tarokka = control;
});

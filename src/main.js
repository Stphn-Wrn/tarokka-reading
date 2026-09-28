import { MODULE_ID, backToTokenControls, t } from "./constants.js";
import { emptyPlan } from "./reading.js";
import { TarokkaReadingApp } from "./reading-app.js";
import { TarokkaCardsConfig } from "./cards-config.js";
import { TarokkaState } from "./state.js";
import { preloadCardImages } from "./cards.js";

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
    default: { id: null, broadcast: false, positions: [] },
    onChange: (reading) => TarokkaReadingApp.onReadingChanged(reading)
  });

  game.settings.register(MODULE_ID, "plan", {
    scope: "client",
    config: false,
    type: Object,
    default: emptyPlan(),
    onChange: rerender
  });

  game.settings.register(MODULE_ID, "secret", {
    scope: "client",
    config: false,
    type: Object,
    default: { id: null, broadcast: false, cards: [], stages: [] },
    onChange: rerender
  });

  game.settings.register(MODULE_ID, "cardOverrides", {
    scope: "world",
    config: false,
    type: Object,
    default: {},
    onChange: () => {
      preloadCardImages();
      rerender();
    }
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

Hooks.once("ready", () => {
  preloadCardImages();
  if (!game.user.isGM && TarokkaState.getPublic()?.broadcast) {
    new TarokkaReadingApp().render(true);
  }
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user.isGM) {
    return;
  }
  const open = () => {
    new TarokkaReadingApp().render(true);
    backToTokenControls();
  };
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
            open();
          }
        }
      }
    },
    activeTool: "open"
  };
  if (Array.isArray(controls)) {
    controls.push({ ...control, tools: Object.values(control.tools).map((tool) => ({ ...tool, onClick: open })) });
    return;
  }
  controls.tarokka = control;
});

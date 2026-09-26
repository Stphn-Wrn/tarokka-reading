import { MODULE_ID, modulePath, renderTemplate, t } from "./constants.js";
import { cardsOfDeck, findCard } from "./deck.js";
import { POSITIONS, planProblems } from "./reading.js";
import { TarokkaState } from "./state.js";
import { customImage, customName } from "./customization.js";

const SUIT_ICONS = {
  swords: "fa-khanda",
  stars: "fa-star",
  coins: "fa-coins",
  glyphs: "fa-ankh",
  crowns: "fa-crown"
};

function cardOverrides() {
  return game.settings.get(MODULE_ID, "cardOverrides") ?? {};
}

function cardName(cardId) {
  return customName(cardId, cardOverrides(), t(`TAROKKA.Cards.${cardId}`));
}

function cardView(cardId) {
  const card = findCard(cardId);
  if (!card) {
    return null;
  }
  let valueLabel = "";
  if (card.value === "master") {
    valueLabel = "10";
  } else if (card.value) {
    valueLabel = card.value;
  }
  const image = customImage(card.id, cardOverrides());
  return {
    id: card.id,
    name: cardName(card.id),
    suit: t(`TAROKKA.Suits.${card.suit}`),
    value: valueLabel,
    icon: SUIT_ICONS[card.suit],
    image
  };
}

export class TarokkaReadingApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "tarokka-reading",
      title: t("TAROKKA.Title"),
      template: modulePath("src/reading.html"),
      width: 620,
      height: "auto",
      resizable: true,
      classes: ["tarokka-reading"]
    });
  }

  static onReadingChanged(reading) {
    const open = Object.values(ui.windows).find((app) => app instanceof TarokkaReadingApp);
    if (open) {
      open.render(false);
      return;
    }
    if (reading?.id && !game.user.isGM) {
      new TarokkaReadingApp().render(true);
    }
  }

  constructor(options = {}) {
    super(options);
    this.setupOpen = false;
    this.lastDealId = null;
    this.shownPlaced = new Set();
    this.shownRevealed = new Set();
  }

  getData() {
    const isGM = game.user.isGM;
    const reading = TarokkaState.getPublic();
    const secret = TarokkaState.getSecret();
    const plan = TarokkaState.getPlan();
    if (reading.id !== this.lastDealId) {
      this.shownPlaced = new Set();
      this.shownRevealed = new Set();
    }
    this.lastDealId = reading.id;
    const previouslyPlaced = this.shownPlaced;
    const previouslyRevealed = this.shownRevealed;
    this.shownPlaced = new Set();
    this.shownRevealed = new Set();

    const nextIndex = POSITIONS.findIndex((position, index) => !reading.positions?.[index]?.placed);
    const slots = POSITIONS.map((position, index) => {
      const shared = reading.positions?.[index];
      let cardId = shared?.cardId ?? null;
      if (isGM && secret.id === reading.id) {
        cardId = secret.cards[index] ?? null;
      }
      const card = cardView(cardId);
      let note = "";
      if (isGM) {
        note = plan[index]?.note ?? "";
      }
      const placed = Boolean(shared?.placed);
      const revealed = Boolean(shared?.revealed);
      if (placed) {
        this.shownPlaced.add(index);
      }
      if (revealed) {
        this.shownRevealed.add(index);
      }
      return {
        index,
        id: position.id,
        label: t(`TAROKKA.Positions.${position.id}`),
        dealt: Boolean(reading.id),
        number: index + 1,
        placed,
        arrive: placed && !previouslyPlaced.has(index),
        revealed: revealed && previouslyRevealed.has(index),
        flip: revealed && !previouslyRevealed.has(index),
        canFlip: isGM && placed && !revealed,
        isNext: isGM && Boolean(reading.id) && index === nextIndex,
        card,
        note
      };
    });

    const problems = planProblems(plan);
    const setup = POSITIONS.map((position, index) => ({
      index,
      label: t(`TAROKKA.Positions.${position.id}`),
      note: plan[index]?.note ?? "",
      problem: problems.find((problem) => problem.position === position.id)?.problem ?? null,
      options: cardsOfDeck(position.deck).map((card) => ({
        id: card.id,
        name: cardName(card.id),
        selected: plan[index]?.cardId === card.id
      }))
    }));

    return {
      isGM,
      slots,
      dealt: Boolean(reading.id),
      hasNext: Boolean(reading.id) && nextIndex >= 0,
      setupOpen: isGM && this.setupOpen,
      setup,
      canDeal: problems.length === 0,
      backImage: customImage("back", cardOverrides())
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".tk-face img").on("error", (event) => event.currentTarget.remove());
    html.find("[data-flip]").each((index, element) => {
      let delay = 60;
      if (element.classList.contains("tk-arrive")) {
        delay = 700;
      }
      setTimeout(() => element.classList.add("is-revealed"), delay);
    });
    if (!game.user.isGM) {
      return;
    }

    html.find("[data-tk-action='next'], [data-next-slot]").on("click", () => TarokkaState.placeNext());
    html.find("[data-flip-slot]").on("click", (event) => TarokkaState.flip(Number(event.currentTarget.dataset.flipSlot)));
    html.find("[data-tk-action='deal']").on("click", () => {
      this.setupOpen = false;
      TarokkaState.deal();
    });
    html.find("[data-tk-action='reveal-all']").on("click", () => TarokkaState.revealAll());
    html.find("[data-tk-action='reset']").on("click", () => TarokkaState.reset());
    html.find("[data-tk-action='setup']").on("click", () => {
      this.setupOpen = !this.setupOpen;
      this.render(false);
    });

    html.find("[data-plan-card]").on("change", async (event) => {
      const plan = TarokkaState.getPlan();
      plan[Number(event.currentTarget.dataset.planCard)].cardId = event.currentTarget.value || null;
      await TarokkaState.savePlan(plan);
      this.render(false);
    });
    html.find("[data-plan-note]").on("change", async (event) => {
      const plan = TarokkaState.getPlan();
      plan[Number(event.currentTarget.dataset.planNote)].note = event.currentTarget.value;
      await TarokkaState.savePlan(plan);
    });
  }
}

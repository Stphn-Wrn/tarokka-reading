import { confirmDialog, modulePath, t } from "./constants.js";
import { cardName, cardOverrides, cardView } from "./cards.js";
import { customImage } from "./customization.js";
import { POSITIONS, nextStep, planProblems } from "./reading.js";
import { cardsOfDeck } from "./deck.js";
import { TarokkaState } from "./state.js";

export class TarokkaReadingApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "tarokka-reading",
      title: t("TAROKKA.Title"),
      template: modulePath("src/reading.html"),
      width: 560,
      height: "auto",
      resizable: true,
      classes: ["tarokka-reading"]
    });
  }

  static onReadingChanged(reading) {
    const open = Object.values(ui.windows).find((app) => app instanceof TarokkaReadingApp);
    if (game.user.isGM) {
      return;
    }
    if (!reading?.broadcast) {
      open?.close();
      return;
    }
    if (open) {
      open.render(false);
      return;
    }
    new TarokkaReadingApp().render(true);
  }

  constructor(options = {}) {
    super(options);
    this.preparing = false;
    this.lastDealId = null;
    this.shownPlaced = new Set();
    this.shownRevealed = new Set();
  }

  getData() {
    const isGM = game.user.isGM;
    let reading = TarokkaState.getPublic();
    if (isGM) {
      reading = TarokkaState.getGmView();
    }
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

    const next = nextStep(Boolean(reading.id), secret.stages);
    let step = "";
    if (isGM) {
      step = t(`TAROKKA.Steps.${next.step}`, { number: next.number });
    }

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
      step,
      preparing: isGM && this.preparing,
      setup,
      canDeal: problems.length === 0,
      broadcasting: Boolean(reading.broadcast),
      backImage: customImage("back", cardOverrides())
    };
  }

  async newReading() {
    if (TarokkaState.getSecret().id) {
      const confirmed = await confirmDialog(t("TAROKKA.NewReading"), t("TAROKKA.NewReadingConfirm"));
      if (!confirmed) {
        return;
      }
    }
    await TarokkaState.deal();
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

    html.find("[data-next-slot]").on("click", () => TarokkaState.placeNext());
    html.find("[data-flip-slot]").on("click", (event) => TarokkaState.flip(Number(event.currentTarget.dataset.flipSlot)));
    html.find("[data-tk-action='prepare']").on("click", () => {
      this.preparing = !this.preparing;
      this.render(false);
    });
    html.find("[data-tk-action='deal']").on("click", () => {
      this.preparing = false;
      this.newReading();
    });
    html.find("[data-plan-card]").on("change", async (event) => {
      const plan = TarokkaState.getPlan();
      plan[Number(event.currentTarget.dataset.planCard)].cardId = event.currentTarget.value || null;
      await TarokkaState.savePlan(plan);
    });
    html.find("[data-plan-note]").on("change", async (event) => {
      const plan = TarokkaState.getPlan();
      plan[Number(event.currentTarget.dataset.planNote)].note = event.currentTarget.value;
      await TarokkaState.savePlan(plan);
    });
    html.find("[data-tk-action='broadcast']").on("click", () => TarokkaState.setBroadcast(true));
    html.find("[data-tk-action='stop-broadcast']").on("click", () => TarokkaState.setBroadcast(false));
  }
}

import { cardsOfDeck, deckOf } from "./deck.js";

export const POSITIONS = [
  { id: "tome", deck: "common" },
  { id: "symbol", deck: "common" },
  { id: "sword", deck: "common" },
  { id: "ally", deck: "high" },
  { id: "enemy", deck: "high" }
];

export function emptyPlan() {
  return POSITIONS.map(() => ({ cardId: null, note: "" }));
}

export function planProblems(plan) {
  const seen = new Set();
  const problems = [];
  POSITIONS.forEach((position, index) => {
    const cardId = plan[index]?.cardId;
    if (!cardId) {
      return;
    }
    if (deckOf(cardId) !== position.deck) {
      problems.push({ position: position.id, problem: "wrongDeck" });
      return;
    }
    if (seen.has(cardId)) {
      problems.push({ position: position.id, problem: "duplicate" });
      return;
    }
    seen.add(cardId);
  });
  return problems;
}

export function resolveReading(plan, random) {
  const used = new Set(plan.map((slot) => slot?.cardId).filter(Boolean));
  return POSITIONS.map((position, index) => {
    const chosen = plan[index]?.cardId;
    if (chosen) {
      return chosen;
    }
    const available = cardsOfDeck(position.deck).filter((card) => !used.has(card.id));
    const card = available[Math.floor(random() * available.length)];
    used.add(card.id);
    return card.id;
  });
}

export function hiddenStages() {
  return POSITIONS.map(() => "hidden");
}

export function publicReading(cards, stages) {
  return POSITIONS.map((position, index) => {
    const stage = stages[index] ?? "hidden";
    let cardId = null;
    if (stage === "revealed") {
      cardId = cards[index];
    }
    return { cardId, placed: stage !== "hidden", revealed: stage === "revealed" };
  });
}

export function nextToPlace(stages) {
  const index = stages.findIndex((stage) => stage === "hidden");
  if (index < 0) {
    return null;
  }
  return index;
}

export function placeNext(stages) {
  const index = nextToPlace(stages);
  return stages.map((stage, position) => {
    if (position === index) {
      return "placed";
    }
    return stage;
  });
}

export function flip(stages, index) {
  return stages.map((stage, position) => {
    if (position === index && stage === "placed") {
      return "revealed";
    }
    return stage;
  });
}

export function revealAll(stages) {
  return stages.map(() => "revealed");
}

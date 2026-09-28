import { MODULE_ID, t } from "./constants.js";
import { findCard } from "./deck.js";
import { customImage, customName } from "./customization.js";

const SUIT_ICONS = {
  swords: "fa-khanda",
  stars: "fa-star",
  coins: "fa-coins",
  glyphs: "fa-ankh",
  crowns: "fa-crown"
};

export function cardOverrides() {
  return game.settings.get(MODULE_ID, "cardOverrides") ?? {};
}

export function cardName(cardId) {
  return customName(cardId, cardOverrides(), t(`TAROKKA.Cards.${cardId}`));
}

export function cardView(cardId) {
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

const preloaded = new Map();

export function preloadCardImages() {
  const overrides = cardOverrides();
  for (const entry of Object.values(overrides)) {
    if (entry?.image && !preloaded.has(entry.image)) {
      const image = new Image();
      image.src = entry.image;
      image.decode().catch(() => null);
      preloaded.set(entry.image, image);
    }
  }
}

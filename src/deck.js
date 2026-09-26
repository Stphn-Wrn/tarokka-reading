const SUITS = ["swords", "stars", "coins", "glyphs"];
const VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "master"];
const CROWNS = [
  "artifact", "beast", "broken-one", "dark-lord", "donjon", "executioner", "ghost",
  "horseman", "innocent", "marionette", "mists", "raven", "seer", "tempter"
];

export const COMMON_DECK = SUITS.flatMap((suit) => VALUES.map((value) => ({
  id: `${suit}-${value}`,
  deck: "common",
  suit,
  value
})));

export const HIGH_DECK = CROWNS.map((id) => ({ id, deck: "high", suit: "crowns", value: null }));

const ALL_CARDS = [...COMMON_DECK, ...HIGH_DECK];

export function findCard(cardId) {
  return ALL_CARDS.find((card) => card.id === cardId) ?? null;
}

export function deckOf(cardId) {
  return findCard(cardId)?.deck ?? null;
}

export function cardsOfDeck(deck) {
  return ALL_CARDS.filter((card) => card.deck === deck);
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COMMON_DECK, HIGH_DECK } from "../src/deck.js";
import { POSITIONS } from "../src/reading.js";

function load(lang) {
  return JSON.parse(readFileSync(new URL(`../lang/${lang}.json`, import.meta.url), "utf8")).TAROKKA;
}

for (const lang of ["en", "fr"]) {
  test(`chaque carte et chaque position a un nom en ${lang}`, () => {
    const texts = load(lang);
    const missingCards = [...COMMON_DECK, ...HIGH_DECK].filter((card) => !texts.Cards[card.id]);
    const missingPositions = POSITIONS.filter((position) => !texts.Positions[position.id]);
    assert.deepEqual(missingCards, []);
    assert.deepEqual(missingPositions, []);
  });
}

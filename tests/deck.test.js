import { test } from "node:test";
import assert from "node:assert/strict";
import { COMMON_DECK, HIGH_DECK, deckOf } from "../src/deck.js";

test("le paquet commun compte 40 cartes : 4 couleurs de 1 à 9 plus un Maître", () => {
  assert.equal(COMMON_DECK.length, 40);
  assert.equal(COMMON_DECK.filter((card) => card.suit === "swords").length, 10);
  assert.deepEqual(COMMON_DECK.find((card) => card.id === "stars-master"), { id: "stars-master", deck: "common", suit: "stars", value: "master" });
});

test("le paquet des Couronnes compte 14 cartes", () => {
  assert.equal(HIGH_DECK.length, 14);
  assert.equal(HIGH_DECK.every((card) => card.deck === "high" && card.suit === "crowns"), true);
});

test("chaque carte a un identifiant unique", () => {
  const ids = [...COMMON_DECK, ...HIGH_DECK].map((card) => card.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("on retrouve le paquet d'une carte à partir de son identifiant", () => {
  assert.equal(deckOf("glyphs-3"), "common");
  assert.equal(deckOf("raven"), "high");
  assert.equal(deckOf("inconnue"), null);
});

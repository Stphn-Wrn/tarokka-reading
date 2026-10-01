import { test } from "node:test";
import assert from "node:assert/strict";
import { POSITIONS, flip, nextStep, nextToPlace, placeNext, planProblems, publicReading, resolveReading, sharedReading } from "../src/reading.js";

function sequence(values) {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

test("le tirage suit la croix : 3 cartes communes puis 2 Couronnes", () => {
  assert.deepEqual(POSITIONS.map((position) => [position.id, position.deck]), [
    ["tome", "common"],
    ["symbol", "common"],
    ["sword", "common"],
    ["ally", "high"],
    ["enemy", "high"]
  ]);
});

test("les cartes choisies par le MJ sont gardées, le hasard complète le reste", () => {
  const plan = [{ cardId: "swords-3" }, { cardId: null }, { cardId: null }, { cardId: "raven" }, { cardId: null }];
  const cards = resolveReading(plan, sequence([0]));
  assert.equal(cards[0], "swords-3");
  assert.equal(cards[3], "raven");
  assert.equal(cards.length, 5);
});

test("le hasard ne retire jamais une carte déjà choisie ou déjà tirée", () => {
  const plan = [{ cardId: null }, { cardId: "swords-1" }, { cardId: null }, { cardId: "artifact" }, { cardId: null }];
  const cards = resolveReading(plan, sequence([0]));
  assert.equal(new Set(cards).size, 5);
  assert.equal(cards[0], "swords-2");
  assert.equal(cards[4], "beast");
});

test("un plan valide ne signale aucun problème", () => {
  const plan = [{ cardId: "coins-9" }, { cardId: null }, { cardId: null }, { cardId: null }, { cardId: "mists" }];
  assert.deepEqual(planProblems(plan), []);
});

test("un plan signale une carte du mauvais paquet ou choisie deux fois", () => {
  const plan = [{ cardId: "raven" }, { cardId: "coins-9" }, { cardId: "coins-9" }, { cardId: null }, { cardId: null }];
  assert.deepEqual(planProblems(plan), [
    { position: "tome", problem: "wrongDeck" },
    { position: "sword", problem: "duplicate" }
  ]);
});

test("l'état partagé avec les joueurs ne contient que les cartes retournées", () => {
  const cards = ["swords-3", "stars-1", "coins-2", "raven", "mists"];
  const stages = ["revealed", "placed", "hidden", "revealed", "hidden"];
  assert.deepEqual(publicReading(cards, stages), [
    { cardId: "swords-3", placed: true, revealed: true },
    { cardId: null, placed: true, revealed: false },
    { cardId: null, placed: false, revealed: false },
    { cardId: "raven", placed: true, revealed: true },
    { cardId: null, placed: false, revealed: false }
  ]);
});

test("la carte suivante est posée face cachée, dans l'ordre du tirage", () => {
  const stages = ["revealed", "placed", "hidden", "hidden", "hidden"];
  assert.deepEqual(placeNext(stages), ["revealed", "placed", "placed", "hidden", "hidden"]);
});

test("quand toutes les cartes sont posées, il n'y a plus de carte suivante", () => {
  const stages = ["revealed", "placed", "placed", "placed", "placed"];
  assert.equal(nextToPlace(stages), null);
  assert.deepEqual(placeNext(stages), stages);
});

test("seule une carte posée face cachée peut être retournée", () => {
  const stages = ["placed", "hidden", "hidden", "hidden", "hidden"];
  assert.deepEqual(flip(stages, 0), ["revealed", "hidden", "hidden", "hidden", "hidden"]);
  assert.deepEqual(flip(stages, 1), stages);
});

test("sans diffusion, les joueurs ne reçoivent rien du tirage, même les cartes retournées", () => {
  const secret = { id: "abc", broadcast: false, cards: ["swords-3", "stars-1", "coins-2", "raven", "mists"], stages: ["revealed", "placed", "hidden", "hidden", "hidden"] };
  assert.deepEqual(sharedReading(secret), { id: null, broadcast: false, positions: [] });
});

test("pendant la diffusion, les joueurs reçoivent le tirage avec seulement les cartes retournées", () => {
  const secret = { id: "abc", broadcast: true, cards: ["swords-3", "stars-1", "coins-2", "raven", "mists"], stages: ["revealed", "placed", "hidden", "hidden", "hidden"] };
  assert.deepEqual(sharedReading(secret), {
    id: "abc",
    broadcast: true,
    positions: [
      { cardId: "swords-3", placed: true, revealed: true },
      { cardId: null, placed: true, revealed: false },
      { cardId: null, placed: false, revealed: false },
      { cardId: null, placed: false, revealed: false },
      { cardId: null, placed: false, revealed: false }
    ]
  });
});

test("le MJ peut diffuser la table vide avant de distribuer", () => {
  const secret = { id: null, broadcast: true, cards: [], stages: [] };
  const shared = sharedReading(secret);
  assert.equal(shared.broadcast, true);
  assert.equal(shared.id, null);
  assert.equal(shared.positions.every((position) => !position.placed), true);
});

test("avant la distribution, le MJ est invité à lancer un nouveau tirage", () => {
  assert.deepEqual(nextStep(false, []), { step: "deal" });
});

test("une carte posée face cachée doit être retournée avant de poser la suivante", () => {
  assert.deepEqual(nextStep(true, ["revealed", "placed", "hidden", "hidden", "hidden"]), { step: "flip", number: 2 });
});

test("sinon le MJ pose la carte suivante, dans l'ordre", () => {
  assert.deepEqual(nextStep(true, ["revealed", "revealed", "hidden", "hidden", "hidden"]), { step: "place", number: 3 });
});

test("quand toutes les cartes sont retournées, le tirage est terminé", () => {
  assert.deepEqual(nextStep(true, ["revealed", "revealed", "revealed", "revealed", "revealed"]), { step: "done" });
});

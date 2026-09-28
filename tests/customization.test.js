import { test } from "node:test";
import assert from "node:assert/strict";
import { browseTarget, cleanOverrides, customName, customImage, fileSlug, matchFolderImages } from "../src/customization.js";

test("une carte renommée par le MJ affiche son nouveau nom", () => {
  const overrides = { raven: { name: "Le Corbeau de Barovie" } };
  assert.equal(customName("raven", overrides, "Corbeau"), "Le Corbeau de Barovie");
});

test("une carte non renommée garde son nom imprimé", () => {
  const overrides = { raven: { image: "mes-cartes/corbeau.png" } };
  assert.equal(customName("raven", overrides, "Corbeau"), "Corbeau");
});

test("une image choisie pour une carte remplace la carte générique", () => {
  const overrides = { "swords-3": { image: "mes-cartes/soldat.webp" } };
  assert.equal(customImage("swords-3", overrides), "mes-cartes/soldat.webp");
});

test("sans image choisie, la carte reste générique", () => {
  assert.equal(customImage("swords-3", { raven: { image: "corbeau.png" } }), null);
});

test("le formulaire ne garde que les champs remplis, sans espaces superflus", () => {
  const names = { raven: "  Le Corbeau  ", mists: "", "swords-3": "" };
  const images = { raven: "", mists: "", "swords-3": " mes-cartes/soldat.webp " };
  assert.deepEqual(cleanOverrides(names, images), {
    raven: { name: "Le Corbeau" },
    "swords-3": { image: "mes-cartes/soldat.webp" }
  });
});

test("le nom de fichier d'une carte est son nom en minuscules, sans accents, avec des tirets", () => {
  assert.equal(fileSlug("Maître des ténèbres"), "maitre-des-tenebres");
  assert.equal(fileSlug("L'Homme encapuchonné"), "l-homme-encapuchonne");
  assert.equal(fileSlug("  Toto  "), "toto");
  assert.equal(fileSlug("Dos des cartes !"), "dos-des-cartes");
});

test("importer un dossier associe chaque image à la carte qui porte son nom", () => {
  const files = [
    "mes-cartes/toto.png",
    "mes-cartes/maitre-des-tenebres.jpg",
    "mes-cartes/dos-des-cartes.webp",
    "mes-cartes/notes.txt",
    "mes-cartes/portrait.jpg"
  ];
  const cards = [
    { id: "beast", name: "Toto" },
    { id: "dark-lord", name: "Maître des ténèbres" },
    { id: "back", name: "Dos des cartes" },
    { id: "mists", name: "Brumes" }
  ];
  assert.deepEqual(matchFolderImages(files, cards), {
    beast: "mes-cartes/toto.png",
    "dark-lord": "mes-cartes/maitre-des-tenebres.jpg",
    back: "mes-cartes/dos-des-cartes.webp"
  });
});

test("importer un dossier ignore la casse et décode les noms de fichiers", () => {
  const files = ["cartes%20tarokka/Homme-Encapuchonne.JPG"];
  const cards = [{ id: "swords-7", name: "Homme encapuchonné" }];
  assert.deepEqual(matchFolderImages(files, cards), { "swords-7": "cartes%20tarokka/Homme-Encapuchonne.JPG" });
});

test("importer un dossier reconnaît encore l'identifiant de la carte", () => {
  const files = ["cartes/beast.png"];
  const cards = [{ id: "beast", name: "Toto" }];
  assert.deepEqual(matchFolderImages(files, cards), { beast: "cartes/beast.png" });
});

test("importer un dossier reconnaît les noms du jeu conseillé, sans renommage", () => {
  const files = ["deck/1 - coins.webp", "deck/9 - glyphs.webp", "deck/Warrior.webp", "deck/Priest.webp", "deck/Broken One.webp"];
  const cards = [
    { id: "coins-1", name: "Swashbuckler" },
    { id: "glyphs-9", name: "Traitor" },
    { id: "swords-master", name: "Master of Swords" },
    { id: "glyphs-master", name: "Master of Glyphs" },
    { id: "broken-one", name: "Broken One" }
  ];
  assert.deepEqual(matchFolderImages(files, cards), {
    "coins-1": "deck/1 - coins.webp",
    "glyphs-9": "deck/9 - glyphs.webp",
    "swords-master": "deck/Warrior.webp",
    "glyphs-master": "deck/Priest.webp",
    "broken-one": "deck/Broken One.webp"
  });
});

test("importer un dossier reconnaît les adresses complètes des images, comme sur The Forge", () => {
  const files = ["https://assets.forge-vtt.com/abc/tarokka-cards/1%20-%20coins.webp?v=2"];
  const cards = [{ id: "coins-1", name: "Swashbuckler" }];
  assert.deepEqual(matchFolderImages(files, cards), { "coins-1": files[0] });
});

test("un dossier de The Forge donné par son adresse complète est lu dans les assets The Forge", () => {
  const target = browseTarget("https://assets.forge-vtt.com/65e4f0edc1ed894e52c6673c/tarokka-cards/", "data");
  assert.deepEqual(target, { source: "forgevtt", path: "tarokka-cards/" });
});

test("un dossier local garde sa source et son chemin", () => {
  assert.deepEqual(browseTarget("tarokka-cards", "data"), { source: "data", path: "tarokka-cards" });
});

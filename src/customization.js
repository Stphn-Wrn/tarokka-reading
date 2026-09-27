export function customName(cardId, overrides, printedName) {
  const name = overrides?.[cardId]?.name;
  if (name) {
    return name;
  }
  return printedName;
}

export function customImage(cardId, overrides) {
  return overrides?.[cardId]?.image || null;
}

const IMAGE_EXTENSIONS = ["webp", "png", "jpg", "jpeg", "avif", "gif", "svg"];

export function fileSlug(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MASTER_ALIASES = {
  "swords-master": "warrior",
  "stars-master": "wizard",
  "coins-master": "rogue",
  "glyphs-master": "priest"
};

function aliases(cardId) {
  const known = [cardId];
  const common = cardId.match(/^(swords|stars|coins|glyphs)-(\d)$/);
  if (common) {
    known.push(`${common[2]}-${common[1]}`);
  }
  if (MASTER_ALIASES[cardId]) {
    known.push(MASTER_ALIASES[cardId]);
  }
  return known;
}

export function matchFolderImages(files, cards) {
  const images = new Map();
  for (const file of files) {
    const fileName = decodeURIComponent(file.split(/[?#]/)[0].split("/").pop());
    const dot = fileName.lastIndexOf(".");
    if (dot < 0 || !IMAGE_EXTENSIONS.includes(fileName.slice(dot + 1).toLowerCase())) {
      continue;
    }
    images.set(fileSlug(fileName.slice(0, dot)), file);
  }
  const matches = {};
  for (const card of cards) {
    const candidates = [fileSlug(card.name), ...aliases(card.id)];
    const image = candidates.map((candidate) => images.get(candidate)).find(Boolean);
    if (image) {
      matches[card.id] = image;
    }
  }
  return matches;
}

export function cleanOverrides(names, images) {
  const ids = new Set([...Object.keys(names ?? {}), ...Object.keys(images ?? {})]);
  const overrides = {};
  for (const id of ids) {
    const entry = {};
    const name = (names?.[id] ?? "").trim();
    const image = (images?.[id] ?? "").trim();
    if (name) {
      entry.name = name;
    }
    if (image) {
      entry.image = image;
    }
    if (Object.keys(entry).length > 0) {
      overrides[id] = entry;
    }
  }
  return overrides;
}

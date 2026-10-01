# Tarokka Reading

🇫🇷 [Version française](README.fr.md)

Foundry VTT module for immersive **Tarokka fortune-telling**. Works with any game system.

## Features

- **The five-card cross** — Five cards from the common deck and the high deck (Crowns), arranged in a cross formation.
- **Prepared or random** — The GM picks a card for each position ahead of time, or leaves it to chance. Duplicates and wrong decks are flagged.
- **Dealt face down, revealed one by one** — Cards slide into the cross face down; the GM flips each one with a click, when the story calls for it, and each flip plays for every player at the same time.
- **GM only, shown when the GM decides** — Only the GM sees the tool. **Show to players** opens the window for them, **Stop showing** closes it; nothing is shared until then.
- **Secret until revealed** — While shown, only revealed cards are shared with the players; the full reading and the GM notes stay on the GM's browser. Players see neither the position names nor the notes.
- **Generic cards out of the box** — The module ships no artwork: cards are drawn in CSS. The GM can rename any card and give it an image.
- **English and French**, following Foundry's language.

## Usage

1. **Diamond** icon in the left toolbar opens the reading. Only the GM sees it.
2. **Prepare** shows the preparation in place of the table (click again to go back): choose a card or *Random* for each position, and add a note if you like.
3. **Show to players** opens the window for the players, before or after dealing. **Stop showing** closes it.
4. **New reading** deals the cards. If a reading is already in progress, you are asked to confirm.
5. Everything then happens on the table: click the glowing slot to lay the next card face down, then click the card to flip it, following your narration. A line under the table tells you the next step.

## Card images

The module ships no artwork: by default, cards are generic (value, suit icon, name).

In the module settings, **Customize cards → Edit cards** lets you, for every card and for the back:
- set another name;
- pick an image;
- go back to the original card with the ↺ button.

**Reset all**, at the bottom of the window, restores every card and the back to the original after a confirmation.

**Import a folder** fills every image at once. Each file must be named after its card as displayed, lowercase, without accents, spaces and apostrophes replaced by dashes (any extension: webp, png, jpg...). For example "Darklord" → `darklord.png`, "Card back" → `card-back.jpg`. If you rename a card, its file name follows: a Beast renamed "Toto" expects `toto.png`. The expected name is shown on each row of the window. Cards that are not found stay generic: fill them in by hand.

Note that the expected name depends on Foundry's language: in French, the Darklord expects `seigneur-des-tenebres.png`. For files that work in every language, use the card's internal id, which is always recognized:

| Deck | Ids |
|---|---|
| Common | `swords-1` … `swords-9`, `swords-master`, same for `stars`, `coins`, `glyphs` |
| Crowns | `artifact`, `beast`, `broken-one`, `dark-lord`, `donjon`, `executioner`, `ghost`, `horseman`, `innocent`, `marionette`, `mists`, `raven`, `seer`, `tempter` |
| Back | `back` |

### Recommended deck

No images? We recommend the [Digital Color Tarokka Deck by Pyram King](https://www.pyramking.com/tarokka-deck/): free, 54 color cards, in JPG or WebP. Import its folder as is: its file names (`1 - coins.webp`, `Warrior.webp`...) are recognized without renaming. This deck has no back: the module's generic back is used.

Make sure you have the right to use any images you import.

## Installation

Manifest URL:
```
https://raw.githubusercontent.com/Stphn-Wrn/tarokka-reading/main/module.json
```

## Development

```bash
npm test
```

## License

Code under the MIT license. This module is not affiliated with or endorsed by any third party.

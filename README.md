# Tarokka Reading

🇫🇷 [Version française](README.fr.md)

Foundry VTT module for Madame Eva's **Tarokka reading** in *Curse of Strahd*. Works with any game system.

## Features

- **The five-card cross** — The Tome of Strahd, the Holy Symbol of Ravenkind and the Sunsword from the common deck; the Ally and Strahd's lair from the high deck (Crowns).
- **Prepared or random** — The GM picks a card for each position ahead of time, or leaves it to chance. Duplicates and wrong decks are flagged.
- **Dealt face down, revealed one by one** — Cards slide into the cross face down; the GM flips each one with a click, when the story calls for it, and each flip plays for every player at the same time.
- **Secret until revealed** — Only revealed cards are shared with the players; the full reading and the GM notes stay on the GM's browser. Players see neither the position names nor the notes.
- **Generic cards out of the box** — The module ships no artwork: cards are drawn in CSS. The GM can rename any card and give it an image.
- **English and French**, following Foundry's language.

## Usage

1. **Diamond** icon in the left toolbar opens the reading.
2. **Prepare** (GM): choose a card or *Random* for each position, and add a note if you like.
3. **Deal**: the cards are dealt face down; the window opens automatically for the players.
4. **Deal next card**: the next card (1 to 5, in order) slides onto the table face down. Click it when you want to flip it, to follow your narration. **Reveal all** shows every card at once, **Reset** clears the table.

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

For a real table, the official printed deck is Gale Force Nine's *Tarokka Deck*.

The official Tarokka artwork belongs to Wizards of the Coast: use images you have the right to use.

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

Code under the MIT license. *Curse of Strahd* and the Tarokka deck are property of Wizards of the Coast; this module is an unofficial fan project and includes none of their text or art.

# Tirage du Tarokka

🇬🇧 [English version](README.md)

Module Foundry VTT pour le **tirage du Tarokka** de Madame Eva dans *La Malédiction de Strahd*. Fonctionne avec n'importe quel système de jeu.

## Fonctionnalités

- **La croix de cinq cartes** — Le Tome de Strahd, le Symbole sacré de Ravenkind et l'Épée du soleil tirés du paquet commun ; l'allié et le repaire de Strahd tirés du paquet des Couronnes.
- **Préparé ou au hasard** — Le MJ choisit à l'avance une carte pour chaque position, ou laisse faire le hasard. Doublons et mauvais paquets sont signalés.
- **Distribué face cachée, révélé une à une** — Les cartes glissent dans la croix face cachée ; le MJ retourne chacune d'un clic, au moment voulu, et chaque retournement se joue chez tous les joueurs en même temps.
- **Secret jusqu'à la révélation** — Seules les cartes retournées sont partagées avec les joueurs ; le tirage complet et les notes du MJ restent sur le navigateur du MJ. Les joueurs ne voient ni le nom des positions ni les notes.
- **Cartes génériques prêtes à l'emploi** — Le module n'inclut aucune illustration : les cartes sont dessinées en CSS. Le MJ peut renommer chaque carte et lui donner une image.
- **Français et anglais**, selon la langue de Foundry.

## Utilisation

1. L'icône **losange** de la barre d'outils de gauche ouvre le tirage.
2. **Préparer** (MJ) : choisissez une carte ou *Hasard* pour chaque position, et ajoutez une note si besoin.
3. **Distribuer** : les cartes sont distribuées face cachée ; la fenêtre s'ouvre automatiquement chez les joueurs.
4. **Poser la carte suivante** : la carte suivante (1 à 5, dans l'ordre) glisse sur la table face cachée. Cliquez dessus quand vous voulez la retourner, au rythme de votre narration. **Tout révéler** montre toutes les cartes d'un coup, **Réinitialiser** vide la table.

## Images des cartes

Le module n'inclut aucune illustration : par défaut, les cartes sont génériques (valeur, icône de la couleur, nom).

Dans les paramètres du module, **Personnaliser les cartes → Modifier les cartes** permet, pour chaque carte et pour le dos :
- de lui donner un autre nom ;
- de lui choisir une image ;
- de revenir à la carte d'origine avec le bouton ↺.

**Tout réinitialiser**, en bas de la fenêtre, remet toutes les cartes et le dos d'origine après confirmation.

**Importer un dossier** remplit toutes les images d'un coup. Chaque fichier doit porter le nom de sa carte tel qu'il s'affiche, en minuscules, sans accents, les espaces et apostrophes remplacés par des tirets (extension au choix : webp, png, jpg...). Par exemple « Seigneur des ténèbres » → `seigneur-des-tenebres.png`, « Dos des cartes » → `dos-des-cartes.jpg`. Si vous renommez une carte, son nom de fichier suit : une Bête renommée « Toto » attend `toto.png`. Le nom attendu est affiché sur chaque ligne de la fenêtre. Les cartes non trouvées restent génériques : complétez-les à la main.

Attention, le nom attendu dépend de la langue de Foundry : en anglais, le Seigneur des ténèbres attend `darklord.png`. Pour des fichiers valables dans toutes les langues, utilisez l'identifiant interne de la carte, qui est toujours reconnu :

| Paquet | Identifiants |
|---|---|
| Commun | `swords-1` … `swords-9`, `swords-master`, idem pour `stars`, `coins`, `glyphs` |
| Couronnes | `artifact`, `beast`, `broken-one`, `dark-lord`, `donjon`, `executioner`, `ghost`, `horseman`, `innocent`, `marionette`, `mists`, `raven`, `seer`, `tempter` |
| Dos | `back` |

### Jeu conseillé

Pas d'images ? Nous vous conseillons le [Digital Color Tarokka Deck de Pyram King](https://www.pyramking.com/tarokka-deck/) : gratuit, 54 cartes en couleur, en JPG ou WebP, avec les noms imprimés en anglais. Importez son dossier tel quel : ses noms de fichiers (`1 - coins.webp`, `Warrior.webp`...) sont reconnus sans renommage. Ce jeu n'a pas de dos : le dos générique du module est utilisé.

Pour jouer autour d'une vraie table, le jeu officiel imprimé est le *Tarokka Deck* de Gale Force Nine.

Les illustrations officielles du Tarokka appartiennent à Wizards of the Coast : utilisez des images que vous avez le droit d'utiliser.

## Installation

URL du manifeste :
```
https://raw.githubusercontent.com/Stphn-Wrn/tarokka-reading/main/module.json
```

## Développement

```bash
npm test
```

## Licence

Code sous licence MIT. *La Malédiction de Strahd* et le jeu de Tarokka appartiennent à Wizards of the Coast ; ce module est un projet de fan non officiel et n'inclut aucun de leurs textes ni illustrations.

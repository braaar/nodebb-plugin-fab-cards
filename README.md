# nodebb-plugin-fab-cards

A NodeBB plugin that automatically detects mentions of Flesh and Blood card names in posts, converts them into links to the official FAB card database, and shows a card image preview on hover/touch.

## Features

- Detects known card names in parsed post content
- Converts matches to links such as `https://cards.fabtcg.com/card/command-and-conquer-1/`
- Opens links in a new tab
- Shows preview image on hover (desktop) and first touch (mobile)
- Uses a static generated card index (`data/cards-index.json`) for fast runtime lookups

## Card data generation

The plugin uses:

- API endpoint: `https://cards.fabtcg.com/api/search/v1/cards/?`
- Build script: `scripts/build-card-index.js`

Generate/update the card index:

```bash
npm install
npm run build:cards
```

## Installation in NodeBB

In your plugin folder:

```bash
npm link
```

In your NodeBB folder:

```bash
npm link nodebb-plugin-fab-cards
./nodebb build
```

Then activate `FAB Cards Auto-Link` in ACP (`/admin/extend/plugins`).

## Local development NodeBB setup

A local setup guide is included in [dev/README.md](dev/README.md).

## Notes

- The parser only transforms posts for `type=default` rendering.
- Existing links/code blocks are ignored to avoid corrupting content.
- Re-run `npm run build:cards` periodically to refresh card data.

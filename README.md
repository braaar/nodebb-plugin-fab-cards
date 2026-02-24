# nodebb-plugin-fab-cards

A plugin for NodeBB that adds a client-side script that searches posts for mentions of Flesh & Blood cards and creates links to the cards in the [fabtcg database](https://cards.fabtcg.com/) and an image that shows up when hovering the link.

## How it works

This plugin matches exact card names that are spelled with correct capitalization and punctuation. As an example, `Fiddlers Green` will not be matched, but `Fiddler's Green` will, and `thunk` will not be matched, but `Thunk` will. If we were more generous with matches we would get false positives in sentences such as "weird flex but ok", since Flex is a Flesh and Blood card.

Card names will not be matched if they are:

- Inside an <a> tag (since nested links are not OK)
- Preceded by any of these characters: `"@-_;:?!.,;:'^¨*#$€&/`
- Succeeded by any character other than these: `<?!.,;:` (whitespace is also allowed)

## Installation

You can install `nodebb-plugin-fab-cards` by searching for it in the admin panel in NodeBB under Extend -> Plugins -> Find Plugins.

## Screenshot

Here's how it looks in action
![Screenshot 2026-02-22 at 11 45 52](https://github.com/user-attachments/assets/99fee26b-f8f0-4d74-b02a-76eba7906ecd)

## Test post

Post this in a NodeBB forum to test the plugin

```
I wonder What Happens Next?

Listing some cards:Betsy, Bravo, Fai– and of course ...Cindra!

[Link to my Katsu deck](https://katsu.ninja)

My favourite Brute cards:
- BRB
- Flex Strength
- Flex!!!!
- Flex Speed?
- Clash of Might
- **Alpha Instinct**💪🏼

[Agility](https://agility.com) in a sentence.
Agility in a sentence.

**Snatch** is amazing. So is ❄️Aether Hail❄️

What's your favourite card, @Flex?

@xXThunkLoverXx 

Do you also like Tiger Eye Reflex?
```

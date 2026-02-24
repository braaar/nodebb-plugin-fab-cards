# nodebb-plugin-fab-cards

A plugin for NodeBB that adds a client-side script that searches posts for mentions of Flesh & Blood cards and creates links to the cards in the [fabtcg database](https://cards.fabtcg.com/) and an image that shows up when hovering the link.

## How it works

- Card names are matched using word boundaries, so they can appear anywhere in the text as long as they are not part of a larger word.
- Matching is case-sensitive and requires correct punctuation (e.g., `Fiddler's Green` will match, but `Fiddlers Green` will not).
- Card names are not matched inside `<a>` tags (to avoid nested links).
- The matching logic sorts card names by length (longest first) to avoid partial matches (e.g., `Flex Strength` is matched before `Flex`).
- Card names are not matched inside empty or whitespace-only text nodes.
- Card names are not matched in username mentions, e.g. @Riptide

This approach allows for more natural mentions of card names in posts, while still avoiding most false positives. For example, `Flex` will be matched as a card name in "I love Flex!", but not in "I love Flex Strength!".

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
Agile Windup in a sentence.
This is Agility in a sentence. 

This is Agile Windup in a sentence.

**Snatch** is amazing. So is ❄️Aether Hail❄️

What's your favourite card, @Flex?

@xXThunkLoverXx 

Do you also like Tiger Eye Reflex?
```

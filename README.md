<<<<<<< HEAD
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Anti-Adjective Editor

A plain-text editor with one function: to highlight adjective and adverb use and provide alternatives in the form of verbs or nouns.

### Justification

Adjectives are static:

> “I would recommend to all storytellers a watchful attitude and a thoughtful, careful choice of adjectives and adverbs,
> because the bakery shop of English is rich beyond belief, and narrative prose, particularly if it’s going a long distance,
> needs more muscle than fat.”
> -- Ursula K. Le Guin

They should, when possible, be replaced with a more-precise verb or noun that already has the adjective implicit in it:

> "It is nouns and verbs, not their assistants, that give good writing its toughness and color.”
> -- E.B. White

> "All fine prose is based on the verbs carrying the sentences. They make sentences move."
> -- F. Scott Fitzgerald

> “All nouns are abbreviations. Instead of saying cold, sharp, burning, unbreakable, shining, pointy,
> we utter ‘dagger’; for the receding sun and oncoming darkness, we say ‘twilight.’”
> -- Jorge Luis Borges

In practice, a tool like this is more useful for practice minimizing adjective use in your instinctual writing flow, rather than for composing an entire piece of work within. Adjectives, used sparingly, enrich good clean prose and should not be banished altogether.

### Functionality

Two seconds after the user stops inputting text, the editor will run a debounced parsing function using [compromise nlp](https://github.com/spencermountain/compromise) to tag adjective use with a different color than the rest of the document.

When adjectives are colored, the user can hit the TAB key to jump back to the most recent adjective, highlight it, and pull up alternatives for that adjective in the left and right sidebars. These alternatives come from the [Datamuse API](https://www.datamuse.com/api/). The left sidebar is populated with nouns that are associated with the adjective, and the right sidebar is populated with verbs.

Pressing the MODE button or pressing the ALT key changes the parsing pattern used. The default mode is that adjectives next to nouns and adverbs next to verbs are paired together in a single replaceable chunk. The alternative mode is that words surrounding the adjective are ignored, and adjectives are treated in isolation.

There are three selectable color schemes at the top and a bottom-right button to download the current plain-text editor content as a txt file.

### Future Changes

As of now, when the parsing function is run the text caret jumps to the end of the current sentence or the current adjective-chunk. This is intentional behavior, because editor content is re-created on every parse, so the default behavior would be for the caret to jump to the beginning to the editor (which is really bad). Because the editor content might change during the new parse in an infinite variety of ways, it's proved difficult to re-calculate the same caret position in a potentially completely different DOM tree. The current algorithm makes fallable but usually-sound assumptions, for example, that most of the edited content will be located before the current caret position, rather than after. The current behavior obviously not ideal. The next version will try to preserve caret position within the DOM node rather than simply jumping to the end.

# A mode to temporarily turn off parsing altogether might be useful too.

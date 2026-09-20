/**
 * The package as one surface: a number written in digits, and the ending it
 * takes once it is read aloud.
 *
 * Re-exported wholesale rather than through a curated list. The low-level
 * pieces are part of the point — `spokenLastWord` says which word decides the
 * ending and `endingFor` works on any spoken word, not only on a number — so
 * hiding them behind `withEnding` would cost more than it saves.
 */

export * from "./turkish.js";

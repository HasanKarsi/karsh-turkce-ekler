/**
 * Turkish case endings for numbers written as digits.
 *
 * An ending after "15" is not chosen by the digits but by how the number is
 * read aloud — "on beş" — and only the last word counts: its last vowel picks
 * the vowel of the ending (vowel harmony) and its last sound decides between
 * d and t (after f s t k ç ş h p the d hardens). So 15'inde but 30'unda,
 * 13:40'ta but 17:30'da. A clock time is read hour then minute, which is why
 * its ending follows the minute unless the minute is zero.
 *
 * The apostrophe is part of the returned ending: a number written in digits
 * always takes one.
 */

const ONES = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
const TENS = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];

const BACK_VOWELS = "aıou";
const VOWELS = "aıoueiöü";
/** "Fıstıkçı şahap": the consonants after which d becomes t. */
const HARD = "fstkçşhp";

/** The last word of the number as it is spoken. */
export function spokenLastWord(n: number): string {
  const value = Math.abs(Math.trunc(n));
  if (value === 0) return "sıfır";
  if (value % 10) return ONES[value % 10]!;
  if (Math.floor(value / 10) % 10) return TENS[Math.floor(value / 10) % 10]!;
  if (Math.floor(value / 100) % 10) return "yüz";
  if (value % 1_000_000) return "bin";
  if (value % 1_000_000_000) return "milyon";
  return "milyar";
}

export type TurkishCase =
  /** -da: "09:00'da" */
  | "loc"
  /** -dan: "09:00'dan" */
  | "abl"
  /** -a: "17:00'ye" */
  | "dat"
  /** third-person possessive: "ayın 3'ü" */
  | "poss"
  /** possessive + locative: "ayın 3'ünde" */
  | "possLoc"
  /** possessive + ablative: "ayın 1'inden" */
  | "possAbl"
  /** possessive + dative: "ayın 15'ine" */
  | "possDat";

function lastVowel(word: string): string {
  for (let i = word.length - 1; i >= 0; i -= 1) {
    if (VOWELS.includes(word[i]!)) return word[i]!;
  }
  return "e";
}

/** a/e — the two-way harmony of -da, -dan, -a. */
function twoWay(vowel: string): string {
  return BACK_VOWELS.includes(vowel) ? "a" : "e";
}

/** ı/i/u/ü — the four-way harmony of the possessive. */
function fourWay(vowel: string): string {
  if (vowel === "a" || vowel === "ı") return "ı";
  if (vowel === "e" || vowel === "i") return "i";
  if (vowel === "o" || vowel === "u") return "u";
  return "ü";
}

/** The ending for a spoken word, without the apostrophe. */
export function endingFor(word: string, kase: TurkishCase): string {
  const vowel = lastVowel(word);
  const last = word[word.length - 1]!;
  const endsInVowel = VOWELS.includes(last);
  const a = twoWay(vowel);

  switch (kase) {
    case "loc":
      return `${HARD.includes(last) ? "t" : "d"}${a}`;
    case "abl":
      return `${HARD.includes(last) ? "t" : "d"}${a}n`;
    case "dat":
      return endsInVowel ? `y${a}` : a;
    default: {
      // The possessive ends in a vowel of the same front/back class, and the
      // case endings after it take a buffer n: 6'sı → 6'sında, 3'ü → 3'üne.
      const possessive = `${endsInVowel ? "s" : ""}${fourWay(vowel)}`;
      if (kase === "poss") return possessive;
      if (kase === "possLoc") return `${possessive}nd${a}`;
      if (kase === "possAbl") return `${possessive}nd${a}n`;
      return `${possessive}n${a}`;
    }
  }
}

/** "15" + possLoc → "'inde". */
export function numberEnding(n: number, kase: TurkishCase): string {
  return `'${endingFor(spokenLastWord(n), kase)}`;
}

/** 15 + possLoc → "15'inde". */
export function withEnding(n: number, kase: TurkishCase): string {
  return `${n}${numberEnding(n, kase)}`;
}

/**
 * The number a clock time is last read as: "13:40" is "on üç kırk", so kırk;
 * "12:00" is just "on iki"; "09:00:30" ends on its seconds.
 */
export function spokenClockNumber(hour: number, minute: number, second = 0): number {
  if (second !== 0) return second;
  if (minute !== 0) return minute;
  return hour;
}

/** "13:40" + loc → "'ta". */
export function clockEnding(hour: number, minute: number, second: number, kase: TurkishCase): string {
  return numberEnding(spokenClockNumber(hour, minute, second), kase);
}

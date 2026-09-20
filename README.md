# karsh-turkce-ekler

Rakamla yazılmış bir sayıya doğru Türkçe eki getirir: `15'inde`, ama `30'unda`.
Turkish case endings for numbers written as digits — vowel harmony, the buffer
consonant and the hardening of `d`.

120 satır · sıfır bağımlılık · DOM yok · MIT
120 lines · zero dependencies · no DOM · MIT

---

## Türkçe

### Ne işe yarar

Türkçe'de bir sayının eki rakamdan değil, okunuşundan çıkar. `15` "on beş"
diye okunur ve eki yalnızca son kelimeye bakar: `15'inde`. `30` "otuz"tur,
kalın sıradan: `30'unda`. Son ses sert ünsüzse `d` sertleşir: `13:40'ta`, ama
`17:30'da`.

Bu ek elle yazılamaz, çünkü rakam veriden gelir: bir cron cümlesinde, bir
rapor başlığında, bir fatura satırında. Paket eki hesaplar — ünlü uyumu,
iyeliğin dört yönlü uyumu, kaynaştırma `n`'si ve "fıstıkçı şahap"
sertleşmesi dahil.

### Kurulum

Paket TypeScript kaynağı olarak dağıtılır; derleme adımı yoktur.

```bash
npm i github:<kullanıcı>/karsh-turkce-ekler
```

Kaynak TypeScript olduğu için tüketen tarafın TS'i çözebilmesi gerekir:
Vite, esbuild, webpack ya da Next gibi bir paketleyici. Next'te ayrıca
`next.config` dosyana `transpilePackages: ["karsh-turkce-ekler"]` eklemen gerekir: Next
`node_modules` içindeki ham TypeScript'i kendiliğinden derlemez. Düz `node`
paketi olduğu gibi çalıştıramaz.

Ya da `src/turkish.ts` dosyasını projene kopyala: tek dosya, tek başına
çalışır, lisansı MIT.

### Kullanım

```ts
import { withEnding, numberEnding, clockEnding } from "karsh-turkce-ekler";

withEnding(15, "possLoc"); // "15'inde"
withEnding(30, "possLoc"); // "30'unda"
withEnding(1, "loc");      // "1'de"
withEnding(17, "dat");     // "17'ye"
```

Saatler ayrı bir kural: saat önce, dakika sonra okunur, dolayısıyla ek —
dakika sıfır değilse — dakikaya uyar.

```ts
"13:40" + clockEnding(13, 40, 0, "loc"); // "13:40'ta"
"17:30" + clockEnding(17, 30, 0, "loc"); // "17:30'da"
"09:00" + clockEnding(9, 0, 0, "loc");   // "09:00'da"
```

Ek bir şablonun içine tek başına da girebilir:

```ts
"ayın " + withEnding(2, "possAbl") + " " + withEnding(20, "possDat") + " kadar";
// "ayın 2'sinden 20'sine kadar"
```

### API

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `withEnding` | `(n: number, kase: TurkishCase) => string` | Sayı ve eki birlikte: `withEnding(15, "possLoc")` → `15'inde` |
| `numberEnding` | `(n: number, kase: TurkishCase) => string` | Yalnızca ek, kesme işaretiyle: `'inde` |
| `endingFor` | `(word: string, kase: TurkishCase) => string` | Okunan bir kelimenin eki, kesmesiz: `endingFor("beş", "loc")` → `te` |
| `spokenLastWord` | `(n: number) => string` | Okunuşun eki belirleyen son kelimesi: `15` → `beş`, `1000` → `bin` |
| `spokenClockNumber` | `(hour: number, minute: number, second?: number) => number` | Saatin en son okunan sayısı: `13:40` → `40`, `12:00` → `12` |
| `clockEnding` | `(hour: number, minute: number, second: number, kase: TurkishCase) => string` | Saate gelen ek: `13:40` → `'ta` |
| `TurkishCase` | tip | Aşağıdaki yedi hal |

Haller:

| `kase` | Ek | Örnek |
| --- | --- | --- |
| `loc` | bulunma, -da / -de / -ta / -te | `09:00'da` |
| `abl` | çıkma, -dan / -den / -tan / -ten | `09:00'dan` |
| `dat` | yönelme, -a / -e / -ya / -ye | `17:00'ye` |
| `poss` | 3. tekil iyelik | `ayın 3'ü` |
| `possLoc` | iyelik + bulunma | `ayın 3'ünde` |
| `possAbl` | iyelik + çıkma | `ayın 1'inden` |
| `possDat` | iyelik + yönelme | `ayın 15'ine` |

Sayının işareti ve ondalığı yok sayılır: ek `Math.abs(Math.trunc(n))`
üzerinden seçilir, çünkü eki belirleyen okunuştur.

### Neden kütüphane değil, elle yazıldı

Kural kırk satır tutuyor ve hiç değişmiyor: ünlü uyumu, iyeliğin dört yönlü
uyumu, kaynaştırma `n`'si, sert ünsüzden sonra `d` yerine `t`. Bunun için bir
bağımlılık taşımak, bir daha asla güncellenmeyecek bir şey için sürüm takibi
yapmak demek.

Hazır çekim kütüphaneleri de işe yaramıyor: onlar İngilizce'ye göre yazılmış
ve çoğul eklerini çözüyorlar. Türkçe'de sorun çoğul değil, rakamın nasıl
okunduğu — ve `spokenClockNumber` hiçbir genel kütüphanede yok, çünkü bir
saatin son okunan sayısını bilmek yalnızca Türkçe cümle kuran birinin derdi.

Paket KARSH Lab'ın cron aracı için yazıldı; `ayın 1'inden 15'ine kadar her
gün, 13:40'ta` gibi cümlelerdeki her eki bu dosya üretiyor.

### Lisans

MIT — bkz. [LICENSE](LICENSE). © 2026 Hasan Karşı / KARSH.

---

## English

### What it does

In Turkish the ending a number takes is decided not by its digits but by how
it is read aloud, and only by the last word of that reading. `15` is "on beş",
so it takes `15'inde`; `30` is "otuz", a back-vowel word, so it takes
`30'unda`. When the last sound is one of `f s t k ç ş h p`, the `d` of the
ending hardens to `t`: `13:40'ta`, but `17:30'da`.

You cannot write these endings by hand, because the number comes from data —
a cron expression, a report heading, an invoice line. This package computes
the ending: vowel harmony, the four-way harmony of the possessive, the buffer
`n`, and the consonant hardening.

### Install

The package ships as TypeScript source; there is no build step.

```bash
npm i github:<user>/karsh-turkce-ekler
```

Because it ships as TypeScript, whatever consumes it has to resolve TS: a
bundler such as Vite, esbuild, webpack or Next. On Next you also need
`transpilePackages: ["karsh-turkce-ekler"]` in your `next.config`: Next does not compile raw
TypeScript inside `node_modules` on its own. Plain `node` cannot run the
package as it ships.

Or copy `src/turkish.ts` into your project — one file, no imports, MIT.

### Usage

```ts
import { withEnding, numberEnding, clockEnding } from "karsh-turkce-ekler";

withEnding(15, "possLoc"); // "15'inde"
withEnding(30, "possLoc"); // "30'unda"
withEnding(1, "loc");      // "1'de"
withEnding(17, "dat");     // "17'ye"
```

A clock is read hour first, minute second, so its ending follows the minute
unless the minute is zero.

```ts
"13:40" + clockEnding(13, 40, 0, "loc"); // "13:40'ta"
"17:30" + clockEnding(17, 30, 0, "loc"); // "17:30'da"
"09:00" + clockEnding(9, 0, 0, "loc");   // "09:00'da"
```

The ending can also be dropped into a sentence on its own:

```ts
"ayın " + withEnding(2, "possAbl") + " " + withEnding(20, "possDat") + " kadar";
// "ayın 2'sinden 20'sine kadar" — from the 2nd to the 20th of the month
```

### API

| Export | Signature | What it does |
| --- | --- | --- |
| `withEnding` | `(n: number, kase: TurkishCase) => string` | The number and its ending: `withEnding(15, "possLoc")` → `15'inde` |
| `numberEnding` | `(n: number, kase: TurkishCase) => string` | The ending alone, apostrophe included: `'inde` |
| `endingFor` | `(word: string, kase: TurkishCase) => string` | The ending for a spoken word, no apostrophe: `endingFor("beş", "loc")` → `te` |
| `spokenLastWord` | `(n: number) => string` | The word of the reading that decides the ending: `15` → `beş`, `1000` → `bin` |
| `spokenClockNumber` | `(hour: number, minute: number, second?: number) => number` | The last number a clock time is read as: `13:40` → `40`, `12:00` → `12` |
| `clockEnding` | `(hour: number, minute: number, second: number, kase: TurkishCase) => string` | The ending for a clock time: `13:40` → `'ta` |
| `TurkishCase` | type | The seven cases below |

| `kase` | Ending | Example |
| --- | --- | --- |
| `loc` | locative, -da / -de / -ta / -te | `09:00'da` |
| `abl` | ablative, -dan / -den / -tan / -ten | `09:00'dan` |
| `dat` | dative, -a / -e / -ya / -ye | `17:00'ye` |
| `poss` | third-person possessive | `ayın 3'ü` |
| `possLoc` | possessive + locative | `ayın 3'ünde` |
| `possAbl` | possessive + ablative | `ayın 1'inden` |
| `possDat` | possessive + dative | `ayın 15'ine` |

Sign and fraction are ignored: the ending is chosen from
`Math.abs(Math.trunc(n))`, because what decides it is the reading.

### Why this was written rather than installed

The rule is forty lines and it never changes: vowel harmony, the four-way
harmony of the possessive, the buffer `n`, and `d` turning into `t` after a
hard consonant. Carrying a dependency for that means tracking versions of
something that will never be updated again.

The general inflection packages do not help either. They are built for
English and solve plurals; in Turkish the problem is not the plural but the
reading of the digits — and `spokenClockNumber` is in no general library at
all, because knowing the last number a clock time is read as is a problem you
only have when you are writing Turkish sentences.

It was written for the cron tool in KARSH Lab, where every ending in a
sentence like `ayın 1'inden 15'ine kadar her gün, 13:40'ta` comes from this
file.

### License

MIT — see [LICENSE](LICENSE). © 2026 Hasan Karşı / KARSH.

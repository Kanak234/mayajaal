/**
 * Tests for the streak logic and the status-bar text.
 *
 * These are the parts that decide what the user sees, and they are written to
 * be testable without VS Code: Ginti and the pure helpers touch no editor API,
 * so this runs on plain node.
 */

const assert = require("assert");

// jaadu.js requires "vscode" at the top, which does not exist outside the
// editor. Stub it before loading, with just the shapes the module reads.
const Module = require("module");
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, ...rest) {
  if (req === "vscode") return "vscode-stub";
  return origResolve.call(this, req, ...rest);
};
require.cache["vscode-stub"] = {
  id: "vscode-stub", filename: "vscode-stub", loaded: true,
  exports: {
    StatusBarAlignment: { Right: 2 },
    DecorationRangeBehavior: { ClosedClosed: 1 },
    ThemeColor: class { constructor(id) { this.id = id; } },
    window: { createStatusBarItem: () => ({ show() {}, hide() {}, dispose() {} }),
              createTextEditorDecorationType: () => ({ dispose() {} }) },
    workspace: { getConfiguration: () => ({ get: (_k, d) => d }) },
  },
};

const { Ginti, PADAV, CHINH, padavDekho, pattiText, chinhChuno } = require("../jaadu.js");

let pass = 0, fail = 0;
function it(name, fn) {
  try { fn(); pass++; console.log("  [ पास ]  " + name); }
  catch (e) { fail++; console.log("  [ फेल ]  " + name + "\n           " + e.message); }
}

console.log("\n  गिनती");

it("शुरू में streak शून्य", () => {
  assert.strictEqual(new Ginti().haal().streak, 0);
});

it("टाइप करने पर streak बढ़ता है", () => {
  const g = new Ginti(); g.likha(5);
  assert.strictEqual(g.haal().streak, 5);
});

it("कई बार टाइप करने पर जुड़ता जाता है", () => {
  const g = new Ginti(); g.likha(3); g.likha(4);
  assert.strictEqual(g.haal().streak, 7);
});

it("मिटाने पर streak शून्य हो जाता है", () => {
  const g = new Ginti(); g.likha(10); g.mita();
  assert.strictEqual(g.haal().streak, 0);
});

it("रुकने पर भी शून्य", () => {
  const g = new Ginti(); g.likha(10); g.ruka();
  assert.strictEqual(g.haal().streak, 0);
});

it("सबसे लंबा streak याद रहता है", () => {
  const g = new Ginti(); g.likha(30); g.mita(); g.likha(5);
  assert.strictEqual(g.haal().sabse, 30);
});

it("कुल अक्षर मिटाने से घटते नहीं", () => {
  const g = new Ginti(); g.likha(10); g.mita(); g.likha(5);
  assert.strictEqual(g.haal().kul, 15);
});

it("शून्य या ऋणात्मक पर कुछ नहीं बढ़ता", () => {
  const g = new Ginti(); g.likha(0); g.likha(-3);
  assert.strictEqual(g.haal().streak, 0);
});

console.log("\n  पड़ाव");

it("ठीक 25 पर पड़ाव आता है", () => {
  assert.ok(padavDekho(25));
});

it("24 या 26 पर नहीं आता", () => {
  assert.strictEqual(padavDekho(24), null);
  assert.strictEqual(padavDekho(26), null);
});

it("हर पड़ाव पर चिह्न और बात दोनों हैं", () => {
  for (const p of PADAV) {
    assert.ok(p.chinh && p.chinh.length > 0, "चिह्न नहीं: " + p.streak);
    assert.ok(p.baat && p.baat.length > 0, "बात नहीं: " + p.streak);
  }
});

it("पड़ाव घटते क्रम में हैं (पहला मेल सबसे बड़ा)", () => {
  const s = PADAV.map(p => p.streak);
  assert.deepStrictEqual(s, [...s].sort((a, b) => b - a));
});

it("टाइप करते-करते पड़ाव लौटता है", () => {
  const g = new Ginti();
  let mila = null;
  for (let i = 0; i < 25; i++) mila = g.likha(1) || mila;
  assert.ok(mila, "25 तक पहुँचकर भी पड़ाव नहीं आया");
});

it("पड़ाव सिर्फ़ एक बार, दोबारा नहीं", () => {
  const g = new Ginti();
  let baar = 0;
  for (let i = 0; i < 30; i++) if (g.likha(1)) baar++;
  assert.strictEqual(baar, 1);
});

console.log("\n  पट्टी");

it("streak शून्य हो तो सिर्फ़ नाम", () => {
  assert.strictEqual(pattiText({ streak: 0 }), "मायाजाल");
});

it("streak दिखता है", () => {
  assert.ok(pattiText({ streak: 7 }).includes("7"));
});

it("पड़ाव पार करने पर उसका चिह्न आता है", () => {
  assert.ok(pattiText({ streak: 120 }).includes("🎯"));
});

it("सबसे बड़ा पार किया हुआ पड़ाव जीतता है", () => {
  assert.ok(pattiText({ streak: 600 }).includes("🏹"));
});

console.log("\n  चिह्न");

it("चिह्न घूमते रहते हैं, कभी खाली नहीं", () => {
  for (let i = 0; i < CHINH.length * 3; i++) {
    assert.ok(chinhChuno(i).length > 0);
  }
});

it("चक्र पूरा होने पर वही चिह्न लौटता है", () => {
  assert.strictEqual(chinhChuno(0), chinhChuno(CHINH.length));
});

console.log("\n  नतीजा:  " + pass + " पास,  " + fail + " फेल\n");
process.exit(fail ? 1 : 0);

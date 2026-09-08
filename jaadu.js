/**
 * जादू — typing effects for Mayajaal.
 *
 * The idea is borrowed from the "ridiculous coding" genre: make writing code
 * feel like something is happening. None of that project's code is used here;
 * the effects, the milestones and the wording are written for this extension
 * and are Indian rather than generic.
 *
 * What VS Code actually allows shapes this. There is no particle system and no
 * audio API. What an extension can do is decorate text and own a status-bar
 * item, so that is what the effects are made of: a mark that appears beside the
 * cursor and fades, and a counter that reacts as you keep going.
 *
 * Everything here is off-switchable, because an editor that will not stop
 * moving is a bad editor for most people most of the time.
 */

const vscode = require("vscode");

/* Milestones. Each is a streak length and what to say when it is reached.
   Ordered high to low; the first match wins. */
const PADAV = [
  { streak: 500, chinh: "🏹", baat: "अर्जुन का निशाना — 500!" },
  { streak: 300, chinh: "🔱", baat: "त्रिशूल — 300 अक्षर एक साँस में" },
  { streak: 200, chinh: "🪔", baat: "दीप जल उठा — 200" },
  { streak: 100, chinh: "🎯", baat: "शतक! 100 पूरे" },
  { streak: 50,  chinh: "🥁", baat: "ढोल बजा — 50" },
  { streak: 25,  chinh: "✨", baat: "रंगोली बन रही है — 25" },
];

/* Marks that pop beside the cursor as you type, cycling. */
const CHINH = ["✦", "✧", "◈", "❖", "✺", "❉", "❋", "✸"];

function padavDekho(streak) {
  for (const p of PADAV) {
    if (streak === p.streak) return p;
  }
  return null;
}

/** Streak grows while you type, and resets when you stop or delete. */
class Ginti {
  constructor() {
    this.streak = 0;
    this.sabse = 0;
    this.kul = 0;
  }

  likha(n) {
    if (n <= 0) return null;
    this.streak += n;
    this.kul += n;
    if (this.streak > this.sabse) this.sabse = this.streak;
    return padavDekho(this.streak);
  }

  mita() {
    this.streak = 0;
  }

  ruka() {
    this.streak = 0;
  }

  haal() {
    return { streak: this.streak, sabse: this.sabse, kul: this.kul };
  }
}

/** The status-bar text. Kept pure so it can be tested without an editor. */
function pattiText(g) {
  if (g.streak === 0) return "मायाजाल";
  const p = PADAV.find(x => g.streak >= x.streak);
  return (p ? p.chinh : "✦") + " " + g.streak;
}

function chinhChuno(n) {
  return CHINH[n % CHINH.length];
}

class Jaadu {
  constructor(context) {
    this.g = new Ginti();
    this.n = 0;
    this.timer = null;

    this.patti = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right, 100);
    this.patti.text = "मायाजाल";
    this.patti.tooltip = "Mayajaal — typing streak";
    this.patti.command = "mayajaal.jaaduToggle";

    this.sajawat = vscode.window.createTextEditorDecorationType({
      after: { margin: "0 0 0 0.4em", color: new vscode.ThemeColor("charts.yellow") },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });

    context.subscriptions.push(this.patti, this.sajawat);
    this.padho();
  }

  padho() {
    const c = vscode.workspace.getConfiguration("mayajaal");
    this.chalu = c.get("jaadu.enabled", true);
    this.dikhaoPatti = c.get("jaadu.statusBar", true);
    this.dikhaoChinh = c.get("jaadu.cursorMarks", true);
    this.padavDikhao = c.get("jaadu.milestones", true);
    if (this.chalu && this.dikhaoPatti) this.patti.show();
    else this.patti.hide();
  }

  badla(e) {
    if (!this.chalu) return;
    const ed = vscode.window.activeTextEditor;
    if (!ed || e.document !== ed.document) return;

    let joda = 0, hataya = 0;
    for (const ch of e.contentChanges) {
      joda += ch.text.length;
      hataya += ch.rangeLength;
    }

    if (hataya > joda) {
      this.g.mita();
      this.taazaKaro(ed, null);
      return;
    }

    const padav = this.g.likha(joda - hataya);
    this.n += 1;
    this.taazaKaro(ed, padav);

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.g.ruka();
      this.taazaKaro(vscode.window.activeTextEditor, null);
    }, 2500);
  }

  taazaKaro(ed, padav) {
    if (this.dikhaoPatti) this.patti.text = pattiText(this.g.haal());

    if (!ed) return;
    if (!this.dikhaoChinh || this.g.streak === 0) {
      ed.setDecorations(this.sajawat, []);
      return;
    }
    const pos = ed.selection.active;
    const text = padav ? padav.chinh + " " + padav.baat : chinhChuno(this.n);
    ed.setDecorations(this.sajawat, [{
      range: new vscode.Range(pos, pos),
      renderOptions: { after: { contentText: text } },
    }]);

    if (padav && this.padavDikhao) {
      vscode.window.setStatusBarMessage(padav.chinh + "  " + padav.baat, 3000);
    }
  }

  toggle() {
    const c = vscode.workspace.getConfiguration("mayajaal");
    const naya = !c.get("jaadu.enabled", true);
    c.update("jaadu.enabled", naya, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(
      naya ? "मायाजाल का जादू चालू." : "मायाजाल का जादू बंद.");
  }
}

module.exports = { Jaadu, Ginti, PADAV, CHINH, padavDekho, pattiText, chinhChuno };

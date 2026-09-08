"use strict";
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { Jaadu } = require("./jaadu.js");

// A few spells / lines that fit a Potterhead + Spider-Man dev.
const SPELLS = [
  "Lumos — light up the bug you have been avoiding. 🪄",
  "With great power comes great refactoring. 🕸️",
  "Expecto Patronum — ship the feature that scares you. ✨",
  "Your friendly neighbourhood compiler believes in you.",
  "Wingardium Leviosa — lift that O(n²) into O(n log n).",
  "The web holds. Push the commit. 🕷️",
  "Alohomora — the hard problem just needs the right key.",
  "Nitin can wait. The code cannot. Build. 🔥",
];

function insertBanner(editor, text) {
  // A calligraphy-style comment banner, language-agnostic.
  const line = "═".repeat(Math.max(text.length + 6, 40));
  const banner = `/*\n  ${line}\n     ✦  ${text}  ✦\n  ${line}\n*/\n`;
  editor.edit((e) => e.insert(editor.selection.active, banner));
}

function activate(context) {
  // जादू — typing effects. Everything it does is switchable off in settings;
  // see mayajaal.jaadu.* . It is created first so the status bar appears as
  // soon as the window is ready.
  const jaadu = new Jaadu(context);
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(e => jaadu.badla(e)),
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("mayajaal.jaadu")) jaadu.padho();
    }),
    vscode.commands.registerCommand("mayajaal.jaaduToggle", () => jaadu.toggle())
  );

  const bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  bar.text = "🕸️ Mayajaal";
  bar.tooltip = "Web of Magic — cast a spell";
  bar.command = "mayajaal.spell";
  bar.show();
  context.subscriptions.push(bar);

  context.subscriptions.push(
    vscode.commands.registerCommand("mayajaal.spell", () => {
      const s = SPELLS[Math.floor(Math.random() * SPELLS.length)];
      vscode.window.showInformationMessage(s);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("mayajaal.banner", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("Mayajaal: open a file first.");
        return;
      }
      const text = await vscode.window.showInputBox({
        prompt: "Banner text",
        value: "KANAK PRABHAKAR",
      });
      if (text) insertBanner(editor, text);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("mayajaal.welcome", () => {
      const panel = vscode.window.createWebviewPanel(
        "mayajaalWelcome",
        "Mayajaal ✦ Web of Magic",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      const htmlPath = path.join(context.extensionPath, "media", "welcome.html");
      let html;
      try {
        html = fs.readFileSync(htmlPath, "utf8");
      } catch (_) {
        html = "<h1 style='color:#C9A227;font-family:sans-serif'>Mayajaal</h1>";
      }
      panel.webview.html = html;
    })
  );

  // Show the welcome once on first activation.
  vscode.commands.executeCommand("mayajaal.welcome");
}

function deactivate() {}

module.exports = { activate, deactivate };

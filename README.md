# Mayajaal — Web of Magic 🕸️⚡

A themed VS Code experience for a **Spider-Man fan and a Potterhead**.
मायाजाल means *"the web of magic / illusion"* in Sanskrit — a spider's web and a
wizard's spell in one word.

Built by **Kanak Prabhakar**.

## What's inside

- **A colour theme — "Mayajaal (Web & Wand)"** — a deep-night editor with
  Spidey-crimson keywords and Gryffindor-gold strings. Pick it from
  *Preferences → Color Theme*.
- **Magical welcome panel** — an animated spider-web with drifting golden
  magic-motes and a calligraphy title. Opens on first launch, or via
  *Mayajaal: Open Magical Welcome*.
- **Cast a Spell** — a status-bar 🕸️ button that drops a Potter/Spidey-flavoured
  bit of motivation. (*Mayajaal: Cast a Spell*)
- **Calligraphy banner** — insert a decorative comment banner into any file.
  (*Mayajaal: Insert Calligraphy Banner*)

## Install (locally)

```bash
# option A — package and install the .vsix
npm i -g @vscode/vsce
vsce package
code --install-extension mayajaal-1.0.0.vsix

# option B — run it live
code .        # then press F5 to launch an Extension Development Host
```

Then open the Command Palette (`Ctrl/Cmd+Shift+P`) and type **Mayajaal**.

## Commands

| Command | What it does |
|---|---|
| `Mayajaal: Open Magical Welcome` | the animated web-and-wand welcome panel |
| `Mayajaal: Cast a Spell (motivation)` | a random spell / Spidey line |
| `Mayajaal: Insert Calligraphy Banner` | a decorative comment banner |

## Built with

Pure VS Code extension API + a self-contained Canvas animation. No build step,
no runtime dependencies.

## License

MIT © 2026 Kanak Prabhakar — see [`LICENSE`](LICENSE).

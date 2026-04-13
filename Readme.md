# Canvas Drawing App

A browser-based drawing application built with [p5.js](https://p5js.org/), featuring multiple creative tools, pixel-level canvas manipulation, and a clean dark UI.

> Live demo: [mirzara04.github.io/drawing_app](https://mirzara04.github.io/drawing_app)

---

## Features

- **Freehand** — smooth brush drawing with adjustable size, opacity, and round/square tip
- **Line Tool** — click and drag to draw precise straight lines with variable thickness
- **Spray Can** — randomised spray paint effect
- **Mirror Draw** — draw with real-time vertical or horizontal symmetry
- **Scissor Tool** — drag to select a region, cut it, rotate it, and paste it anywhere
- **Distortion Tool** — pixel-level push, pull, swirl, pinch, and bulge effects with live preview
- **Stamp Tool** — place star, cloud, and polygon stamps with rotation control
- **Colour Palette** — 24 preset swatches plus a custom colour picker with live preview
- **Undo / Redo** — full history stack (Ctrl+Z / Ctrl+Y), including clear
- **Save** — export your drawing as a PNG

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `R` | Rotate scissor selection +15° |
| `Shift+R` | Rotate scissor selection -15° |
| `P` | Start paste preview (scissor tool) |

---

## Technical Highlights

- **Pixel manipulation** — the distortion tool reads and writes raw canvas pixel arrays directly via `loadPixels()` / `updatePixels()`, implementing five distinct warp algorithms (push, pull, swirl, pinch, bulge)
- **Undo/redo stack** — canvas state is snapshotted as `Uint8ClampedArray` on every mouse release, capped at 30 history entries to manage memory
- **Tool architecture** — each tool follows a consistent interface (`draw`, `mousePressed`, `mouseReleased`, `populateOptions`, `unselectTool`), making it straightforward to add new tools
- **Scissor cut/paste** — captures a pixel region with `get()`, erases the source area, then renders a live paste preview with rotation before committing

---

## Getting Started

```bash
git clone https://github.com/mirzara04/drawing_app.git
cd drawing_app
npm install
npx http-server . -p 3000
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
npm run test:unit          # unit tests
npm run test:integration   # integration tests
npm run test:coverage      # full coverage report
```

---

## Project Structure

```
├── sketch.js           # p5.js entry point, global setup, undo/redo
├── toolbox.js          # tool registry and sidebar rendering
├── colourPalette.js    # colour swatches and custom picker
├── helperFunctions.js  # clear, save, help modal
├── freehandTool.js
├── lineToTool.js
├── mirrorDrawTool.js
├── scissorTool.js
├── distortionTool.js
├── stampTool.js
├── assets/             # SVG and PNG tool icons
├── lib/                # p5.js library
└── tests/              # unit, integration, system, acceptance
```

---

## Built With

- [p5.js](https://p5js.org/) — creative coding / canvas library
- Vanilla JavaScript (ES5/ES6)
- HTML5 Canvas API
- CSS Grid layout

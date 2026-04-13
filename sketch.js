// Global variables
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas = null;
var setupCompleted = false;

// Undo/Redo history
var undoStack = [];
var redoStack = [];
var MAX_HISTORY = 30;

function saveHistory() {
  loadPixels();
  undoStack.push(new Uint8ClampedArray(pixels));
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack = [];
}

function undoAction() {
  if (undoStack.length === 0) return;
  loadPixels();
  redoStack.push(new Uint8ClampedArray(pixels));
  var prev = undoStack.pop();
  loadPixels();
  for (var i = 0; i < pixels.length; i++) pixels[i] = prev[i];
  updatePixels();
}

function redoAction() {
  if (redoStack.length === 0) return;
  loadPixels();
  undoStack.push(new Uint8ClampedArray(pixels));
  var next = redoStack.pop();
  loadPixels();
  for (var i = 0; i < pixels.length; i++) pixels[i] = next[i];
  updatePixels();
}

function mouseOnCanvas(c) {
  return mouseX >= 0 && mouseX <= c.width &&
         mouseY >= 0 && mouseY <= c.height;
}

sprayCan = {
  name: "sprayCan",
  icon: "assets/sprayCan.svg",
  points: 13,
  spread: 10,

  draw: function () {
    if (!mouseOnCanvas(canvas)) return;
    stroke(colourP?.selectedColour || 0);
    if (mouseIsPressed) {
      for (var i = 0; i < this.points; i++) {
        point(random(mouseX - this.spread, mouseX + this.spread),
              random(mouseY - this.spread, mouseY + this.spread));
      }
    }
  },
  populateOptions: function () {
    const toolOptions = select("#toolOptions");
    if (!toolOptions) return;
    toolOptions.html(`
      <div style="color:#fff;margin-bottom:12px;"><strong>Spray Can</strong></div>
      <div style="font-size:11px;color:#ccc;text-align:center;">Click and drag to spray paint.</div>
    `);
  },
  unselectTool: function () {
    const toolOptions = select("#toolOptions");
    if (toolOptions) toolOptions.html("");
  },
  mousePressed: function () {},
  mouseReleased: function () {}
};

function setup() {
  if (setupCompleted) return;

  if (typeof createCanvas === 'undefined') {
    console.error("p5.js not loaded!");
    setTimeout(setup, 100);
    return;
  }

  if (!document.getElementById('sidebar') || !document.getElementById('content')) {
    setTimeout(setup, 100);
    return;
  }

  const canvasContainer = select('#content');
  let c;
  if (canvasContainer) {
    const containerWidth = canvasContainer.size().width;
    const containerHeight = canvasContainer.size().height;
    c = createCanvas(containerWidth, containerHeight);
  } else {
    c = createCanvas(800, 600);
  }
  c.parent("content");
  canvas = c;

  if (!canvas) {
    console.error("Failed to create canvas!");
    return;
  }

  try {
    helpers = new HelperFunctions();
    colourP = new ColourPalette();
  } catch (error) {
    console.error("Error during initialisation:", error);
  }

  try {
    toolbox = new Toolbox();
  } catch (error) {
    console.error("Error creating toolbox:", error);
    return;
  }

  if (!toolbox?.addTool) {
    console.error("Toolbox not properly initialized!");
    return;
  }

  if (toolbox.tools.length > 0) toolbox.clearAll();

  if (typeof FreehandTool === 'undefined' || typeof LineToTool === 'undefined' ||
      typeof mirrorDrawTool === 'undefined' || typeof ScissorTool === 'undefined') {
    console.error("One or more tool classes not found!");
    return;
  }

  const freehandTool  = new FreehandTool();
  const lineToTool    = new LineToTool();
  const mirrorTool    = new mirrorDrawTool();
  const scissorTool   = new ScissorTool();
  const distortionTool = new DistortionTool();
  const stampTool     = new StampTool();

  toolbox.addTool(stampTool);
  toolbox.addTool(distortionTool);
  toolbox.addTool(freehandTool);
  toolbox.addTool(lineToTool);
  toolbox.addTool(sprayCan);
  toolbox.addTool(mirrorTool);
  toolbox.addTool(scissorTool);

  if (typeof scissorTool.populateOptions === "function") {
    scissorTool.populateOptions();
  }

  if (!select("#toolOptions")) {
    console.error("Tool options element not found!");
    return;
  }

  background(255);
  setupCompleted = true;
}

function draw() {
  if (toolbox.selectedTool?.draw) {
    toolbox.selectedTool.draw();
  }
}

function mousePressed() {
  if (toolbox.selectedTool?.mousePressed) {
    toolbox.selectedTool.mousePressed();
  }
}

function mouseReleased() {
  saveHistory();
  if (toolbox.selectedTool?.mouseReleased) {
    toolbox.selectedTool.mouseReleased();
  }
}

function mouseDragged() {
  if (toolbox.selectedTool?.mouseDragged) {
    toolbox.selectedTool.mouseDragged();
  }
}

function keyPressed() {
  // Undo: Ctrl+Z
  if (keyCode === 90 && (keyIsDown(CONTROL) || keyIsDown(91))) {
    undoAction();
    return;
  }
  // Redo: Ctrl+Y or Ctrl+Shift+Z
  if ((keyCode === 89 && keyIsDown(CONTROL)) || (keyCode === 90 && keyIsDown(CONTROL) && keyIsDown(SHIFT))) {
    redoAction();
    return;
  }

  const tool = toolbox?.selectedTool;
  if (!tool) return;

  if (typeof tool.keyPressed === "function") {
    tool.keyPressed();
  }

  if (tool.name === "scissorTool") {
    if (typeof tool.setRotation === "function") {
      if (key === 'r') tool.setRotation(tool.getRotation() + 15);
      if (key === 'R') tool.setRotation(tool.getRotation() - 15);
    }
    if (key === 'p' && typeof tool.hasSelection === "function" && tool.hasSelection()) {
      if (typeof tool.startPastePreview === "function") tool.startPastePreview();
    }
  }
}

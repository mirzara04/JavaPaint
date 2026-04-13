// Global variables
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas = null;
var setupCompleted = false;

function mouseOnCanvas(c) {
  return mouseX >= 0 && mouseX <= c.width &&
         mouseY >= 0 && mouseY <= c.height;
}

sprayCan = {
  name: "sprayCan",
  icon: "assets/sprayCan.jpg",
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
    if (!toolOptions) {
      console.warn("Tool options element not found for spray can tool");
      return;
    }
    toolOptions.html("<div>Spray paint tool. Click and drag to spray paint.</div>");
  },
  unselectTool: function () {
    const toolOptions = select("#toolOptions");
    if (toolOptions) toolOptions.html("");
  },

  mousePressed: function () {},
  mouseReleased: function () {}
};

function setup() {
  console.log("Setup function started - Call #" + (window.setupCallCount || 0));
  window.setupCallCount = (window.setupCallCount || 0) + 1;

  if (setupCompleted) {
    console.log("Setup already completed, skipping...");
    return;
  }

  if (typeof createCanvas === 'undefined') {
    console.error("p5.js not loaded! Waiting...");
    setTimeout(setup, 100);
    return;
  }

  if (!document.getElementById('sidebar') || !document.getElementById('content')) {
    console.error("DOM elements not ready, retrying in 100ms...");
    setTimeout(setup, 100);
    return;
  }

  const canvasContainer = select('#content');
  console.log("Canvas container found:", canvasContainer);

  let c;
  if (canvasContainer) {
    const containerWidth = canvasContainer.size().width;
    const containerHeight = canvasContainer.size().height;
    c = createCanvas(containerWidth, containerHeight);
    c.parent("content");
    canvas = c;
    console.log("Canvas created with size:", containerWidth, "x", containerHeight);
  } else {
    c = createCanvas(800, 600);
    c.parent("content");
    canvas = c;
    console.log("Default canvas created with size: 800 x 600");
  }

  if (!canvas) {
    console.error("Failed to create canvas!");
    return;
  }

  try {
    helpers = new HelperFunctions();
    colourP = new ColourPalette();
    console.log("Helpers and colour palette created successfully");
  } catch (error) {
    console.error("Error creating helpers or colour palette:", error);
  }

  try {
    toolbox = new Toolbox();
    console.log("Toolbox created successfully");
  } catch (error) {
    console.error("Error creating toolbox:", error);
    return;
  }

  if (!toolbox || !toolbox.addTool) {
    console.error("Toolbox not properly initialized!");
    return;
  }

  if (toolbox.tools.length > 0) {
    console.log("Clearing existing tools to prevent duplicates");
    toolbox.clearAll();
  }

  if (typeof FreehandTool === 'undefined' ||
      typeof LineToTool === 'undefined' ||
      typeof mirrorDrawTool === 'undefined' ||
      typeof ScissorTool === 'undefined') {
    console.error("One or more tool classes not found!");
    return;
  }

  const freehandTool = new FreehandTool();
  const lineToTool = new LineToTool();
  const sprayCanTool = sprayCan;
  const mirrorTool = new mirrorDrawTool();
  const scissorTool = new ScissorTool();
  const distortionTool = new DistortionTool();
  const stampTool = new StampTool();

  toolbox.addTool(stampTool);
  toolbox.addTool(distortionTool);
  toolbox.addTool(freehandTool);
  toolbox.addTool(lineToTool);
  toolbox.addTool(sprayCanTool);
  toolbox.addTool(mirrorTool);
  toolbox.addTool(scissorTool);

  console.log("All tools added successfully:", toolbox.tools.map(t => t.name));
  toolbox.listTools();

  if (typeof scissorTool.populateOptions === "function") {
    scissorTool.populateOptions();
    console.log("ScissorTool options populated (Paste button bound).");
  }

  checkDOMState();

  const toolOptions = select("#toolOptions");
  if (!toolOptions) {
    console.error("Tool options element not found! Cannot initialize tools properly.");
    return;
  }

  background(255);
  setupCompleted = true;
}

function checkDOMState() {
  console.log("=== DOM State Check ===");

  const sidebar = select('#sidebar');
  if (sidebar) {
    console.log("Sidebar found:", sidebar);
    console.log("Sidebar HTML:", sidebar.html());
    console.log("Sidebar children count:", sidebar.elt.children.length);
  } else {
    console.error("Sidebar not found!");
  }

  const content = select('#content');
  if (content) {
    console.log("Content found:", content);
    console.log("Content size:", content.size());
  } else {
    console.error("Content not found!");
  }

  const toolOptions = select('#toolOptions');
  if (toolOptions) {
    console.log("Tool options found:", toolOptions);
    console.log("Tool options HTML:", toolOptions.html());
    console.log("Tool options parent:", toolOptions.parent());
  } else {
    console.error("Tool options not found!");
    const colourPalette = select('.colourPalette');
    if (colourPalette) {
      console.log("Colour palette found:", colourPalette);
      console.log("Colour palette HTML:", colourPalette.html());
    } else {
      console.error("Colour palette not found!");
    }
  }

  console.log("Document body children:", document.body.children.length);
  console.log("Document ready state:", document.readyState);
  console.log("=== End DOM State Check ===");
}

function draw() {
  if (toolbox.selectedTool?.draw) {
    toolbox.selectedTool.draw();
  } else {
    console.error("No selected tool or tool missing draw method!");
    console.log("Selected tool:", toolbox.selectedTool);
  }

  // Mouse coordinates display removed - the screen corner will now be clean
}

function mousePressed() {
  console.log("Mouse pressed, selected tool:", toolbox.selectedTool?.name || "none");

  if (toolbox.selectedTool?.mousePressed) {
    console.log("Calling mousePressed on tool:", toolbox.selectedTool.name);
    toolbox.selectedTool.mousePressed();
  } else {
    console.log("No mousePressed method on selected tool");
  }
}

function mouseReleased() {
  console.log("Mouse released, selected tool:", toolbox.selectedTool?.name || "none");

  if (toolbox.selectedTool?.mouseReleased) {
    console.log("Calling mouseReleased on tool:", toolbox.selectedTool.name);
    toolbox.selectedTool.mouseReleased();
  } else {
    console.log("No mouseReleased method on selected tool");
  }
}

function mouseDragged() {
  console.log("Mouse dragged, selected tool:", toolbox.selectedTool?.name || "none");

  if (toolbox.selectedTool?.mouseDragged) {
    console.log("Calling mouseDragged on tool:", toolbox.selectedTool.name);
    toolbox.selectedTool.mouseDragged();
  } else {
    console.log("No mouseDragged method on selected tool");
  }
}

function keyPressed() {
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
      if (typeof tool.startPastePreview === "function") {
        tool.startPastePreview();
      }
    }
  }
}
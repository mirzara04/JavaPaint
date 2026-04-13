function ScissorTool() {
  this.icon = "assets/scissor.svg";
  this.name = "scissorTool";

  var selecting = false;
  var startX = -1, startY = -1, endX = -1, endY = -1;

  var selImage = null;
  var hasSelection = false;
  var pasting = false;
  var rotationAngle = 0;

  // Store the original canvas state before making selection
  var originalCanvasData = null;
  var selectionX = 0, selectionY = 0, selectionW = 0, selectionH = 0;

  // Store canvas snapshot for clean overlay drawing
  var canvasSnapshot = null;

  // Store reference to self for event handlers
  var self = this;

  var takeCanvasSnapshot = function() {
    loadPixels();
    canvasSnapshot = new Uint8ClampedArray(pixels);
  };

  var restoreCanvasSnapshot = function() {
    if (canvasSnapshot) {
      loadPixels();
      for (var i = 0; i < pixels.length; i++) {
        pixels[i] = canvasSnapshot[i];
      }
      updatePixels();
    }
  };

  this.mousePressed = function () {
    if (!mouseOnCanvas(canvas)) return;

    if (!pasting) {
      selecting = true;
      startX = mouseX;
      startY = mouseY;
      endX = startX;
      endY = startY;
      takeCanvasSnapshot(); // Take clean snapshot before drawing selection
      return;
    }

    if (pasting && hasSelection && selImage) {
      
      // Restore clean canvas first
      restoreCanvasSnapshot();
      
      // Paste the selection at the new location
      push();
      translate(mouseX, mouseY);
      rotate(radians(rotationAngle));
      imageMode(CENTER);
      image(selImage, 0, 0);
      pop();

      loadPixels(); // commit to canvas
      
      // COMPLETE RESET after pasting
      pasting = false;
      selecting = false;
      hasSelection = false;
      startX = startY = endX = endY = -1;
      selImage = null;
      originalCanvasData = null;
      canvasSnapshot = null;
      rotationAngle = 0;
      
      // Update instructions after pasting
      var ins = select("#instructions");
      if (ins) ins.html("<strong>Pasted!</strong> Make another selection or choose a different tool.");
    }
  };

  this.mouseReleased = function () {
    if (!selecting) return;
    
    endX = mouseX;
    endY = mouseY;

    var x = Math.min(startX, endX);
    var y = Math.min(startY, endY);
    var w = Math.abs(endX - startX);
    var h = Math.abs(endY - startY);

    if (w < 3 || h < 3) {
      restoreCanvasSnapshot();
      selecting = false;
      startX = startY = endX = endY = -1;
      selImage = null;
      hasSelection = false;
      originalCanvasData = null;
      canvasSnapshot = null;
      return;
    }

    // Restore clean canvas before processing selection
    restoreCanvasSnapshot();

    // Store the original canvas pixels before cutting
    loadPixels();
    originalCanvasData = new Uint8ClampedArray(w * h * 4);
    for (var py = 0; py < h; py++) {
      for (var px = 0; px < w; px++) {
        var canvasIndex = ((y + py) * width + (x + px)) * 4;
        var originalIndex = (py * w + px) * 4;
        
        if (canvasIndex >= 0 && canvasIndex < pixels.length - 3) {
          originalCanvasData[originalIndex] = pixels[canvasIndex];
          originalCanvasData[originalIndex + 1] = pixels[canvasIndex + 1];
          originalCanvasData[originalIndex + 2] = pixels[canvasIndex + 2];
          originalCanvasData[originalIndex + 3] = pixels[canvasIndex + 3];
        }
      }
    }
    
    selectionX = x;
    selectionY = y;
    selectionW = w;
    selectionH = h;

    // Get the selection
    selImage = get(x, y, w, h);
    hasSelection = true;

    // Clear selection drawing state
    selecting = false;
    startX = startY = endX = endY = -1;

    // Create the visual cut
    push();
    if (typeof erase === "function") {
      erase();
      rect(x, y, w, h);
      noErase();
    } else {
      noStroke();
      fill(255);
      rect(x, y, w, h);
    }
    pop();

    loadPixels();
    // Take new snapshot after cutting
    takeCanvasSnapshot();
    
    // Update instructions after selection
    var ins = select("#instructions");
    if (ins) ins.html("<strong>Selection made!</strong> Click the header <b>Paste</b> button to preview and place your selection.");
  };

  this.draw = function () {
    if (!mouseOnCanvas(canvas)) return;

    // Only draw selection rectangle while actively selecting
    if (selecting && startX >= 0 && startY >= 0) {
      // Restore clean canvas
      restoreCanvasSnapshot();
      
      endX = mouseX;
      endY = mouseY;

      var x = Math.min(startX, endX);
      var y = Math.min(startY, endY);
      var w = Math.abs(endX - startX);
      var h = Math.abs(endY - startY);

      // Draw selection rectangle as overlay (not committed to canvas)
      push();
      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      rectMode(CORNER);
      rect(x, y, w, h);
      pop();
      return;
    }

    // Draw paste preview
    if (pasting && hasSelection && selImage) {
      restoreCanvasSnapshot();

      push();
      translate(mouseX, mouseY);
      rotate(radians(rotationAngle));
      imageMode(CENTER);
      image(selImage, 0, 0);

      fill(0, 122, 255, 60);
      stroke(0, 122, 255);
      strokeWeight(2);
      rectMode(CENTER);
      rect(0, 0, selImage.width, selImage.height);
      pop();
    }
  };

  this.populateOptions = function () {
    var panel = select("#toolOptions");
    if (!panel) panel = select(".toolOptions");
    
    if (panel) {
      panel.html(
        '<div style="color:#fff;margin-bottom:10px;"><strong>Scissor Tool</strong></div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
          '<button id="scissorClear" style="background:#045b51;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Clear Selection</button>' +
        '</div>' +
        '<div style="margin-top:8px;font-size:12px;color:#ccc;">' +
          'Drag to select. Click <b>Paste</b> button to preview and place.' +
        '</div>'
      );

      var cb = select("#scissorClear");
      if (cb) {
        cb.mousePressed(function() { self.clearSelection(); });
      }
    }

    setTimeout(function() { self.setupPasteButton(); }, 200);
  };

  this.setupPasteButton = function() {
    var headerPasteBtn = select("#pasteButton");
    if (headerPasteBtn) {
      headerPasteBtn.elt.onclick = null;
      headerPasteBtn.mousePressed(function() {
        if (!hasSelection || !selImage) {
          alert("Please make a selection first by dragging on the canvas with the scissor tool.");
          return;
        }
        rotationAngle = 0;
        pasting = true;
        var ins = select("#instructions");
        if (ins) ins.html("<strong>PASTE MODE:</strong> Move mouse to position, then click to place selection.");
      });
    } else {
      console.warn("Paste button (#pasteButton) not found in DOM!");
    }
  };

  this.clearSelection = function () {
    
    // If we have a cut area showing, restore it before clearing
    if (originalCanvasData && hasSelection) {
      loadPixels();
      
      for (var y = 0; y < selectionH; y++) {
        for (var x = 0; x < selectionW; x++) {
          var canvasIndex = ((selectionY + y) * width + (selectionX + x)) * 4;
          var originalIndex = (y * selectionW + x) * 4;
          
          if (canvasIndex >= 0 && canvasIndex < pixels.length - 3 && 
              originalIndex >= 0 && originalIndex < originalCanvasData.length - 3) {
            pixels[canvasIndex] = originalCanvasData[originalIndex];
            pixels[canvasIndex + 1] = originalCanvasData[originalIndex + 1];
            pixels[canvasIndex + 2] = originalCanvasData[originalIndex + 2];
            pixels[canvasIndex + 3] = originalCanvasData[originalIndex + 3];
          }
        }
      }
      
      updatePixels();
    }
    
    // COMPLETE RESET of all states
    selecting = false;
    pasting = false;
    hasSelection = false;
    rotationAngle = 0;
    startX = startY = endX = endY = -1;
    selImage = null;
    originalCanvasData = null;
    canvasSnapshot = null;
    selectionX = selectionY = selectionW = selectionH = 0;
    
    var ins = select("#instructions");
    if (ins) ins.html("<strong>Selection cleared.</strong> Drag to make a new selection.");
  };

  this.unselectTool = function () {
    var panel = select("#toolOptions");
    if (!panel) panel = select(".toolOptions");
    if (panel) panel.html("");
    
    // If we have a cut area showing when switching tools, restore it
    if (originalCanvasData && hasSelection && !pasting) {
      loadPixels();
      
      for (var y = 0; y < selectionH; y++) {
        for (var x = 0; x < selectionW; x++) {
          var canvasIndex = ((selectionY + y) * width + (selectionX + x)) * 4;
          var originalIndex = (y * selectionW + x) * 4;
          
          if (canvasIndex >= 0 && canvasIndex < pixels.length - 3 && 
              originalIndex >= 0 && originalIndex < originalCanvasData.length - 3) {
            pixels[canvasIndex]     = originalCanvasData[originalIndex];
            pixels[canvasIndex + 1] = originalCanvasData[originalIndex + 1];
            pixels[canvasIndex + 2] = originalCanvasData[originalIndex + 2];
            pixels[canvasIndex + 3] = originalCanvasData[originalIndex + 3];
          }
        }
      }
      
      updatePixels();
    }
    
    // COMPLETE RESET when unselecting tool
    pasting = false;
    selecting = false;
    hasSelection = false;
    startX = startY = endX = endY = -1;
    selImage = null;
    originalCanvasData = null;
    canvasSnapshot = null;
    
    var ins = select("#instructions");
    if (ins) ins.html("<strong>Instructions:</strong> Select a tool from the sidebar.");
  };

  // Public methods
  this.getRotation = function() { return rotationAngle; };
  this.setRotation = function(angle) { rotationAngle = (angle + 360) % 360; };
  this.hasSelection = function() { return hasSelection; };
  this.isPasting = function() { return pasting; };
  this.startPastePreview = function() {
    if (!hasSelection || !selImage) return;
    rotationAngle = 0;
    pasting = true;
    var ins = select("#instructions");
    if (ins) ins.html("<strong>PASTE MODE:</strong> Move mouse to position, then click to place.");
  };
}
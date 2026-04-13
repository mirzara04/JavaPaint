function LineToTool(){
	this.icon = "assets/lineTo.svg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	this.populateOptions = function(){
	    var toolOptions = select("#toolOptions");
	    if (!toolOptions) return;

	    toolOptions.html(`
	        <div style="color:#fff;margin-bottom:12px;"><strong>Line Tool</strong></div>
	        <label style="color:#fff;font-size:12px;display:block;margin-bottom:4px;">
	            Thickness: <span id="lineThicknessValue">1</span>px
	        </label>
	        <div id="lineThicknessContainer" style="margin-bottom:12px;"></div>
	        <div style="font-size:11px;color:#ccc;text-align:center;">
	            Click and drag to draw a straight line
	        </div>
	    `);

	    this.lineThicknessSlider = createSlider(1, 30, 1);
	    this.lineThicknessSlider.parent("lineThicknessContainer");
	    this.lineThicknessSlider.style("width", "100%");

	    var self = this;
	    this.lineThicknessSlider.input(function() {
	        var display = select("#lineThicknessValue");
	        if (display) display.html(self.lineThicknessSlider.value());
	    });
	}

	this.unselectTool = function(){
	    var toolOptions = select("#toolOptions");
	    if (!toolOptions) return;
	    toolOptions.html("");
	    // Reset drawing state
	    drawing = false;
	    startMouseX = -1;
	    startMouseY = -1;
	}

	this.draw = function(){
	    // Only draw when actively drawing a line
	    if (!drawing) return;
	    
	    if(!mouseOnCanvas(canvas)){
	        return;
	    }
	    
	    // Get line thickness from slider
	    let thickness = this.lineThicknessSlider ? this.lineThicknessSlider.value() : 1;
	    strokeWeight(thickness);
	    
	    // Set color from color palette
	    if (typeof colourP !== 'undefined' && colourP.selectedColour) {
	        stroke(colourP.selectedColour);
	    } else {
	        stroke(0); // Default to black
	    }
	    
	    // Draw preview line from start point to current mouse position
	    updatePixels(); // Restore canvas
	    line(startMouseX, startMouseY, mouseX, mouseY);
	    
	    // Add a small dot at the start point for better visibility
	    noStroke();
	    fill(colourP && colourP.selectedColour ? colourP.selectedColour : 0);
	    ellipse(startMouseX, startMouseY, thickness + 2);
	};

	// Handle mouse press - start drawing
	this.mousePressed = function() {
		if (!mouseOnCanvas(canvas)) return;
		startMouseX = mouseX;
		startMouseY = mouseY;
		drawing = true;
		loadPixels();
	};

	// Handle mouse release - complete the line
	this.mouseReleased = function() {
		if (!drawing) return;
	    
	    // Draw the final line
	    updatePixels(); // Restore canvas
	    
	    // Get line thickness from slider
	    let thickness = this.lineThicknessSlider ? this.lineThicknessSlider.value() : 1;
	    strokeWeight(thickness);
	    
	    // Set color from color palette
	    if (typeof colourP !== 'undefined' && colourP.selectedColour) {
	        stroke(colourP.selectedColour);
	    } else {
	        stroke(0); // Default to black
	    }
	    
	    // Draw the final line
	    line(startMouseX, startMouseY, mouseX, mouseY);
	    loadPixels(); // Save the new state
	    
	    // Reset drawing state
	    drawing = false;
	    startMouseX = -1;
	    startMouseY = -1;
	};
}

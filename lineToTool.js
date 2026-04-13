function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;

	this.populateOptions = function(){
	    // Check if toolOptions element exists before proceeding
	    var toolOptions = select("#toolOptions");
	    if (!toolOptions) {
	        console.warn("Tool options element not found for line tool");
	        return;
	    }
	    
	    toolOptions.html("<div>Line Tool - Adjust thickness below:</div>");
	    this.lineThicknessSlider = createSlider(1, 20, 1);
	    this.lineThicknessSlider.parent("toolOptions");
	}

	this.unselectTool = function(){
	    // Check if toolOptions element exists before proceeding
	    var toolOptions = select("#toolOptions");
	    if (!toolOptions) {
	        console.warn("Tool options element not found for line tool unselect");
	        return;
	    }
	    
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
	    if(!mouseOnCanvas(canvas)){
	        return;
	    }
	    
	    console.log("Line tool: Mouse pressed at", mouseX, mouseY);
	    startMouseX = mouseX;
	    startMouseY = mouseY;
	    drawing = true;
	    loadPixels(); // Save current canvas state
	};

	// Handle mouse release - complete the line
	this.mouseReleased = function() {
	    if (!drawing) return;
	    
	    console.log("Line tool: Mouse released at", mouseX, mouseY);
	    
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

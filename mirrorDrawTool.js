function mirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.jpg";

	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry is halfway across the screen
	this.lineOfSymmetry = 0;

	//this changes in the p5.dom click handler. So storing it as
	//a variable self now means we can still access this in the handler
	var self = this;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of the Line of symmetry.
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;

	// Drawing state
	var drawing = false;

	this.draw = function() {
		if(!mouseOnCanvas(canvas)){
			return;
		}
		
		//display the last save state of pixels
		updatePixels();

		//do the drawing if the mouse is pressed
		if (mouseIsPressed && drawing) {
			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
				previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
			}

			//if there are values in the previous locations
			//draw a line between them and the current positions
			else {
				// Set stroke properties for drawing
				let thickness = 2; // Default thickness
				strokeWeight(thickness);
				
				// Set color from color palette
				if (typeof colourP !== 'undefined' && colourP.selectedColour) {
					stroke(colourP.selectedColour);
				} else {
					stroke(0); // Default to black
				}
				
				console.log(`Drawing line from (${previousMouseX}, ${previousMouseY}) to (${mouseX}, ${mouseY})`);
				
				// Draw on the main side
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				
				// Draw on the mirrored side
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");
				console.log(`Mirrored line from (${previousOppositeMouseX}, ${previousOppositeMouseY}) to (${oX}, ${oY})`);
				line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
				
				// Update previous positions
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = oX;
				previousOppositeMouseY = oY;
			}
		}
		//if the mouse isn't pressed reset the previous values to -1
		else if (!mouseIsPressed && drawing) {
			drawing = false;
			previousMouseX = -1;
			previousMouseY = -1;
			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;
		}

		//after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing
		loadPixels();

		//push the drawing state so that we can set the stroke weight and colour
		push();
		strokeWeight(3);
		stroke("red");
		//draw the line of symmetry
		if (this.axis == "x") {
			line(canvas.width / 2, 0, canvas.width / 2, canvas.height);
		} else {
			line(0, canvas.height / 2, canvas.width, canvas.height / 2);
		}
		//return to the original stroke
		pop();
	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (x or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) {
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.axis) {
			return n;
		}

		// Calculate the line of symmetry based on current axis
		var symmetryLine;
		if (this.axis == "x") {
			symmetryLine = canvas.width / 2;
		} else {
			symmetryLine = canvas.height / 2;
		}

		//if n is less than the line of symmetry return a coordinate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < symmetryLine) {
			var result = symmetryLine + (symmetryLine - n);
			console.log(`Mirror ${a}: ${n} < ${symmetryLine} -> ${result}`);
			return result;
		}

		//otherwise a coordinate that is smaller than the line of symmetry
		//by the distance between it and n.
		else {
			var result = symmetryLine - (n - symmetryLine);
			console.log(`Mirror ${a}: ${n} >= ${symmetryLine} -> ${result}`);
			return result;
		}
	};

	//when the tool is deselected update the pixels to just show the drawing and
	//hide the line of symmetry. Also clear options
	this.unselectTool = function() {
		updatePixels();
		//clear options
		var toolOptions = select("#toolOptions");
		if (toolOptions) {
			toolOptions.html("");
		}
		// Reset drawing state
		drawing = false;
		previousMouseX = -1;
		previousMouseY = -1;
		previousOppositeMouseX = -1;
		previousOppositeMouseY = -1;
	};

	//adds a button and click handler to the options area. When clicked
	//toggle the line of symmetry between horizontal to vertical
	this.populateOptions = function() {
		// Check if toolOptions element exists before proceeding
		var toolOptions = select("#toolOptions");
		if (!toolOptions) {
			console.warn("Tool options element not found for mirror draw tool");
			return;
		}
		
		// Initialize line of symmetry with current canvas dimensions
		if (this.axis == "x") {
			this.lineOfSymmetry = canvas.width / 2;
		} else {
			this.lineOfSymmetry = canvas.height / 2;
		}
		
		toolOptions.html(`
			<div style="margin-bottom: 10px;">
				<strong>Mirror Draw Tool</strong><br>
				Current: ${this.axis === 'x' ? 'Vertical' : 'Horizontal'} Mirror
			</div>
			<button id='directionButton' style="margin: 5px; padding: 8px 16px; background: #045b51; color: white; border: none; border-radius: 4px; cursor: pointer;">
				${this.axis === 'x' ? 'Make Horizontal' : 'Make Vertical'}
			</button>
			<div style="margin-top: 10px; font-size: 12px; color: #ccc;">
				Click and drag to draw with mirror symmetry
			</div>
		`);
		
		//click handler
		select("#directionButton").mouseClicked(function() {
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = canvas.height / 2;
				this.html('Make Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = canvas.width / 2;
				this.html('Make Horizontal');
			}
			
			// Update the display
			var infoDiv = toolOptions.select('div');
			if (infoDiv) {
				infoDiv.html(`<strong>Mirror Draw Tool</strong><br>Current: ${self.axis === 'x' ? 'Vertical' : 'Horizontal'} Mirror`);
			}
		});
	};
	
	// Handle mouse press - start drawing
	this.mousePressed = function() {
		if(!mouseOnCanvas(canvas)){
			return;
		}
		
		console.log("Mirror draw tool: Mouse pressed at", mouseX, mouseY);
		drawing = true;
		// Reset previous positions to start fresh
		previousMouseX = -1;
		previousMouseY = -1;
		previousOppositeMouseX = -1;
		previousOppositeMouseY = -1;
	};
	
	// Handle mouse release - complete the drawing
	this.mouseReleased = function() {
		if (!drawing) return;
		
		console.log("Mirror draw tool: Mouse released at", mouseX, mouseY);
		
		// The draw function handles the drawing, we just need to reset state
		drawing = false;
		previousMouseX = -1;
		previousMouseY = -1;
		previousOppositeMouseX = -1;
		previousOppositeMouseY = -1;
	};
}
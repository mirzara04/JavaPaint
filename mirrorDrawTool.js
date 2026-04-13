function mirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.svg";

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
				let thickness = this.brushSizeSlider ? this.brushSizeSlider.value() : 2;
				strokeWeight(thickness);
				
				// Set color from color palette
				if (typeof colourP !== 'undefined' && colourP.selectedColour) {
					stroke(colourP.selectedColour);
				} else {
					stroke(0); // Default to black
				}
				
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");
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
			return symmetryLine + (symmetryLine - n);
		} else {
			return symmetryLine - (n - symmetryLine);
		}
	};

	this.unselectTool = function() {
		updatePixels();
		var toolOptions = select("#toolOptions");
		if (toolOptions) toolOptions.html("");
		this.brushSizeSlider = null;
		drawing = false;
		previousMouseX = -1;
		previousMouseY = -1;
		previousOppositeMouseX = -1;
		previousOppositeMouseY = -1;
	};

	this.populateOptions = function() {
		var toolOptions = select("#toolOptions");
		if (!toolOptions) return;

		if (this.axis == "x") {
			this.lineOfSymmetry = canvas.width / 2;
		} else {
			this.lineOfSymmetry = canvas.height / 2;
		}

		toolOptions.html(`
			<div style="color:#fff;margin-bottom:12px;"><strong>Mirror Draw Tool</strong><br>
			<span style="font-size:11px;color:#ccc;">Mirror: ${this.axis === 'x' ? 'Vertical' : 'Horizontal'}</span></div>
			<label style="color:#fff;font-size:12px;display:block;margin-bottom:4px;">
			    Brush Size: <span id="mirrorBrushSizeValue">2</span>px
			</label>
			<div id="mirrorBrushSizeContainer" style="margin-bottom:12px;"></div>
			<button id='directionButton' style="width:100%;padding:7px;background:#045b51;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-bottom:8px;">
				${this.axis === 'x' ? 'Switch to Horizontal' : 'Switch to Vertical'}
			</button>
			<div style="font-size:11px;color:#ccc;text-align:center;">
				Click and drag to draw with mirror symmetry
			</div>
		`);

		this.brushSizeSlider = createSlider(1, 30, 2);
		this.brushSizeSlider.parent("mirrorBrushSizeContainer");
		this.brushSizeSlider.style("width", "100%");

		var self = this;
		this.brushSizeSlider.input(function() {
			var display = select("#mirrorBrushSizeValue");
			if (display) display.html(self.brushSizeSlider.value());
		});

		select("#directionButton").mouseClicked(function() {
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = canvas.height / 2;
				this.html('Switch to Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = canvas.width / 2;
				this.html('Switch to Horizontal');
			}
		});
	};
	
	// Handle mouse press - start drawing
	this.mousePressed = function() {
		if (!mouseOnCanvas(canvas)) return;
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
		drawing = false;
		previousMouseX = -1;
		previousMouseY = -1;
		previousOppositeMouseX = -1;
		previousOppositeMouseY = -1;
	};
}
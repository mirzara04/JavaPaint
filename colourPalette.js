//Displays and handles the colour palette.
function ColourPalette() {
	//a list of web colour strings - only 8 basic colors
	this.colours = ["black", "red", "green", "blue", "yellow", "purple", "orange", "white"];
	this.selectedColour = "black";

	var self = this;

	var colourClick = function() {
		//remove the old border
		var current = select("#" + self.selectedColour + "Swatch");
		if (current) current.style("border", "0");

		//get the new colour from the id of the clicked element
		var c = this.id().split("Swatch")[0];

		//set the selected colour and fill and stroke
		self.selectedColour = c;
		fill(c);
		stroke(c);

		//add a new border to the selected colour
		this.style("border", "2px solid blue");
		
		// Update brush preview if freehand tool is active
		if (typeof toolbox !== 'undefined' && toolbox.selectedTool && 
		    toolbox.selectedTool.name === 'freehand' && 
		    typeof toolbox.selectedTool.updateBrushPreview === 'function') {
			toolbox.selectedTool.updateBrushPreview();
		}
	}

	//load in the colours
	this.loadColours = function() {
		console.log("Loading colour palette...");
		
		var paletteContainer = select(".colourPalette");
		if (!paletteContainer) {
			console.error("Colour palette container not found!");
			return;
		}
		
		// Clear existing content but preserve structure
		paletteContainer.html("");
		
		// Create the color palette title
		var paletteTitle = createDiv("Color Palette");
		paletteTitle.style("color", "#fff");
		paletteTitle.style("font-size", "1.1rem");
		paletteTitle.style("font-weight", "600");
		paletteTitle.style("margin-bottom", "15px");
		paletteTitle.style("text-align", "center");
		paletteContainer.child(paletteTitle);
		
		// Create container for color swatches
		var swatchContainer = createDiv();
		swatchContainer.style("display", "flex");
		swatchContainer.style("flex-wrap", "wrap");
		swatchContainer.style("justify-content", "center");
		swatchContainer.style("gap", "5px");
		swatchContainer.style("margin-bottom", "20px");
		paletteContainer.child(swatchContainer);
		
		//set the fill and stroke properties to be black at the start of the programme
		fill(this.colours[0]);
		stroke(this.colours[0]);

		//for each colour create a new div in the html for the colourSwatches
		for (var i = 0; i < this.colours.length; i++) {
			var colourID = this.colours[i] + "Swatch";

			//using p5.dom add the swatch to the palette and set its background colour
			//to be the colour value.
			var colourSwatch = createDiv();
			colourSwatch.class('colourSwatches');
			colourSwatch.id(colourID);
			colourSwatch.attribute('aria-label', this.colours[i] + ' color');
			colourSwatch.attribute('tabindex', '0');

			swatchContainer.child(colourSwatch);
			select("#" + colourID).style("background-color", this.colours[i]);
			colourSwatch.mouseClicked(colourClick);
		}
		
		// Set border only on the first swatch
		select("#" + this.colours[0] + "Swatch").style("border", "2px solid blue");
		
		// Create tool options container
		this.createToolOptionsContainer(paletteContainer);
		
		console.log("Colour palette loaded successfully");
	};
	
	// Create the tool options container
	this.createToolOptionsContainer = function(paletteContainer) {
		console.log("Creating tool options container...");
		
		// Create tool options title
		var optionsTitle = createDiv("Tool Options");
		optionsTitle.style("color", "#fff");
		optionsTitle.style("font-size", "1.1rem");
		optionsTitle.style("font-weight", "600");
		optionsTitle.style("margin-bottom", "15px");
		optionsTitle.style("text-align", "center");
		optionsTitle.style("border-top", "1px solid #444");
		optionsTitle.style("padding-top", "20px");
		paletteContainer.child(optionsTitle);
		
		// Create the actual tool options container
		var toolOptionsDiv = createDiv();
		toolOptionsDiv.id("toolOptions");
		toolOptionsDiv.class("toolOptions");
		toolOptionsDiv.style("width", "100%");
		toolOptionsDiv.style("min-height", "100px");
		paletteContainer.child(toolOptionsDiv);
		
		// Add default message
		toolOptionsDiv.html('<div style="color: #ccc; font-size: 0.9rem; text-align: center; margin-top: 20px;">Select a tool to see options</div>');
		
		console.log("Tool options container created:", toolOptionsDiv);
	};
	
	//call the loadColours function now it is declared
	this.loadColours();
}
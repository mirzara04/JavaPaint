//Displays and handles the colour palette.
function ColourPalette() {
	this.colours = [
		"#000000", "#ffffff", "#808080", "#c0c0c0",
		"#ff0000", "#ff6600", "#ffcc00", "#ffff00",
		"#00cc00", "#006600", "#00cccc", "#0000ff",
		"#6600cc", "#cc00cc", "#ff66aa", "#993300",
		"#ff9999", "#ffcc99", "#ffff99", "#ccffcc",
		"#99ccff", "#cc99ff", "#ffccff", "#ccffff"
	];
	this.selectedColour = "#000000";

	var self = this;

	// Central method to apply a colour selection
	this.applyColour = function(c) {
		// Deselect previous swatch highlight
		var allSwatches = selectAll(".colourSwatches");
		for (var i = 0; i < allSwatches.length; i++) {
			allSwatches[i].style("border", "2px solid transparent");
			allSwatches[i].style("box-shadow", "none");
		}

		self.selectedColour = c;
		fill(c);
		stroke(c);

		// Highlight matching swatch if it exists
		var swatchId = "swatch_" + c.replace("#", "");
		var matchingSwatch = select("#" + swatchId);
		if (matchingSwatch) {
			matchingSwatch.style("border", "2px solid #ffeb3b");
			matchingSwatch.style("box-shadow", "0 0 6px #ffeb3b");
		}

		// Update the custom picker to reflect the current colour
		var picker = select("#customColourPicker");
		if (picker) picker.elt.value = self.toHex(c);

		// Update current colour preview
		var preview = select("#currentColourPreview");
		if (preview) preview.style("background-color", c);
	};

	// Convert any CSS colour string to hex (best-effort for named colours)
	this.toHex = function(c) {
		if (c && c.startsWith("#")) return c;
		// Use a temporary canvas to resolve named colours
		var tmp = document.createElement("canvas");
		tmp.width = tmp.height = 1;
		var ctx = tmp.getContext("2d");
		ctx.fillStyle = c;
		ctx.fillRect(0, 0, 1, 1);
		var d = ctx.getImageData(0, 0, 1, 1).data;
		return "#" + [d[0], d[1], d[2]].map(function(v) {
			return v.toString(16).padStart(2, "0");
		}).join("");
	};

	var colourClick = function() {
		var c = "#" + this.id().replace("swatch_", "");
		self.applyColour(c);
	};

	this.loadColours = function() {
		var paletteContainer = select(".colourPalette");
		if (!paletteContainer) return;

		paletteContainer.html("");

		// Title
		var paletteTitle = createDiv("Color Palette");
		paletteTitle.style("color", "#fff");
		paletteTitle.style("font-size", "1.1rem");
		paletteTitle.style("font-weight", "600");
		paletteTitle.style("margin-bottom", "10px");
		paletteTitle.style("text-align", "center");
		paletteContainer.child(paletteTitle);

		// Current colour preview + custom picker row
		var pickerRow = createDiv();
		pickerRow.style("display", "flex");
		pickerRow.style("align-items", "center");
		pickerRow.style("justify-content", "center");
		pickerRow.style("gap", "8px");
		pickerRow.style("margin-bottom", "12px");
		paletteContainer.child(pickerRow);

		// Small square showing the active colour
		var preview = createDiv();
		preview.id("currentColourPreview");
		preview.style("width", "28px");
		preview.style("height", "28px");
		preview.style("border-radius", "4px");
		preview.style("border", "2px solid #fff");
		preview.style("background-color", self.selectedColour);
		preview.style("flex-shrink", "0");
		pickerRow.child(preview);

		// Native colour picker input
		var pickerLabel = createElement("label", "Custom:");
		pickerLabel.attribute("for", "customColourPicker");
		pickerLabel.style("color", "#ccc");
		pickerLabel.style("font-size", "0.85rem");
		pickerRow.child(pickerLabel);

		var picker = createElement("input");
		picker.id("customColourPicker");
		picker.attribute("type", "color");
		picker.attribute("value", self.selectedColour);
		picker.attribute("aria-label", "Custom colour picker");
		picker.style("width", "36px");
		picker.style("height", "28px");
		picker.style("border", "none");
		picker.style("border-radius", "4px");
		picker.style("cursor", "pointer");
		picker.style("padding", "0");
		picker.style("background", "none");
		pickerRow.child(picker);

		picker.elt.addEventListener("input", function() {
			self.applyColour(this.value);
		});

		// Swatch grid
		var swatchContainer = createDiv();
		swatchContainer.style("display", "grid");
		swatchContainer.style("grid-template-columns", "repeat(4, 1fr)");
		swatchContainer.style("gap", "4px");
		swatchContainer.style("margin-bottom", "14px");
		paletteContainer.child(swatchContainer);

		fill(this.colours[0]);
		stroke(this.colours[0]);

		for (var i = 0; i < this.colours.length; i++) {
			var c = this.colours[i];
			var swatchId = "swatch_" + c.replace("#", "");

			var colourSwatch = createDiv();
			colourSwatch.class("colourSwatches");
			colourSwatch.id(swatchId);
			colourSwatch.attribute("aria-label", c + " color");
			colourSwatch.attribute("tabindex", "0");
			colourSwatch.style("background-color", c);
			colourSwatch.style("border", "2px solid transparent");
			swatchContainer.child(colourSwatch);
			colourSwatch.mouseClicked(colourClick);
		}

		// Highlight the default selected swatch
		self.applyColour(self.selectedColour);

		// Tool options container
		this.createToolOptionsContainer(paletteContainer);
	};

	this.createToolOptionsContainer = function(paletteContainer) {
		var optionsTitle = createDiv("Tool Options");
		optionsTitle.style("color", "#fff");
		optionsTitle.style("font-size", "1.1rem");
		optionsTitle.style("font-weight", "600");
		optionsTitle.style("margin-bottom", "10px");
		optionsTitle.style("text-align", "center");
		optionsTitle.style("border-top", "1px solid #444");
		optionsTitle.style("padding-top", "14px");
		paletteContainer.child(optionsTitle);

		var toolOptionsDiv = createDiv();
		toolOptionsDiv.id("toolOptions");
		toolOptionsDiv.class("toolOptions");
		toolOptionsDiv.style("width", "100%");
		toolOptionsDiv.style("min-height", "60px");
		paletteContainer.child(toolOptionsDiv);

		toolOptionsDiv.html('<div style="color:#ccc;font-size:0.85rem;text-align:center;margin-top:10px;">Select a tool to see options</div>');
	};

	this.loadColours();
}

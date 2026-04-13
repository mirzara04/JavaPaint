function HelperFunctions() {

	var clearButton = select("#clearButton");
	if (clearButton) {
		clearButton.mouseClicked(function() {
			clear(); // or background(255);

			loadPixels();
		});
	} else {
		console.warn("Clear button not found");
	}

	var saveButton = select("#saveImageButton");
	if (saveButton) {
		saveButton.mouseClicked(function() {
		    saveCanvas('myDrawing', 'png');
		});
	} else {
		console.warn("Save button not found");
	}

	var helpButton = select("#helpButton");
	if (helpButton) {
		helpButton.mouseClicked(function() {
			alert("Drawing App Help:\n\n" +
				"Tools:\n" +
				"• Freehand: Draw by dragging the mouse\n" +
				"• Line: Click and drag to draw straight lines\n" +
				"• Spray Can: Click and drag for spray effect\n" +
				"• Mirror Draw: Draw with mirror symmetry\n" +
				"• Scissor: Select, cut and paste circular areas\n\n" +
				"Colors: Click any color on the right to select it\n" +
				"Clear: Clears the entire canvas\n" +
				"Save: Downloads your drawing as PNG");
		});
	} else {
		console.warn("Help button not found");
	}
}

function mouseOnCanvas(c) {
    if (!c) {
        return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    }
    return mouseX >= 0 && mouseX <= c.width && mouseY >= 0 && mouseY <= c.height;
}
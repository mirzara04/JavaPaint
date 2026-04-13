function HelperFunctions() {

	var clearButton = select("#clearButton");
	if (clearButton) {
		clearButton.mouseClicked(function() {
			saveHistory();
			clear();
			background(255);
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
			var modal = document.getElementById("shortcutsModal");
			if (modal) modal.removeAttribute("hidden");
		});
	} else {
		console.warn("Help button not found");
	}

	var closeModal = document.getElementById("closeModal");
	if (closeModal) {
		closeModal.addEventListener("click", function() {
			document.getElementById("shortcutsModal").setAttribute("hidden", "");
		});
	}

	// Close on overlay click
	var modal = document.getElementById("shortcutsModal");
	if (modal) {
		modal.addEventListener("click", function(e) {
			if (e.target === modal) modal.setAttribute("hidden", "");
		});
	}

	// Close on Escape
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") {
			var m = document.getElementById("shortcutsModal");
			if (m) m.setAttribute("hidden", "");
		}
	});
}

function mouseOnCanvas(c) {
    if (!c) {
        return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
    }
    return mouseX >= 0 && mouseX <= c.width && mouseY >= 0 && mouseY <= c.height;
}
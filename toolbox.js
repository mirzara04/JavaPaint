// Container object for storing and managing tools
function Toolbox() {
	var self = this;

	this.tools = [];
	this.selectedTool = null;

	var toolbarItemClick = function() {
		var items = selectAll(".sideBarItem");
		for (var i = 0; i < items.length; i++) {
			items[i].style('border', '0');
		}
		var toolName = this.id().split("sideBarItem")[0];
		self.selectTool(toolName);
		loadPixels();
	};

	var addToolIcon = function(icon, name) {
		var sidebar = select('#sidebar');
		if (!sidebar) {
			console.error("Sidebar not found!");
			return;
		}

		var sideBarItem = createDiv();
		sideBarItem.class('sideBarItem');
		sideBarItem.id(name + "sideBarItem");

		var img = createImg(icon);
		img.style('width', '100%');
		img.style('height', '100%');

		img.elt.onerror = function() {
			// Fallback to text label if image fails to load
			sideBarItem.html(name);
			sideBarItem.style('color', '#fff');
			sideBarItem.style('font-size', '10px');
			sideBarItem.style('text-align', 'center');
		};

		sideBarItem.child(img);
		sideBarItem.parent('sidebar');
		sideBarItem.mouseClicked(toolbarItemClick);
	};

	this.addTool = function(tool) {
		if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
			console.warn("Tool missing name or icon:", tool);
			return;
		}
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name === tool.name) {
				console.warn("Duplicate tool name:", tool.name);
				return;
			}
		}
		this.tools.push(tool);
		addToolIcon(tool.icon, tool.name);
		if (this.selectedTool == null) {
			this.selectTool(tool.name);
		}
	};

	this.selectTool = function(toolName) {
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name == toolName) {
				if (this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool")) {
					this.selectedTool.unselectTool();
				}
				this.selectedTool = this.tools[i];

				var sideBarItemElem = select("#" + toolName + "sideBarItem");
				if (sideBarItemElem) {
					sideBarItemElem.style("border", "2px solid blue");
				} else {
					console.warn("Sidebar item not found for tool:", toolName);
				}

				if (this.selectedTool.hasOwnProperty("populateOptions")) {
					this.selectedTool.populateOptions();
				}
				return;
			}
		}
		console.warn("Tool not found:", toolName);
	};

	this.clearAll = function() {
		this.tools = [];
		this.selectedTool = null;
		var sidebar = select('#sidebar');
		if (sidebar) sidebar.html('');
	};
}

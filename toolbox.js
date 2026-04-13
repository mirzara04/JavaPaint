//container object for storing the tools. Functions to add new tools and select a tool
function Toolbox() {

	var self = this;

	this.tools = [];
	this.selectedTool = null;

	var toolbarItemClick = function() {
		//remove any existing borders
		var items = selectAll(".sideBarItem");
		for (var i = 0; i < items.length; i++) {
			items[i].style('border', '0')
		}

		var toolName = this.id().split("sideBarItem")[0];
		self.selectTool(toolName);

		//call loadPixels to make sure most recent changes are saved to pixel array
		loadPixels();

	}

	//add a new tool icon to the html page
	var addToolIcon = function(icon, name) {
		console.log("Creating tool icon for:", name, "with icon:", icon);
		
		try {
			// Check if sidebar exists
			var sidebar = select('#sidebar');
			if (!sidebar) {
				console.error("Sidebar not found!");
				return;
			}
			console.log("Sidebar found:", sidebar);
			console.log("Sidebar HTML content:", sidebar.html());
			
			// Create the tool item
			var sideBarItem = createDiv();
			if (!sideBarItem) {
				console.error("Failed to create div for tool:", name);
				return;
			}
			sideBarItem.class('sideBarItem');
			sideBarItem.id(name + "sideBarItem");
			
			// Create and add the image with error handling
			var img = createImg(icon);
			if (!img) {
				console.error("Failed to create image for tool:", name);
				return;
			}
			img.style('width', '100%');
			img.style('height', '100%');
			
			// Add error handling for image loading
			img.elt.onerror = function() {
				console.error("Failed to load image for tool:", name, "at path:", icon);
				// Create a fallback text representation
				sideBarItem.html(name);
				sideBarItem.style('color', '#fff');
				sideBarItem.style('font-size', '10px');
				sideBarItem.style('text-align', 'center');
			};
			
			img.elt.onload = function() {
				console.log("Image loaded successfully for tool:", name);
			};
			
			sideBarItem.child(img);
			
			// Add to sidebar and set up click handler
			sideBarItem.parent('sidebar');
			sideBarItem.mouseClicked(toolbarItemClick);
			
			console.log("Tool icon created and added to sidebar for:", name);
			console.log("Sidebar HTML after adding tool:", sidebar.html());
			console.log("Sidebar item element:", sideBarItem);
			
		} catch (error) {
			console.error("Error creating tool icon for:", name, error);
		}
	};

	//add a tool to the tools array
	this.addTool = function(tool) {
		//check that the object tool has an icon and a name
		if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
			console.warn("Tool missing name or icon:", tool);
			return; // prevent adding broken tool
		}
		
		// Check for duplicate tool names
		for (let t of this.tools) {
			if (t.name === tool.name) {
				console.warn("Tool name already exists:", tool.name);
				return;
			}
		}

		this.tools.push(tool);
		addToolIcon(tool.icon, tool.name);
		//if no tool is selected (ie. none have been added so far)
		//make this tool the selected one.
		if (this.selectedTool == null) {
			this.selectTool(tool.name);
		}
	};

	this.selectTool = function(toolName) {
		console.log("Selecting tool:", toolName);
		//search through the tools for one that's name matches
		//toolName
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name == toolName) {
				console.log("Found tool:", toolName, "at index:", i);
				//if the tool has an unselectTool method run it.
				if (this.selectedTool != null && this.selectedTool.hasOwnProperty(
						"unselectTool")) {
					this.selectedTool.unselectTool();
				}
				//select the tool and highlight it on the toolbar
				this.selectedTool = this.tools[i];
				var sideBarItemElem = select("#" + toolName + "sideBarItem");
				console.log("Looking for sidebar item:", "#" + toolName + "sideBarItem");
				if (sideBarItemElem) {
					console.log("Found sidebar item, setting border");
					sideBarItemElem.style("border", "2px solid blue");
				} else {
					console.error("Sidebar item not found for tool:", toolName);
				}

				//if the tool has an options area. Populate it now.
				if (this.selectedTool.hasOwnProperty("populateOptions")) {
					console.log("Calling populateOptions for:", toolName);
					this.selectedTool.populateOptions();
				}
				return; // Exit after finding and selecting the tool
			}
		}
		console.error("Tool not found:", toolName);
		console.log("Available tools:", this.tools.map(t => t.name));
	};
	
	// Add a method to list all tools for debugging
	this.listTools = function() {
		console.log("Total tools in toolbox:", this.tools.length);
		this.tools.forEach((tool, index) => {
			console.log(`Tool ${index}: ${tool.name} (${tool.icon})`);
		});
	};
	
	// Add a method to clear the toolbox completely
	this.clearAll = function() {
		console.log("Clearing all tools from toolbox");
		this.tools = [];
		this.selectedTool = null;
		
		// Clear the sidebar
		var sidebar = select('#sidebar');
		if (sidebar) {
			sidebar.html('');
			console.log("Sidebar cleared");
		}
	};


}
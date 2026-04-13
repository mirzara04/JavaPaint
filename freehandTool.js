function FreehandTool(){ 
    //set an icon and a name for the object 
    this.icon = "assets/freehand.svg";
    this.name = "freehand"; 

    //to smoothly draw we'll draw a line from the previous mouse location 
    //to the current mouse location. The following values store 
    //the locations from the last frame. They are -1 to start with because 
    //we haven't started drawing yet. 
    var previousMouseX = -1; 
    var previousMouseY = -1; 

    this.draw = function(){
        smooth();
        if(!mouseOnCanvas(canvas)){
            return;
        }
        
        // Get brush settings with defaults
        let brushSize = this.brushSizeSlider ? this.brushSizeSlider.value() : 3;
        let opacity = this.opacitySlider ? this.opacitySlider.value() : 255;
        let shape = this.brushShapeSelect ? this.brushShapeSelect.value() : 'Round';
        
        strokeWeight(brushSize);
        strokeCap(shape === 'Round' ? ROUND : SQUARE);

        //if the mouse is pressed 
        if(mouseIsPressed){ 
            //check if they previousX and Y are -1. set them to the current 
            //mouse X and Y if they are. 
            if (previousMouseX == -1){ 
                previousMouseX = mouseX; 
                previousMouseY = mouseY; 
            } 
            //if we already have values for previousX and Y we can draw a line from  
            //there to the current mouse location 
            else{
                // Set color with opacity
                if (typeof colourP !== 'undefined' && colourP.selectedColour) {
                    stroke(red(colourP.selectedColour), green(colourP.selectedColour), blue(colourP.selectedColour), opacity);
                } else {
                    stroke(0, 0, 0, opacity); // Default to black if no color selected
                }

                line(previousMouseX, previousMouseY, mouseX, mouseY); 
                previousMouseX = mouseX; 
                previousMouseY = mouseY; 
            } 
        } 
        //if the user has released the mouse we want to set the previousMouse values  
        //back to -1. 
        else{ 
            previousMouseX = -1; 
            previousMouseY = -1; 
        } 
    }; 

    //This method will be called by this.selectTool() in toolbox.js
    //when this tool is selected
    this.populateOptions = function(){
        var toolOptions = select("#toolOptions");
        if (!toolOptions) toolOptions = select(".toolOptions");
        if (!toolOptions) return;

        // Create the HTML structure for better styling
        toolOptions.html(`
            <div style="color: #fff; margin-bottom: 15px;">
                <strong>Freehand Tool</strong>
            </div>
            
            <div style="margin-bottom: 12px;">
                <label style="color: #fff; font-size: 12px; display: block; margin-bottom: 5px;">
                    Brush Size: <span id="brushSizeValue">3</span>px
                </label>
                <div id="brushSizeSliderContainer" style="margin-bottom: 8px;"></div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <label style="color: #fff; font-size: 12px; display: block; margin-bottom: 5px;">
                    Opacity: <span id="opacityValue">100</span>%
                </label>
                <div id="opacitySliderContainer" style="margin-bottom: 8px;"></div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <label style="color: #fff; font-size: 12px; display: block; margin-bottom: 5px;">
                    Brush Shape:
                </label>
                <div id="brushShapeContainer" style="margin-bottom: 8px;"></div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <div id="brushPreview" style="width: 100%; height: 40px; background: #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #555;">
                    <span style="color: #ccc; font-size: 11px;">Brush Preview</span>
                </div>
            </div>
            
            <div style="font-size: 11px; color: #ccc; text-align: center; line-height: 1.3;">
                Click and drag to draw freehand lines
            </div>
        `);

        // Create brush size slider
        this.brushSizeSlider = createSlider(1, 30, 3);
        this.brushSizeSlider.parent("brushSizeSliderContainer");
        this.brushSizeSlider.style('width', '100%');
        
        // Create opacity slider
        this.opacitySlider = createSlider(10, 255, 255);
        this.opacitySlider.parent("opacitySliderContainer");
        this.opacitySlider.style('width', '100%');

        // Create brush shape selector
        this.brushShapeSelect = createSelect();
        this.brushShapeSelect.option('Round');
        this.brushShapeSelect.option('Square');
        this.brushShapeSelect.parent("brushShapeContainer");
        this.brushShapeSelect.style('width', '100%');
        this.brushShapeSelect.style('background', '#333');
        this.brushShapeSelect.style('color', '#fff');
        this.brushShapeSelect.style('border', '1px solid #555');
        this.brushShapeSelect.style('padding', '4px');

        // Store reference to self for event handlers
        var self = this;

        // Update brush size value display
        this.brushSizeSlider.input(function() {
            var sizeValue = select("#brushSizeValue");
            if (sizeValue) {
                sizeValue.html(self.brushSizeSlider.value());
            }
            self.updateBrushPreview();
        });

        // Update opacity value display
        this.opacitySlider.input(function() {
            var opacityValue = select("#opacityValue");
            if (opacityValue) {
                var percentage = Math.round((self.opacitySlider.value() / 255) * 100);
                opacityValue.html(percentage);
            }
            self.updateBrushPreview();
        });

        // Update preview when shape changes
        this.brushShapeSelect.changed(function() {
            self.updateBrushPreview();
        });

        // Initial preview update
        setTimeout(function() {
            self.updateBrushPreview();
        }, 100);
    };

    // Method to update brush preview
    this.updateBrushPreview = function() {
        var previewDiv = select("#brushPreview");
        if (!previewDiv) return;

        var size = this.brushSizeSlider ? this.brushSizeSlider.value() : 3;
        var opacity = this.opacitySlider ? this.opacitySlider.value() : 255;
        var shape = this.brushShapeSelect ? this.brushShapeSelect.value() : 'Round';
        var opacityPercent = (opacity / 255);

        // Get current color
        var currentColor = '#000000'; // default
        if (typeof colourP !== 'undefined' && colourP.selectedColour) {
            currentColor = colourP.selectedColour;
        }

        // Create preview dot
        var previewSize = Math.min(Math.max(size, 4), 30); // Clamp between 4 and 30 for visibility
        var borderRadius = shape === 'Round' ? '50%' : '0';
        
        previewDiv.html(`
            <div style="
                width: ${previewSize}px;
                height: ${previewSize}px;
                background: ${currentColor};
                opacity: ${opacityPercent};
                border-radius: ${borderRadius};
                border: 1px solid #666;
                display: inline-block;
            "></div>
        `);
    };

    //This method will be called when this tool is unselected
    this.unselectTool = function(){
        var toolOptions = select("#toolOptions");
        if (!toolOptions) toolOptions = select(".toolOptions");
        if (toolOptions) toolOptions.html("");
        
        // Clean up references
        this.brushSizeSlider = null;
        this.opacitySlider = null;
        this.brushShapeSelect = null;
    }; 

    // Add mousePressed method for consistency 
    this.mousePressed = function() { 
        // This method is called when mouse is pressed 
        // No special handling needed for freehand tool 
    }; 

    // Add mouseReleased method for consistency 
    this.mouseReleased = function() { 
        // This method is called when mouse is released 
        // No special handling needed for freehand tool 
    }; 
}
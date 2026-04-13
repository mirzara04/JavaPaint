// Stamp Tool for P5.js Drawing App
function StampTool() {
    this.name = "stampTool";
    this.icon = "assets/stampTool.png"; 
    
    // Tool properties
    this.stampType = 'star'; // 'star', 'cloud', 'vertex'
    this.size = 50; // Size for star and cloud stamps
    this.rotation = 0; // Rotation angle in degrees
    this.vertexCount = 5; // For vertex stamp
    
    // Preview state - removed since we don't want preview
    this.showPreview = false;
    this.previewX = 0;
    this.previewY = 0;
    
    var self = this;
    
    this.draw = function() {
        // Do nothing - we only want stamps on click, not on mouse move
        // This prevents the continuous stamping while moving the cursor
    };
    
    this.mousePressed = function() {
        if (!mouseOnCanvas(canvas)) return;
        
        // Draw the actual stamp only when mouse is clicked
        push();
        stroke(colourP?.selectedColour || 0);
        fill(colourP?.selectedColour || 0);
        strokeWeight(2);
        
        this.drawStamp(mouseX, mouseY, false);
        pop();
        
        // Update pixels for other tools
        loadPixels();
    };
    
    this.mouseReleased = function() {
        // Nothing needed for stamp tool on mouse release
    };
    
    this.drawStamp = function(x, y, isPreview) {
        push();
        translate(x, y);
        rotate(radians(this.rotation));
        
        switch(this.stampType) {
            case 'star':
                this.drawStar(0, 0, this.size, isPreview);
                break;
            case 'cloud':
                this.drawCloud(0, 0, this.size, isPreview);
                break;
            case 'vertex':
                this.drawVertex(0, 0, isPreview);
                break;
        }
        pop();
    };
    
    this.drawStar = function(x, y, size, isPreview) {
        const outerRadius = size;
        const innerRadius = size * 0.5;
        const numPoints = 5;
        
        beginShape();
        for (let i = 0; i < numPoints * 2; i++) {
            const angle = (i * PI) / numPoints;
            const radius = (i % 2 === 0) ? outerRadius : innerRadius;
            const px = x + cos(angle) * radius;
            const py = y + sin(angle) * radius;
            vertex(px, py);
        }
        endShape(CLOSE);
    };
    
    this.drawCloud = function(x, y, size, isPreview) {
        const cloudSize = size;
        const circleSize = cloudSize * 0.3;
        
        // Draw multiple circles to create cloud shape
        const circles = [
            {x: x - cloudSize * 0.3, y: y, r: circleSize * 0.8},
            {x: x + cloudSize * 0.3, y: y, r: circleSize * 0.8},
            {x: x - cloudSize * 0.15, y: y - cloudSize * 0.2, r: circleSize},
            {x: x + cloudSize * 0.15, y: y - cloudSize * 0.2, r: circleSize},
            {x: x, y: y + cloudSize * 0.1, r: circleSize * 0.9},
            {x: x - cloudSize * 0.4, y: y + cloudSize * 0.15, r: circleSize * 0.6},
            {x: x + cloudSize * 0.4, y: y + cloudSize * 0.15, r: circleSize * 0.6}
        ];
        
        for (let circle of circles) {
            ellipse(circle.x, circle.y, circle.r * 2);
        }
    };
    
    this.drawVertex = function(x, y, isPreview) {
        const size = 30; // Fixed size for vertex stamp
        const spacing = size;
        
        // Draw a pattern of vertices
        for (let i = 0; i < this.vertexCount; i++) {
            const angle = (i * TWO_PI) / this.vertexCount;
            const px = x + cos(angle) * spacing;
            const py = y + sin(angle) * spacing;
            
            push();
            noStroke();
            ellipse(px, py, 8);
            pop();
            
            if (i < this.vertexCount - 1) {
                const nextAngle = ((i + 1) * TWO_PI) / this.vertexCount;
                const nextX = x + cos(nextAngle) * spacing;
                const nextY = y + sin(nextAngle) * spacing;
                line(px, py, nextX, nextY);
            } else {
                const firstX = x + cos(0) * spacing;
                const firstY = y + sin(0) * spacing;
                line(px, py, firstX, firstY);
            }
        }
        
        // Center point
        ellipse(x, y, 6);
    };
    
    this.populateOptions = function() {
        console.log("Populating stamp tool options");
        const toolOptions = select("#toolOptions");
        if (!toolOptions) {
            console.warn("Tool options element not found for stamp tool");
            return;
        }
        
        let sizeControlsDisplay = this.stampType === 'vertex' ? 'display: none;' : '';
        let vertexControlsDisplay = this.stampType === 'vertex' ? '' : 'display: none;';
        
        let optionsHTML = `
            <div style="color: #ccc; margin-bottom: 15px; text-align: center;">
                Stamp Tool - Click to place stamps
            </div>
            
            <label for="stampType">Stamp Type:</label>
            <select id="stampType">
                <option value="star" ${this.stampType === 'star' ? 'selected' : ''}>Star</option>
                <option value="cloud" ${this.stampType === 'cloud' ? 'selected' : ''}>Cloud</option>
                <option value="vertex" ${this.stampType === 'vertex' ? 'selected' : ''}>Vertex</option>
            </select>
            
            <div id="sizeControls" style="${sizeControlsDisplay}">
                <label for="stampSize">Size: ${this.size}px</label>
                <input type="range" id="stampSize" min="20" max="100" value="${this.size}">
            </div>
            
            <label for="stampRotation">Rotation: ${this.rotation}°</label>
            <input type="range" id="stampRotation" min="0" max="360" value="${this.rotation}">
            
            <div id="vertexControls" style="${vertexControlsDisplay}">
                <label for="vertexCount">Vertex Count: ${this.vertexCount}</label>
                <input type="range" id="vertexCount" min="3" max="12" value="${this.vertexCount}">
            </div>
            
            <div style="color: #aaa; font-size: 0.8rem; margin-top: 10px; text-align: center;">
                Click on canvas to place stamps. Use rotation keys: R (rotate +15°), Shift+R (rotate -15°)
            </div>
        `;
        
        toolOptions.html(optionsHTML);
        
        this.setupEventListeners();
        
        window.currentStampTool = this;
    };
    
    this.unselectTool = function() {
        console.log("Unselecting stamp tool");
        const toolOptions = select("#toolOptions");
        if (toolOptions) {
            toolOptions.html("");
        }
        window.currentStampTool = null;
        this.showPreview = false;
    };
    
    this.setupEventListeners = function() {
        const stampTypeSelect = select("#stampType");
        if (stampTypeSelect) {
            stampTypeSelect.changed(function() {
                self.setStampType(this.value());
                self.updateUI();
            });
        }
        
        const stampSizeSlider = select("#stampSize");
        if (stampSizeSlider) {
            stampSizeSlider.input(function() {
                self.setSize(this.value());
                self.updateSizeLabel();
            });
        }
        
        const stampRotationSlider = select("#stampRotation");
        if (stampRotationSlider) {
            stampRotationSlider.input(function() {
                self.setRotation(this.value());
                self.updateRotationLabel();
            });
        }
        
        const vertexCountSlider = select("#vertexCount");
        if (vertexCountSlider) {
            vertexCountSlider.input(function() {
                self.setVertexCount(this.value());
                self.updateVertexCountLabel();
            });
        }
    };
    
    this.updateUI = function() {
        const sizeControls = select("#sizeControls");
        const vertexControls = select("#vertexControls");
        
        if (sizeControls) {
            sizeControls.style('display', this.stampType === 'vertex' ? 'none' : 'block');
        }
        if (vertexControls) {
            vertexControls.style('display', this.stampType === 'vertex' ? 'block' : 'none');
        }
    };
    
    this.updateSizeLabel = function() {
        const label = select("label[for='stampSize']");
        if (label) {
            label.html(`Size: ${this.size}px`);
        }
    };
    
    this.updateRotationLabel = function() {
        const label = select("label[for='stampRotation']");
        if (label) {
            label.html(`Rotation: ${this.rotation}°`);
        }
    };
    
    this.updateVertexCountLabel = function() {
        const label = select("label[for='vertexCount']");
        if (label) {
            label.html(`Vertex Count: ${this.vertexCount}`);
        }
    };
    
    this.keyPressed = function() {
        if (key === 'r' || key === 'R') {
            if (keyIsDown(SHIFT)) {
                this.rotation -= 15;
            } else {
                this.rotation += 15;
            }
            
            // Keep rotation between 0-360
            if (this.rotation < 0) this.rotation += 360;
            if (this.rotation >= 360) this.rotation -= 360;
            
            // Update UI if options are visible
            const rotationSlider = select("#stampRotation");
            if (rotationSlider) {
                rotationSlider.value(this.rotation);
                this.updateRotationLabel();
            }
        }
    };
    
    // Setter methods
    this.setStampType = function(type) {
        this.stampType = type;
        console.log("Stamp type changed to:", type);
    };
    
    this.setSize = function(size) {
        this.size = parseInt(size);
    };
    
    this.setRotation = function(rotation) {
        this.rotation = parseInt(rotation);
    };
    
    this.setVertexCount = function(count) {
        this.vertexCount = parseInt(count);
    };
}
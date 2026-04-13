// Distortion Tool - matches your app's tool structure
function DistortionTool() {
    var self = this;
    
    // Tool properties (matching your pattern)
    this.name = "distortionTool";
    this.icon = "assets/distortionTool.png"; // You'll need to add this icon
    
    // Tool settings
    this.brushSize = 50;
    this.strength = 0.5; // 0-1
    this.mode = 'push'; // 'push', 'pull', 'swirl', 'pinch', 'bulge'
    this.swirlAngle = Math.PI / 4;
    
    // State variables
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.startX = 0;
    this.startY = 0;
    
    // Backup canvas for distortion operations
    this.backupCanvas = null;
    this.backupCtx = null;
    this.originalPixels = null;
    
    // Initialize backup canvas
    this.initBackupCanvas = function() {
        if (!this.backupCanvas) {
            this.backupCanvas = document.createElement('canvas');
            this.backupCtx = this.backupCanvas.getContext('2d');
        }
        this.backupCanvas.width = width;
        this.backupCanvas.height = height;
    };
    
    // Main draw function (called every frame)
    this.draw = function() {
        if (!mouseOnCanvas(canvas)) return;
        
        // Show brush preview
        if (!this.isDragging) {
            push();
            stroke(colourP?.selectedColour || 0);
            strokeWeight(2);
            noFill();
            ellipse(mouseX, mouseY, this.brushSize * 2);
            pop();
        } else {
            // Show distortion preview while dragging
            this.showDistortionPreview();
        }
    };
    
    // Mouse pressed handler
    this.mousePressed = function() {
        if (!mouseOnCanvas(canvas)) return;
        
        this.initBackupCanvas();
        this.isDragging = true;
        this.startX = mouseX;
        this.startY = mouseY;
        this.lastX = mouseX;
        this.lastY = mouseY;
        
        // Backup current canvas state using p5.js
        loadPixels();
        this.originalPixels = new Uint8ClampedArray(pixels);
        
        // Also backup to backup canvas
        var imageData = canvas.getContext('2d').getImageData(0, 0, width, height);
        this.backupCtx.putImageData(imageData, 0, 0);
    };
    
    // Mouse dragged handler - NEW!
    this.mouseDragged = function() {
        if (!this.isDragging || !mouseOnCanvas(canvas)) return;
        
        // Apply distortion incrementally
        this.applyDistortion(mouseX, mouseY);
        
        // Update last position
        this.lastX = mouseX;
        this.lastY = mouseY;
    };
    
    // Mouse released handler
    this.mouseReleased = function() {
        if (this.isDragging) {
            this.isDragging = false;
            // Final distortion application
            if (mouseOnCanvas(canvas)) {
                this.applyDistortion(mouseX, mouseY);
            }
            loadPixels(); // Update p5.js pixel array
        }
    };
    
    // Show real-time distortion preview
    this.showDistortionPreview = function() {
        // Draw a preview circle to show the distortion area
        push();
        stroke(255, 0, 0, 150);
        strokeWeight(2);
        noFill();
        ellipse(mouseX, mouseY, this.brushSize * 2);
        
        // Draw direction indicator based on mode
        if (this.mode === 'push') {
            // Show outward arrows for push effect
            stroke(255, 0, 0, 200);
            for (var i = 0; i < 8; i++) {
                var angle = (i * Math.PI * 2) / 8;
                var x1 = mouseX + Math.cos(angle) * (this.brushSize * 0.3);
                var y1 = mouseY + Math.sin(angle) * (this.brushSize * 0.3);
                var x2 = mouseX + Math.cos(angle) * (this.brushSize * 0.6);
                var y2 = mouseY + Math.sin(angle) * (this.brushSize * 0.6);
                line(x1, y1, x2, y2);
            }
        } else if (this.mode === 'pull') {
            // Show inward arrows for pull effect
            stroke(0, 255, 0, 200);
            for (var i = 0; i < 8; i++) {
                var angle = (i * Math.PI * 2) / 8;
                var x1 = mouseX + Math.cos(angle) * (this.brushSize * 0.6);
                var y1 = mouseY + Math.sin(angle) * (this.brushSize * 0.6);
                var x2 = mouseX + Math.cos(angle) * (this.brushSize * 0.3);
                var y2 = mouseY + Math.sin(angle) * (this.brushSize * 0.3);
                line(x1, y1, x2, y2);
            }
        } else if (this.mode === 'bulge') {
            // Show expanding circles for bulge effect
            stroke(0, 0, 255, 200);
            for (var i = 1; i <= 3; i++) {
                var size = (this.brushSize * i) / 3;
                ellipse(mouseX, mouseY, size);
            }
        } else if (this.mode === 'swirl') {
            // Show spiral for swirl effect
            stroke(255, 255, 0, 200);
            var spiralPoints = [];
            for (var i = 0; i < 20; i++) {
                var angle = i * 0.5;
                var radius = i * 2;
                var x = mouseX + Math.cos(angle) * radius;
                var y = mouseY + Math.sin(angle) * radius;
                spiralPoints.push({x: x, y: y});
            }
            for (var i = 1; i < spiralPoints.length; i++) {
                line(spiralPoints[i-1].x, spiralPoints[i-1].y, spiralPoints[i].x, spiralPoints[i].y);
            }
        } else if (this.mode === 'pinch') {
            // Show converging lines for pinch effect
            stroke(255, 0, 255, 200);
            for (var i = 0; i < 8; i++) {
                var angle = (i * Math.PI * 2) / 8;
                var x1 = mouseX + Math.cos(angle) * (this.brushSize * 0.8);
                var y1 = mouseY + Math.sin(angle) * (this.brushSize * 0.8);
                var x2 = mouseX + Math.cos(angle) * (this.brushSize * 0.2);
                var y2 = mouseY + Math.sin(angle) * (this.brushSize * 0.2);
                line(x1, y1, x2, y2);
            }
        }
        pop();
    };
    
    // Apply distortion effect - OPTIMIZED for better performance
    this.applyDistortion = function(x, y) {
        if (!this.backupCanvas || !this.backupCtx || !this.originalPixels) return;
        
        var ctx = canvas.getContext('2d');
        var sourceData = this.backupCtx.getImageData(0, 0, width, height);
        var targetData = ctx.createImageData(width, height);
        
        // Copy original data
        for (var i = 0; i < sourceData.data.length; i++) {
            targetData.data[i] = sourceData.data[i];
        }
        
        var radius = this.brushSize;
        var strength = this.strength;
        
        // Apply distortion based on mode with integrated effects
        switch (this.mode) {
            case 'push':
                this.applyPushDistortion(sourceData, targetData, x, y, radius, strength);
                break;
            case 'pull':
                this.applyPullDistortion(sourceData, targetData, x, y, radius, strength);
                break;
            case 'swirl':
                this.applySwirlDistortion(sourceData, targetData, x, y, radius, strength);
                break;
            case 'pinch':
                this.applyPinchDistortion(sourceData, targetData, x, y, radius, strength);
                break;
            case 'bulge':
                this.applyBulgeDistortion(sourceData, targetData, x, y, radius, strength);
                break;
        }
        
        // Apply ripple and noise effects in a single pass for better performance
        this.applySecondaryEffects(targetData, x, y, radius, strength);
        
        ctx.putImageData(targetData, 0, 0);
        
        // Update p5.js pixels for consistency
        var newImageData = ctx.getImageData(0, 0, width, height);
        for (var i = 0; i < newImageData.data.length; i++) {
            pixels[i] = newImageData.data[i];
        }
        updatePixels();
    };
    
    // Combined secondary effects for better performance
    this.applySecondaryEffects = function(targetData, centerX, centerY, radius, strength) {
        var rippleStrength = strength * 0.5;
        var noiseStrength = strength * 0.2;
        
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius && distance > 0) {
                    var factor = (radius - distance) / radius;
                    var angle = Math.atan2(dy, dx);
                    
                    // Calculate ripple offset
                    var rippleOffset = 0;
                    if (this.mode === 'push') {
                        rippleOffset = Math.sin(distance * 0.15) * rippleStrength * 15;
                    } else if (this.mode === 'pull') {
                        rippleOffset = Math.cos(distance * 0.1) * rippleStrength * 12;
                    } else if (this.mode === 'swirl') {
                        rippleOffset = Math.sin(angle * 3 + distance * 0.1) * rippleStrength * 18;
                    } else if (this.mode === 'pinch') {
                        rippleOffset = Math.sin(distance * 0.2) * Math.cos(angle * 2) * rippleStrength * 10;
                    } else if (this.mode === 'bulge') {
                        rippleOffset = Math.sin(distance * 0.25) * rippleStrength * 20;
                    }
                    
                    // Calculate noise offset
                    var noiseOffset = 0;
                    if (this.mode === 'push') {
                        noiseOffset = (Math.random() - 0.5) * noiseStrength * 8;
                    } else if (this.mode === 'pull') {
                        noiseOffset = Math.sin(distance * 0.3) * noiseStrength * 6;
                    } else if (this.mode === 'swirl') {
                        noiseOffset = Math.sin(angle * 5 + distance * 0.2) * noiseStrength * 10;
                    } else if (this.mode === 'pinch') {
                        noiseOffset = Math.sin(px * 0.1) * Math.cos(py * 0.1) * noiseStrength * 5;
                    } else if (this.mode === 'bulge') {
                        noiseOffset = Math.sin(distance * 0.4) * noiseStrength * 12;
                    }
                    
                    // Apply combined offset
                    var totalOffsetX = rippleOffset + noiseOffset;
                    var totalOffsetY = rippleOffset + noiseOffset;
                    
                    var sourceX = Math.round(px + totalOffsetX);
                    var sourceY = Math.round(py + totalOffsetY);
                    
                    this.copyPixel(targetData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    

    
    // Push distortion effect - COMPLETELY REWRITTEN for dramatic effect
    this.applyPushDistortion = function(sourceData, targetData, centerX, centerY, radius, strength) {
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius && distance > 0) {
                    // Create a strong outward push effect - NOT circular!
                    var factor = (radius - distance) / radius;
                    var pushForce = factor * factor * strength * 80; // Much stronger force
                    
                    // Create directional push (not just radial)
                    var angle = Math.atan2(dy, dx);
                    var directionalForce = Math.sin(angle * 3) * pushForce * 0.5; // Add variation
                    
                    var sourceX = Math.round(px - Math.cos(angle) * pushForce + directionalForce);
                    var sourceY = Math.round(py - Math.sin(angle) * pushForce + directionalForce);
                    
                    this.copyPixel(sourceData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    
    // Pull distortion effect - COMPLETELY REWRITTEN for dramatic effect
    this.applyPullDistortion = function(sourceData, targetData, centerX, centerY, radius, strength) {
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius && distance > 0) {
                    // Create a strong inward pull effect - NOT circular!
                    var factor = (radius - distance) / radius;
                    var pullForce = factor * factor * strength * 80; // Much stronger force
                    
                    // Create directional pull with spiral effect
                    var angle = Math.atan2(dy, dx);
                    var spiralEffect = Math.cos(angle * 4) * pullForce * 0.3; // Add spiral variation
                    
                    var sourceX = Math.round(px + Math.cos(angle) * pullForce + spiralEffect);
                    var sourceY = Math.round(py + Math.sin(angle) * pullForce + spiralEffect);
                    
                    this.copyPixel(sourceData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    
    // Swirl distortion effect - COMPLETELY REWRITTEN for dramatic effect
    this.applySwirlDistortion = function(sourceData, targetData, centerX, centerY, radius, strength) {
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius) {
                    // Create a strong swirling effect - NOT circular!
                    var factor = (radius - distance) / radius;
                    var swirlIntensity = factor * strength * 5.0; // Much stronger rotation
                    
                    // Create complex spiral rotation
                    var baseAngle = Math.atan2(dy, dx);
                    var rotationAngle = swirlIntensity * Math.PI * 2; // Multiple rotations
                    var spiralAngle = baseAngle + rotationAngle + (distance * 0.1); // Distance-based variation
                    
                    var newDistance = distance * (1 + Math.sin(swirlIntensity) * 0.3); // Vary distance too
                    
                    var sourceX = Math.round(centerX + Math.cos(spiralAngle) * newDistance);
                    var sourceY = Math.round(centerY + Math.sin(spiralAngle) * newDistance);
                    
                    this.copyPixel(sourceData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    
    // Pinch distortion effect - COMPLETELY REWRITTEN for dramatic effect
    this.applyPinchDistortion = function(sourceData, targetData, centerX, centerY, radius, strength) {
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius && distance > 0) {
                    // Create a strong pinching effect - NOT circular!
                    var factor = (radius - distance) / radius;
                    var pinchAmount = factor * strength * 4.0; // Much stronger pinch
                    
                    // Create directional pinch (squeeze horizontally and vertically)
                    var angle = Math.atan2(dy, dx);
                    var newDistance = distance * (1 + pinchAmount);
                    var horizontalPinch = Math.cos(angle) * pinchAmount * distance * 2;
                    var verticalPinch = Math.sin(angle) * pinchAmount * distance * 2;
                    
                    var sourceX = Math.round(centerX + Math.cos(angle) * newDistance + horizontalPinch);
                    var sourceY = Math.round(centerY + Math.sin(angle) * newDistance + verticalPinch);
                    
                    this.copyPixel(sourceData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    
    // Bulge distortion effect - COMPLETELY REWRITTEN for dramatic effect
    this.applyBulgeDistortion = function(sourceData, targetData, centerX, centerY, radius, strength) {
        for (var px = Math.max(0, centerX - radius); px < Math.min(width, centerX + radius); px++) {
            for (var py = Math.max(0, centerY - radius); py < Math.min(height, centerY + radius); py++) {
                var dx = px - centerX;
                var dy = py - centerY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < radius && distance > 0) {
                    // Create a strong bulging effect - NOT circular!
                    var factor = (radius - distance) / radius;
                    var bulgeAmount = factor * strength * 3.0; // Much stronger bulge
                    
                    // Create lens-like distortion (not just radial expansion)
                    var angle = Math.atan2(dy, dx);
                    var lensEffect = Math.sin(distance * 0.2) * bulgeAmount * 20; // Add lens ripple
                    var newDistance = distance * (1 - bulgeAmount) + lensEffect;
                    
                    var sourceX = Math.round(centerX + Math.cos(angle) * newDistance);
                    var sourceY = Math.round(centerY + Math.sin(angle) * newDistance);
                    
                    this.copyPixel(sourceData, targetData, sourceX, sourceY, px, py);
                }
            }
        }
    };
    
    // Copy pixel helper function - IMPROVED with better bounds checking
    this.copyPixel = function(sourceData, targetData, sourceX, sourceY, targetX, targetY) {
        // Check source bounds
        if (sourceX < 0 || sourceX >= width || sourceY < 0 || sourceY >= height) {
            // If source is out of bounds, use a default color or skip
            return;
        }
        
        // Check target bounds
        if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
            return;
        }
        
        var sourceIndex = (sourceY * width + sourceX) * 4;
        var targetIndex = (targetY * width + targetX) * 4;
        
        // Ensure indices are within bounds
        if (sourceIndex >= 0 && sourceIndex < sourceData.data.length - 3 &&
            targetIndex >= 0 && targetIndex < targetData.data.length - 3) {
            
            targetData.data[targetIndex] = sourceData.data[sourceIndex];         // R
            targetData.data[targetIndex + 1] = sourceData.data[sourceIndex + 1]; // G
            targetData.data[targetIndex + 2] = sourceData.data[sourceIndex + 2]; // B
            targetData.data[targetIndex + 3] = sourceData.data[sourceIndex + 3]; // A
        }
    };
    
    // Populate tool options (matches your pattern)
    this.populateOptions = function() {
        var toolOptions = select("#toolOptions");
        if (!toolOptions) {
            console.warn("Tool options element not found for distortion tool");
            return;
        }
        
        var html = '<div style="color: #ccc; margin-bottom: 15px;">Distortion Tool - Click and drag to distort the image</div>';
        
        // Brush size slider
        html += '<label>Brush Size:</label>';
        html += '<input type="range" id="distortionBrushSize" min="20" max="150" value="' + this.brushSize + '" style="width: 100%; margin-bottom: 10px;">';
        html += '<div id="brushSizeValue" style="color: #aaa; font-size: 0.8rem; margin-bottom: 10px;">' + this.brushSize + 'px</div>';
        
        // Strength slider
        html += '<label>Strength:</label>';
        html += '<input type="range" id="distortionStrength" min="0" max="1" step="0.1" value="' + this.strength + '" style="width: 100%; margin-bottom: 10px;">';
        html += '<div id="strengthValue" style="color: #aaa; font-size: 0.8rem; margin-bottom: 10px;">' + (this.strength * 100) + '%</div>';
        
        // Mode selection
        html += '<label>Mode:</label>';
        html += '<select id="distortionMode" style="width: 100%; margin-bottom: 10px; padding: 5px; border-radius: 4px; border: 1px solid #555; background: #333; color: #fff;">';
        html += '<option value="push"' + (this.mode === 'push' ? ' selected' : '') + '>Push (Push pixels outward)</option>';
        html += '<option value="pull"' + (this.mode === 'pull' ? ' selected' : '') + '>Pull (Pull pixels inward)</option>';
        html += '<option value="swirl"' + (this.mode === 'swirl' ? ' selected' : '') + '>Swirl (Rotate pixels)</option>';
        html += '<option value="pinch"' + (this.mode === 'pinch' ? ' selected' : '') + '>Pinch (Squeeze pixels)</option>';
        html += '<option value="bulge"' + (this.mode === 'bulge' ? ' selected' : '') + '>Bulge (Expand pixels)</option>';
        html += '</select>';
        
        toolOptions.html(html);
        
        // Add event listeners
        var brushSizeSlider = select("#distortionBrushSize");
        if (brushSizeSlider) {
            brushSizeSlider.input(function() {
                self.brushSize = parseInt(this.value());
                var valueDisplay = select("#brushSizeValue");
                if (valueDisplay) valueDisplay.html(self.brushSize + 'px');
            });
        }
        
        var strengthSlider = select("#distortionStrength");
        if (strengthSlider) {
            strengthSlider.input(function() {
                self.strength = parseFloat(this.value());
                var valueDisplay = select("#strengthValue");
                if (valueDisplay) valueDisplay.html((self.strength * 100) + '%');
            });
        }
        
        var modeSelect = select("#distortionMode");
        if (modeSelect) {
            modeSelect.changed(function() {
                self.mode = this.value();
                console.log("Distortion mode changed to:", self.mode);
            });
        }
    };
    
    // Clear options when tool is unselected (matches your pattern)
    this.unselectTool = function() {
        var toolOptions = select("#toolOptions");
        if (toolOptions) {
            toolOptions.html("");
        }
        this.isDragging = false;
        this.originalPixels = null;
    };
}
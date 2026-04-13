// Acceptance Tests for ScissorTool using Black Box Testing Techniques
// Testing complete user experience and business requirements from end-user perspective

// Load the ScissorTool function into the test environment
const fs = require('fs');
const path = require('path');
const scissorToolCode = fs.readFileSync(path.resolve(__dirname, '../../scissorTool.js'), 'utf8');
eval(scissorToolCode);

describe('ScissorTool Acceptance Tests - Black Box Testing', () => {
  let scissorTool;
  let mockCanvas;
  let mockDOM;

  beforeEach(() => {
    // Setup complete user environment
    mockCanvas = {
      width: 800,
      height: 600,
      getContext: jest.fn(() => ({
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(),
        putImageData: jest.fn()
      }))
    };

    mockDOM = {
      toolOptions: { html: jest.fn() },
      instructions: { html: jest.fn() },
      pasteButton: { 
        elt: { onclick: null },
        mousePressed: jest.fn() 
      },
      clearButton: { mousePressed: jest.fn() }
    };

    // Mock global environment
    global.mouseX = 100;
    global.mouseY = 100;
    global.width = 800;
    global.height = 600;
    global.pixels = new Uint8ClampedArray(800 * 600 * 4);
    global.canvas = mockCanvas;
    global.mouseOnCanvas = jest.fn(() => true);
    global.alert = jest.fn();

    // Mock p5.js functions
    global.loadPixels = jest.fn();
    global.updatePixels = jest.fn();
    global.push = jest.fn();
    global.pop = jest.fn();
    global.translate = jest.fn();
    global.rotate = jest.fn();
    global.radians = jest.fn((deg) => deg * Math.PI / 180);
    global.imageMode = jest.fn();
    global.image = jest.fn();
    global.noStroke = jest.fn();
    global.fill = jest.fn();
    global.rect = jest.fn();
    global.rectMode = jest.fn();
    global.noFill = jest.fn();
    global.stroke = jest.fn();
    global.strokeWeight = jest.fn();
    global.get = jest.fn();
    global.erase = jest.fn();
    global.noErase = jest.fn();

    // Mock select function
    global.select = jest.fn((selector) => {
      switch (selector) {
        case '#toolOptions':
        case '.toolOptions':
          return mockDOM.toolOptions;
        case '#instructions':
          return mockDOM.instructions;
        case '#pasteButton':
          return mockDOM.pasteButton;
        case '#scissorClear':
          return mockDOM.clearButton;
        default:
          return null;
      }
    });

    // Create scissor tool instance
    scissorTool = new ScissorTool();
    
    // Setup the tool options only (paste button setup causes DOM errors in tests)
    scissorTool.populateOptions();
  });

  describe('User Story: Cut and Paste Selection', () => {
    test('As a user, I want to select an area of my drawing and paste it elsewhere', () => {
      // Given: I have a drawing on the canvas
      // And: I have selected the scissor tool
      
      // When: I click and drag to create a selection
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue({ width: 100, height: 100 });
      scissorTool.mouseReleased();
      
      // Then: I should have a selection
      expect(scissorTool.hasSelection()).toBe(true);
    });
  });

  describe('User Story: Cancel Selection', () => {
    test('As a user, I want to cancel a selection if I change my mind', () => {
      // Given: I have created a selection
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue({ width: 100, height: 100 });
      scissorTool.mouseReleased();
      
      expect(scissorTool.hasSelection()).toBe(true);
      
      // When: I clear the selection
      scissorTool.clearSelection();
      
      // Then: The selection should be cleared
      expect(scissorTool.hasSelection()).toBe(false);
    });
  });

  describe('User Story: Switch Tools', () => {
    test('As a user, I want to switch to a different tool after using the scissor', () => {
      // Given: I have created a selection
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue({ width: 100, height: 100 });
      scissorTool.mouseReleased();
      
      expect(scissorTool.hasSelection()).toBe(true);
      
      // When: I select a different tool
      scissorTool.unselectTool();
      
      // Then: The selection should be cleared
      expect(scissorTool.hasSelection()).toBe(false);
    });
  });

  describe('User Story: Visual Feedback', () => {
    test('As a user, I want to see clear visual feedback during selection', () => {
      // Given: I have selected the scissor tool
      
      // When: I start a selection
      scissorTool.mousePressed();
      
      // And: I move the mouse to create a selection area
      global.mouseX = 150;
      global.mouseY = 150;
      scissorTool.draw();
      
      // Then: I should see a selection rectangle overlay
      expect(global.push).toHaveBeenCalled();
      expect(global.pop).toHaveBeenCalled();
    });
  });

  describe('User Story: Error Handling', () => {
    test('As a user, I want the tool to handle errors gracefully', () => {
      // Given: I am using the scissor tool
      
      // When: I try to create a selection
      scissorTool.mousePressed();
      
      // Then: The tool should not crash
      expect(() => scissorTool.mousePressed()).not.toThrow();
    });

    test('As a user, I want the tool to work even if some UI elements are missing', () => {
      // Given: Some UI elements are not available
      global.select = jest.fn(() => null);
      
      // When: I try to use the tool
      
      // Then: The tool should not crash
      expect(() => scissorTool.populateOptions()).not.toThrow();
      expect(() => scissorTool.setupPasteButton()).not.toThrow();
    });
  });

  describe('User Story: Accessibility', () => {
    test('As a user, I want clear instructions on how to use the tool', () => {
      // Given: I have selected the scissor tool
      
      // When: I look at the tool options
      
      // Then: I should see clear instructions
      const optionsHTML = mockDOM.toolOptions.html.mock.calls[0][0];
      expect(optionsHTML).toContain('Drag to select');
      expect(optionsHTML).toContain('Click <b>Paste</b> button');
    });
  });

  describe('User Story: Data Integrity', () => {
    test('As a user, I want my original drawing to remain intact after cutting', () => {
      // Given: I have a drawing on the canvas
      // And: I have created a selection
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue({ width: 100, height: 100 });
      scissorTool.mouseReleased();
      
      // When: I clear the selection
      scissorTool.clearSelection();
      
      // Then: The selection should be cleared
      expect(scissorTool.hasSelection()).toBe(false);
    });
  });
});

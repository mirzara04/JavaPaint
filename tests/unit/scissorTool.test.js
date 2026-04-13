// Unit Tests for ScissorTool using White Box Testing Techniques
// Testing internal logic, branches, paths, and conditions

// Load the ScissorTool function into the test environment
const fs = require('fs');
const path = require('path');
const scissorToolCode = fs.readFileSync(path.resolve(__dirname, '../../scissorTool.js'), 'utf8');
eval(scissorToolCode);

describe('ScissorTool - White Box Testing', () => {
  let scissorTool;
  let mockImage;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock image for testing
    mockImage = {
      width: 100,
      height: 100,
      pixels: new Uint8ClampedArray(100 * 100 * 4)
    };

    // Mock global p5 functions
    global.mouseX = 100;
    global.mouseY = 100;
    global.width = 800;
    global.height = 600;
    global.pixels = new Uint8ClampedArray(800 * 600 * 4);
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
    global.canvas = {
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
    global.mouseOnCanvas = jest.fn(() => true);
    global.alert = jest.fn();

    // Mock select function
    global.select = jest.fn((selector) => {
      switch (selector) {
        case '#toolOptions':
        case '.toolOptions':
          return { html: jest.fn() };
        case '#instructions':
          return { html: jest.fn() };
        case '#pasteButton':
          return { 
            elt: { onclick: null },
            mousePressed: jest.fn() 
          };
        case '#scissorClear':
          return { mousePressed: jest.fn() };
        default:
          return null;
      }
    });

    // Create scissor tool instance
    scissorTool = new ScissorTool();
    
    // Setup the tool options only (paste button setup causes DOM errors in tests)
    scissorTool.populateOptions();
  });

  describe('Basic Functionality Tests', () => {
    test('should initialize with correct default state', () => {
      expect(scissorTool.hasSelection()).toBe(false);
      expect(scissorTool.isPasting()).toBe(false);
      expect(scissorTool.getRotation()).toBe(0);
    });

    test('should handle mouse press to start selection', () => {
      global.mouseX = 100;
      global.mouseY = 100;
      
      scissorTool.mousePressed();
      
      expect(global.loadPixels).toHaveBeenCalled();
    });

    test('should handle mouse release to complete selection', () => {
      // Start selection
      global.mouseX = 100;
      global.mouseY = 100;
      scissorTool.mousePressed();
      
      // Complete selection
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue(mockImage);
      scissorTool.mouseReleased();
      
      expect(scissorTool.hasSelection()).toBe(true);
    });

    test('should set rotation correctly', () => {
      scissorTool.setRotation(45);
      expect(scissorTool.getRotation()).toBe(45);
    });

    test('should clear selection', () => {
      // Create selection first
      global.mouseX = 100;
      global.mouseY = 100;
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue(mockImage);
      scissorTool.mouseReleased();
      
      expect(scissorTool.hasSelection()).toBe(true);
      
      scissorTool.clearSelection();
      
      expect(scissorTool.hasSelection()).toBe(false);
    });

    test('should unselect tool', () => {
      // Create selection first
      global.mouseX = 100;
      global.mouseY = 100;
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue(mockImage);
      scissorTool.mouseReleased();
      
      expect(scissorTool.hasSelection()).toBe(true);
      
      scissorTool.unselectTool();
      
      expect(scissorTool.hasSelection()).toBe(false);
    });

    test('should start paste preview', () => {
      // Create selection first
      global.mouseX = 100;
      global.mouseY = 100;
      scissorTool.mousePressed();
      global.mouseX = 200;
      global.mouseY = 200;
      global.get.mockReturnValue(mockImage);
      scissorTool.mouseReleased();
      
      scissorTool.startPastePreview();
      
      expect(scissorTool.isPasting()).toBe(true);
    });




  });

  describe('Error Handling Tests', () => {
    test('should handle missing DOM elements gracefully', () => {
      global.select = jest.fn(() => null);
      
      expect(() => scissorTool.populateOptions()).not.toThrow();
      expect(() => scissorTool.setupPasteButton()).not.toThrow();
    });
  });
});

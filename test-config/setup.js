// Polyfill for TextEncoder/TextDecoder (Node.js compatibility)
global.TextEncoder = require('text-encoding').TextEncoder;
global.TextDecoder = require('text-encoding').TextDecoder;

// Note: jsdom environment is already set up by Jest, no need for jsdom-global

// Mock p5.js constants
global.CORNER = 'corner';
global.CORNERS = 'corners';
global.RADIUS = 'radius';
global.CENTER = 'center';
global.PIE = 'pie';
global.OPEN = 'open';
global.CHORD = 'chord';
global.PROJECT = 'project';
global.SQUARE = 'square';
global.ROUND = 'round';
global.MITER = 'miter';
global.BEVEL = 'bevel';
global.LINEAR = 'linear';
global.RADIAL = 'radial';
global.REPEAT = 'repeat';
global.CLOSE = 'close';
global.ADD = 'add';
global.SUBTRACT = 'subtract';
global.DARKEST = 'darkest';
global.LIGHTEST = 'lightest';
global.DIFFERENCE = 'difference';
global.EXCLUSION = 'exclusion';
global.MULTIPLY = 'multiply';
global.SCREEN = 'screen';
global.OVERLAY = 'overlay';
global.HARD_LIGHT = 'hard_light';
global.SOFT_LIGHT = 'soft_light';
global.DODGE = 'dodge';
global.BURN = 'burn';
global.HSLA = 'hsla';
global.RGB = 'rgb';
global.ARROW = 'arrow';
global.CROSS = 'cross';
global.HAND = 'hand';
global.MOVE = 'move';
global.TEXT = 'text';
global.WAIT = 'wait';
global.ERL = 'erl';
global.GROOVE = 'groove';
global.INSET = 'inset';
global.OUTSET = 'outset';
global.RIDGE = 'ridge';
global.SOLID = 'solid';
global.DASHED = 'dashed';
global.DOTTED = 'dotted';

// Mock HTML5 Canvas
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  clearRect: jest.fn(),
  save: jest.fn(),
  restore: jest.fn()
}));
# Testing Documentation for Distortion Tool App

## 🎯 Testing Strategy

This application uses a comprehensive testing approach combining **White Box** and **Black Box** testing techniques:

- **Unit & Integration Tests**: White Box techniques (testing internal logic, branches, paths)
- **System & Acceptance Tests**: Black Box techniques (testing user experience, workflows)

## 🧪 Test Types

### 1. Unit Tests (`tests/unit/`)
**White Box Testing** - Tests individual functions and methods
- **Statement Coverage**: Tests every line of code
- **Branch Coverage**: Tests every decision path  
- **Path Coverage**: Tests complete execution paths
- **Condition Coverage**: Tests all boolean conditions

**Files:**
- `scissorTool.test.js` - Comprehensive unit tests for scissor tool

### 2. Integration Tests (`tests/integration/`)
**White Box Testing** - Tests component interactions
- Canvas integration
- DOM integration  
- Tool state integration
- Error handling integration
- Performance integration

**Files:**
- `scissorTool-integration.test.js` - Integration tests for scissor tool

### 3. System Tests (`tests/system/`)
**Black Box Testing** - Tests complete system behavior
- User workflow testing
- User interface testing
- User input validation
- System performance
- System error handling
- System state consistency

**Files:**
- `scissorTool-system.test.js` - System tests for scissor tool

### 4. Acceptance Tests (`tests/acceptance/`)
**Black Box Testing** - Tests user requirements and business logic
- User story testing
- Workflow validation
- Performance requirements
- Accessibility requirements
- Data integrity
- Edge case handling

**Files:**
- `scissorTool-acceptance.test.js` - Acceptance tests for scissor tool

## 🚀 Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only  
npm run test:system      # System tests only
npm run test:acceptance  # Acceptance tests only

# Run with coverage report
npm run test:coverage

# Run white box tests (unit + integration)
npm run test:whitebox

# Run black box tests (system + acceptance)
npm run test:blackbox

# Run all scissor tool tests
npm run test:scissor
```

### Interactive Test Runner
```bash
# Start interactive test runner
node run-tests.js

# Or run specific commands
node run-tests.js unit
node run-tests.js integration
node run-tests.js system
node run-tests.js acceptance
node run-tests.js coverage
```

## 📊 Coverage Goals

The testing suite aims for **85% coverage** across all metrics:
- **Branches**: 85%
- **Functions**: 85%  
- **Lines**: 85%
- **Statements**: 85%

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- Test environment: `jsdom` (simulates browser environment)
- Coverage reporters: text, lcov, HTML
- Setup files: `test-config/setup.js`
- Coverage thresholds: 85% for all metrics

### Test Setup (`test-config/`)
- `setup.js` - General test environment setup
- `scissorTool-setup.js` - Specialized setup for scissor tool tests

## 🎨 Scissor Tool Testing

### What's Tested

#### Unit Tests (White Box)
- **Initialization**: Tool properties, state variables
- **Mouse Events**: mousePressed, mouseReleased, draw
- **Selection Logic**: Size validation, coordinate handling
- **Paste Operations**: Mode switching, image placement
- **State Management**: Selection state, paste state, rotation
- **Error Handling**: Invalid inputs, missing elements

#### Integration Tests (White Box)
- **Canvas Integration**: Pixel manipulation, snapshots
- **DOM Integration**: Tool options, instructions, buttons
- **Tool State Integration**: State consistency across operations
- **Error Handling Integration**: Graceful failure handling
- **Performance Integration**: Large canvas handling, rapid operations

#### System Tests (Black Box)
- **User Workflows**: Complete selection → cut → paste cycle
- **User Interface**: Tool options display, instruction clarity
- **Input Validation**: Mouse coordinates, selection sizes
- **System Performance**: Response times, large selections
- **Error Handling**: System-level error scenarios
- **State Consistency**: System state during operations

#### Acceptance Tests (Black Box)
- **User Stories**: Cut/paste, cancel selection, switch tools
- **Visual Feedback**: Selection overlays, paste previews
- **Accessibility**: Clear instructions, helpful guidance
- **Data Integrity**: Original drawing preservation
- **Edge Cases**: Boundary coordinates, rapid movements

### Test Scenarios Covered

1. **Selection Creation**
   - Valid selection sizes
   - Invalid selection sizes (too small)
   - Boundary coordinates
   - Rapid mouse movements

2. **Paste Operations**
   - Entering paste mode
   - Preview during paste
   - Placing selection
   - Rotation handling

3. **State Management**
   - Selection state tracking
   - Paste mode state
   - State reset after operations
   - Tool switching cleanup

4. **Error Scenarios**
   - Missing DOM elements
   - Canvas operation failures
   - Image processing errors
   - Invalid user inputs

5. **Performance Testing**
   - Response time validation
   - Large selection handling
   - Multiple rapid operations
   - Memory usage optimization

## 🛠️ Test Utilities

### Mock Objects
- **P5.js Functions**: All drawing and utility functions
- **Canvas Context**: 2D context with mock methods
- **DOM Elements**: Tool options, instructions, buttons
- **Global Variables**: Mouse coordinates, canvas dimensions

### Helper Functions
- **Mock Creation**: Easy setup of test environments
- **State Reset**: Clean slate between tests
- **Assertion Helpers**: Common test validations

## 📝 Writing New Tests

### Unit Test Template
```javascript
describe('Function Name', () => {
  test('should handle normal case', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionName(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Integration Test Template
```javascript
describe('Component Integration', () => {
  test('should integrate with other components', () => {
    // Setup mocks
    // Perform integration
    // Verify interactions
  });
});
```

### System Test Template
```javascript
describe('User Workflow', () => {
  test('should complete user workflow', () => {
    // Given: Initial state
    // When: User performs actions
    // Then: Expected outcomes
  });
});
```

### Acceptance Test Template
```javascript
describe('User Story: Feature Name', () => {
  test('As a user, I want to...', () => {
    // Given: Context
    // And: Prerequisites
    // When: Action
    // Then: Result
  });
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Test Environment Setup**
   ```bash
   # Clear Jest cache
   npx jest --clearCache
   
   # Reinstall dependencies
   npm install
   ```

2. **Mock Issues**
   - Ensure all p5.js functions are mocked
   - Check DOM element selectors
   - Verify canvas context mocking

3. **Coverage Issues**
   - Check test file paths in jest.config.js
   - Ensure all code paths are tested
   - Verify mock coverage

### Debug Mode
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="test name"
```

## 📚 Additional Resources

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Testing Best Practices**: https://testing-library.com/docs/guiding-principles
- **White Box Testing**: https://en.wikipedia.org/wiki/White-box_testing
- **Black Box Testing**: https://en.wikipedia.org/wiki/Black-box_testing

## 🤝 Contributing

When adding new tests:
1. Follow the existing test structure
2. Use appropriate testing techniques (white/black box)
3. Maintain coverage goals
4. Add comprehensive documentation
5. Ensure tests are maintainable and readable

---

**Happy Testing! 🎨✨**

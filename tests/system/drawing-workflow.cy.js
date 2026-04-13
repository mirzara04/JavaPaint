describe('Drawing App System Test - Black Box', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    // Black Box: Test entire system functionality without knowing internal code
    it('should provide complete drawing functionality', () => {
      // Test input: User selects brush tool
      // Expected output: Tool becomes active
      cy.get('#brush-btn').click();
      cy.get('#brush-btn').should('have.class', 'active');
      
      // Test input: User changes color
      // Expected output: Color picker reflects change
      cy.get('#color-picker').invoke('val', '#ff0000').trigger('change');
      cy.get('#color-picker').should('have.value', '#ff0000');
      
      // Test input: User draws on canvas
      // Expected output: Visual feedback shows drawing exists
      cy.get('#canvas')
        .trigger('mousedown', { x: 100, y: 100 })
        .trigger('mousemove', { x: 200, y: 200 })
        .trigger('mouseup');
      
      // Black Box: Only check observable output, not internal state
      cy.get('#canvas').toMatchImageSnapshot(); // Visual verification
    });
  
    // Black Box: Test system-level workflows
    it('should handle complete save/load workflow', () => {
      // Create some drawing (input)
      cy.get('#brush-btn').click();
      cy.get('#canvas')
        .trigger('mousedown', 100, 100)
        .trigger('mousemove', 200, 200)
        .trigger('mouseup');
      
      // Save functionality (system behavior)
      cy.get('#save-btn').click();
      cy.get('#filename-input').type('test-artwork');
      cy.get('#save-confirm').click();
      
      // Verify system response (output only)
      cy.get('.success-message').should('be.visible');
      cy.get('.success-message').should('contain', 'saved');
      
      // Clear canvas (input)
      cy.get('#clear-btn').click();
      
      // Load functionality (system behavior)
      cy.get('#load-btn').click();
      cy.get('[data-filename="test-artwork"]').click();
      
      // Verify system restored drawing (output verification)
      cy.get('#canvas').should('not.be.empty');
    });
  
    // Black Box: Performance and responsiveness testing
    it('should handle rapid drawing actions', () => {
      cy.get('#brush-btn').click();
      
      // Simulate rapid drawing (stress test)
      for(let i = 0; i < 10; i++) {
        cy.get('#canvas')
          .trigger('mousedown', 100 + i*10, 100)
          .trigger('mousemove', 200 + i*10, 200)
          .trigger('mouseup');
      }
      
      // System should remain responsive (black box verification)
      cy.get('#brush-btn').should('be.enabled');
      cy.get('#canvas').should('be.visible');
    });
  });
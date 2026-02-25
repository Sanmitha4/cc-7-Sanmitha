
import { describe, it, beforeEach, assert } from 'vitest';
import { Stack } from '../Stack/stack'; 

describe('Stack Operations (Encapsulated)', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  /**
   * Tests push functionality
   */
  it('push: should add elements to the top', () => {
    stack.push(10);
    assert.strictEqual(stack.top(), 10, 'Top should be 10 after first push');

    stack.push(20);
    assert.strictEqual(stack.top(), 20, 'Top should be 20 after second push');
  });

  /**
   * Tests the pop functionality (LIFO: Last-In, First-Out)
   */
  it('pop: should remove and return the most recent element (LIFO)', () => {
    stack.push(100);
    stack.push(200);
    stack.push(300);

    const popped = stack.pop(); 
    
    assert.strictEqual(popped, 300, 'Pop should return the last item pushed (300)');
    assert.strictEqual(stack.top(), 200, 'New top should be the previous element (200)');
    
    stack.pop();
    assert.strictEqual(stack.top(), 100, 'Top should be 100 after second pop');
  });

  /**
   * Tests the top functionality in empty states
   */
  it('top: should return null when stack is empty', () => {
    assert.isNull(stack.top(), 'Top should be null on a fresh stack');
    
    stack.push(5);
    stack.pop();
    assert.isNull(stack.top(), 'Top should be null after popping the last item');
  });

  /**
   * Tests error handling for underflow conditions
   */
  it('Error Handling: should throw Stack Underflow on empty pop', () => {
    // Verifying the specific error class or message
    assert.throws(
      () => stack.pop(), 
      Error, 
      "Stack Underflow"
    );
  });

  /**
   * Integration: complex push/pop sequences
   */
  it('Integration: should handle complex push/pop sequences', () => {
    stack.push(1);
    stack.push(2);
    assert.strictEqual(stack.pop(), 2);
    
    stack.push(3);
    assert.strictEqual(stack.top(), 3);
    
    stack.pop(); // removes 3
    stack.pop(); // removes 1
    
    assert.isNull(stack.top(), 'Stack should be empty');
  });

  /**
   * Generics: verify it handles different types
   */
  it('Generics: should work with string data types', () => {
    const stringStack = new Stack<string>();
    stringStack.push("A");
    stringStack.push("B");
    
    assert.strictEqual(stringStack.pop(), "B", 'Should return the top string');
    assert.strictEqual(stringStack.top(), "A", 'A should remain as top');
  });
});
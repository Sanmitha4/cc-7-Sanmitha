import { describe, it, beforeEach, assert } from 'vitest';
import { LinkedList } from './linkedlist';

describe('LinkedList Operations with Private Implementation', () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  describe('Core Functionality', () => {
    it('addAtHead: should update head and tail on first insertion', () => {
      list.addAtHead(10);
      assert.strictEqual(list.valueAtHead(), 10);
      assert.strictEqual(list.valueAtTail(), 10);
      assert.strictEqual(list.length(), 1);

      list.addAtHead(20);
      assert.strictEqual(list.valueAtHead(), 20);
      assert.strictEqual(list.valueAtIndex(1), 10);
    });

    it('addAtEnd: should update tail and maintain head', () => {
      list.addAtEnd(5);
      list.addAtEnd(15);
      assert.strictEqual(list.valueAtTail(), 15);
      assert.strictEqual(list.valueAtHead(), 5);
      assert.strictEqual(list.length(), 2);
    });

    it('removeFromHead: should shift the head forward', () => {
      list.addAtEnd(100);
      list.addAtEnd(200);
      const removed = list.removeFromHead(); 
      assert.strictEqual(removed, 100);
      assert.strictEqual(list.valueAtHead(), 200);
      assert.strictEqual(list.length(), 1);
    });

    it('removeFromEnd: should remove the tail and update length', () => {
      list.addAtEnd(1);
      list.addAtEnd(2);
      list.addAtEnd(3);
      const removed = list.removeFromEnd();
      assert.strictEqual(removed, 3);
      assert.strictEqual(list.valueAtTail(), 2);
      assert.strictEqual(list.length(), 2);
    });

    it('searchFor: should locate values correctly', () => {
      list.addAtEnd(10);
      list.addAtEnd(20);
      assert.strictEqual(list.searchFor(20), 20);
      assert.isNull(list.searchFor(99));
    });
  });

  describe('Retrieval Methods & Indexing', () => {
    it('valueAtHead & valueAtTail: should return correct values or null', () => {
      assert.isNull(list.valueAtHead());
      assert.isNull(list.valueAtTail());
      
      list.addAtHead(100);
      list.addAtEnd(200);
      
      assert.strictEqual(list.valueAtHead(), 100);
      assert.strictEqual(list.valueAtTail(), 200);
    });

    it('valueAtIndex: should handle various scenarios and out-of-bounds', () => {
      assert.isNull(list.valueAtIndex(0));

      list.addAtHead(10);
      list.addAtEnd(20);
      list.addAtEnd(30);

      assert.strictEqual(list.valueAtIndex(0), 10);
      assert.strictEqual(list.valueAtIndex(1), 20);
      assert.strictEqual(list.valueAtIndex(2), 30);
      
      assert.isNull(list.valueAtIndex(3), 'Upper bound');
      assert.isNull(list.valueAtIndex(-1), 'Negative index');
    });

    it('valueAtIndex: should remain accurate after removals', () => {
      list.addAtEnd(1);
      list.addAtEnd(2);
      list.addAtEnd(3);
      
      list.removeFromHead(); 
      assert.strictEqual(list.valueAtIndex(0), 2);
      assert.strictEqual(list.valueAtIndex(1), 3);
    });
  });

  describe('Edge Cases & Integration', () => {
    it('should be empty after removing the only element', () => {
      list.addAtHead(50);
      list.removeFromEnd();
      assert.isNull(list.valueAtHead());
      assert.strictEqual(list.length(), 0);
    });

    it('should return null when removing from empty list', () => {
      assert.isNull(list.removeFromHead());
      assert.isNull(list.removeFromEnd());
    });

    it('should maintain state through complex sequences', () => {
      list.addAtHead(1);  // [1]
      list.addAtEnd(2);   // [1, 2]
      list.addAtHead(0);  // [0, 1, 2]
      list.removeFromHead(); // [1, 2]
      list.removeFromEnd();  // [1]
      
      assert.strictEqual(list.valueAtHead(), 1);
      assert.strictEqual(list.valueAtTail(), 1);
      assert.strictEqual(list.length(), 1);
    });
  });
});
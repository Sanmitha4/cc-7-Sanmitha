import { describe, it, beforeEach, assert } from 'vitest';
import { LinkedList } from './linkedlist';

describe('LinkedList Operations with Private Implementation', () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  it('addAtHead: should update head and tail on first insertion', () => {
    list.addAtHead(10);
    // Use valueAtHead() instead of .head.value
    assert.strictEqual(list.valueAtHead(), 10, 'Head value should be 10');
    assert.strictEqual(list.valueAtTail(), 10, 'Tail value should also be 10');
    assert.strictEqual(list.length(), 1, 'Length should be 1');

    list.addAtHead(20);
    assert.strictEqual(list.valueAtHead(), 20, 'Head should update to 20');
    assert.strictEqual(list.valueAtIndex(1), 10, 'The element at index 1 should be 10');
  });

  it('addAtEnd: should update tail and maintain head', () => {
    list.addAtEnd(5);
    list.addAtEnd(15);
    assert.strictEqual(list.valueAtTail(), 15, 'Tail should be 15');
    assert.strictEqual(list.valueAtHead(), 5, 'Head should remain 5');
    assert.strictEqual(list.length(), 2);
  });

  it('removeFromHead: should shift the head forward', () => {
    list.addAtEnd(100);
    list.addAtEnd(200);
    
    const removed = list.removeFromHead(); 
    
    assert.strictEqual(removed, 100, 'Should return the removed head value');
    assert.strictEqual(list.valueAtHead(), 200, 'The next node should now be the head');
    assert.strictEqual(list.length(), 1);
  });

  it('removeFromEnd: should remove the tail and update length', () => {
    list.addAtEnd(1);
    list.addAtEnd(2);
    list.addAtEnd(3);

    const removed = list.removeFromEnd();
    
    assert.strictEqual(removed, 3, 'Should return the removed tail value');
    assert.strictEqual(list.valueAtTail(), 2, 'The node with value 2 should now be the tail');
    assert.strictEqual(list.length(), 2);
  });

  it('valueAtIndex: should retrieve correct values or null if out of bounds', () => {
    list.addAtEnd(10);
    list.addAtEnd(20);
    list.addAtEnd(30);

    assert.strictEqual(list.valueAtIndex(0), 10);
    assert.strictEqual(list.valueAtIndex(1), 20);
    assert.strictEqual(list.valueAtIndex(2), 30);
    assert.isNull(list.valueAtIndex(5), 'Should return null for out of bounds index');
    assert.isNull(list.valueAtIndex(-1), 'Should return null for negative index');
  });

  it('searchFor: should locate values correctly', () => {
    list.addAtEnd(10);
    list.addAtEnd(20);

    assert.strictEqual(list.searchFor(20), 20);
    assert.isNull(list.searchFor(99));
  });

  it('Edge Case: List should be totally empty after removing last element', () => {
    list.addAtHead(50);
    list.removeFromEnd();
    
    assert.isNull(list.valueAtHead(), 'Head must be null');
    assert.isNull(list.valueAtTail(), 'Tail must be null');
    assert.strictEqual(list.length(), 0);
  });

  it('Empty List: removeFromHead and removeFromEnd should return null', () => {
    assert.isNull(list.removeFromHead());
    assert.isNull(list.removeFromEnd());
    assert.strictEqual(list.length(), 0);
  });

  it('Mixed Operations: complex sequence', () => {
    list.addAtHead(1);  // [1]
    list.addAtEnd(2);   // [1, 2]
    list.addAtHead(0);  // [0, 1, 2]
    
    assert.strictEqual(list.length(), 3);
    
    list.removeFromHead(); // [1, 2]
    list.removeFromEnd();  // [1]
    
    assert.strictEqual(list.valueAtHead(), 1);
    assert.strictEqual(list.valueAtTail(), 1);
    assert.strictEqual(list.length(), 1);
    
    list.removeFromHead(); // []
    assert.isNull(list.valueAtHead());
    assert.strictEqual(list.length(), 0);
  });
});
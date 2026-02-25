
import { LinkedList } from '../LinkedList/linkedlist';

/**
 * Interface representing the contract for a Stack data structure.
 * @template T The type of elements held in the stack.
 */
interface StackInterface<T> {
  /** Adds an item to the stack. */
  push(item: T): T;
  /** Removes and returns the top item. */
  pop(): T;
  /** Returns the top item without removing it. */
  top(): T | null;
}

/**
 * A Stack implementation using a Singly Linked List.
 */
export class Stack<T> implements StackInterface<T> {
  #items = new LinkedList<T>();

  /**
   * Returns the value at the top of the stack without removing it.
   */
  top(): T | null {
    return this.#items.valueAtHead();
  }

  /**
   * Adds an item to the top (head) of the stack.
   */
  push(item: T): T {
    this.#items.addAtHead(item);
    return item;
  }

  /**
   * Removes and returns the top item. Throws error if empty.
   */
  pop(): T {
    const item = this.top();
    
    if (item === null) {
      throw new Error("Stack Underflow");
    }

    // Uses the updated removeFromHead which no longer requires a parameter
    this.#items.removeFromHead();
    return item;
  }
}
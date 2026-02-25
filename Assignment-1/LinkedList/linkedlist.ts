/**
 * 
 * @template T The type of data stored in the node.
 */
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Interface definition as required by the assignment.
 */
interface LinkedListInterface<T> {
  addAtEnd(t: T): T;
  removeFromEnd(): T | null;
  addAtHead(t: T): T;
  removeFromHead(): T | null; 
  searchFor(t: T): T | null;
  length(): number;
  valueAtHead(): T | null;
  valueAtTail(): T | null;
  valueAtIndex(index: number): T | null;
}


export class LinkedList<T> implements LinkedListInterface<T> {
  #head: ListNode<T> | null = null;
  #tail: ListNode<T> | null = null;
 #length: number = 0;
 /**
   * Returns the value at the start of the list.
   */
  valueAtHead(): T | null {
    return this.#head?.value ?? null;
  }
  /**
   * Returns the value at the end of the list.
   */
  valueAtTail(): T | null {
    return this.#tail?.value ?? null;
  }
  /**
   * Returns the value at a specific 0-based index.
   */
  valueAtIndex(index: number): T | null {
    if (index < 0 || index >= this.#length) return null;
    
    let current = this.#head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current?.value ?? null;
  }

  /**
   * Adds an element to the beginning of the list.
   * @param t The value to add.
   */
  addAtHead(t: T): T {
    const newNode = new ListNode(t);
    if (!this.#head) {
      this.#head = this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head = newNode;
    }
    this.#length++;
    return t;
  }

  /**
   * Adds an element to the end of the list.
   * @param t The value to add.
   */
  addAtEnd(t: T): T {
    const newNode = new ListNode(t);
    if (!this.#tail) {
      this.#head = this.#tail = newNode;
    } else {
      this.#tail.next = newNode;
      this.#tail = newNode;
    }
    this.#length++;
    return t;
  }

  /**
   * Removes and returns the first element of the list.
   * 
   */
  removeFromHead(): T | null {
    if (!this.#head) return null;
    const val = this.#head.value;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#length--;
    return val;
  }

  /**
   * Removes and returns the last element of the list.
   
   */
  removeFromEnd(): T | null {
    if (!this.#head) return null;
    
    const val = this.#tail!.value;
    if (this.#head === this.#tail) {
      this.#head = this.#tail = null;
    } else {
      let current = this.#head;
      while (current.next && current.next !== this.#tail) {
        current = current.next;
      }
      current.next = null;
      this.#tail = current;
    }
    this.#length--;
    return val;
  }

  /**
   * Searches for a specific value in the list.
   */
  
  searchFor(t: T): T | null {
    let current = this.#head;
    while (current) {
      if (current.value === t) return t;
      current = current.next;
    }
    return null;
  }
  /**
   * Returns the current number of elements in the list.
   */
  length(): number {
    return this.#length;
  }
}
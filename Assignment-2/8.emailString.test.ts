import { describe, it, assert } from 'vitest';
import { extractEmails } from './8.emailString';

describe('Email Extraction', () => {
  it('should return only valid, lowercased emails', () => {
    const input = [
      "34, brighten street, email: BS@sft.com", 
      "Behind hotel paragon, rode street, micHel@sun.it", 
      "ulef court, cown street, email:cown@street",  
      "CodeCraft"
    ];

    const expected = ["bs@sft.com", "michel@sun.it"];
    
    assert.deepStrictEqual(extractEmails(input), expected);
  });
});
import { describe, it, expect } from 'vitest';
import { 
  calculateTotalSalaryUnderAge, 
  getFullNames, 
  getEmailString, 
  Employee 
} from './14.employee';

const mockEmployees: Employee[] = [
  { "firstName": "Molly", "lastName": "Rojas", "age": 38, "email": "mollyrojas@plasmox.com", "salary": 3065 },
  { "firstName": "Marguerite", "lastName": "Santiago", "age": 27, "email": "margueritesantiago@plasmox.com", "salary": 2796 },
  { "firstName": "Evelyn", "lastName": "Oneil", "age": 26, "email": "evelynoneil@plasmox.com", "salary": 3947 },
  { "firstName": "Consuelo", "lastName": "Case", "age": 23, "email": "consuelocase@plasmox.com", "salary": 2819 },
  { "firstName": "Earline", "lastName": "Bush", "age": 29, "email": "earlinebush@plasmox.com", "salary": 3494 },
  { "firstName": "Sanford", "lastName": "Hurley", "age": 26, "email": "sanfordhurley@plasmox.com", "salary": 3068 },
  { "firstName": "Todd", "lastName": "Gomez", "age": 33, "email": "toddgomez@plasmox.com", "salary": 3906 }
];

describe('Employee Data Logic', () => {
  
  it('should sum salaries for employees under 30 correctly', () => {
    // Expected: 2796 + 3947 + 2819 + 3494 + 3068 = 16124
    const result = calculateTotalSalaryUnderAge(mockEmployees, 30);
    expect(result).toBe(16124);
  });

  it('should return an empty sum (0) if no employees are under the age limit', () => {
    const result = calculateTotalSalaryUnderAge(mockEmployees, 20);
    expect(result).toBe(0);
  });

  it('should correctly format full names', () => {
    const names = getFullNames(mockEmployees);
    expect(names).toHaveLength(7);
    expect(names[0]).toBe("Molly Rojas");
    expect(names).toContain("Todd Gomez");
  });
  it('should handle an empty employee array gracefully', () => {
    const emptyList: Employee[] = [];
    
    expect(calculateTotalSalaryUnderAge(emptyList, 30)).toBe(0);
    expect(getFullNames(emptyList)).toEqual([]);
    expect(getEmailString(emptyList)).toBe("");
  });

  it('should join all emails with a comma', () => {
    const emails = getEmailString(mockEmployees);
    const emailArray = emails.split(",");
    
    expect(typeof emails).toBe('string');
    expect(emailArray).toHaveLength(7);
    expect(emails).toContain("mollyrojas@plasmox.com");
    expect(emails.endsWith(",")).toBe(false);
  });
  it('should correctly format emails even if there is only one employee', () => {
    const singleEmployee: Employee[] = [
      { firstName: "Solo", lastName: "Worker", age: 40, email: "solo@test.com", salary: 5000 }
    ];
    const emails = getEmailString(singleEmployee);
    
    expect(emails).toBe("solo@test.com");
    expect(emails.includes(",")).toBe(false);
  });

});
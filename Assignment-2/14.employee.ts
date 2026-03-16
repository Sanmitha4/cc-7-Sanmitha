export interface Employee {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  salary: number;
}

/**
 * Calculates the sum of salaries for all employees under a specific age.
 */
export const calculateTotalSalaryUnderAge = (employees: Employee[], maxAge: number): number => {
  return employees
    .filter(emp => emp.age < maxAge)
    .reduce((acc, emp) => acc + emp.salary, 0);
};

/**
 * Returns an array of full names for all employees.
 */
export const getFullNames = (employees: Employee[]): string[] => {
  return employees.map(emp => `${emp.firstName} ${emp.lastName}`);
};

/**
 * Returns a comma-separated string containing all employee email addresses.
 */
export const getEmailString = (employees: Employee[]): string => {
  return employees.map(emp => emp.email).join(",");
};
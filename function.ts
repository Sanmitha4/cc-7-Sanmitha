const employees=[
{
"firstName": "Molly",
"lastName": "Rojas",
"age": 38,
"email": "mollyrojas@plasmox.com",
"salary": 3065
},
{
"firstName": "Marguerite",
"lastName": "Santiago",
"age": 27,
"email": "margueritesantiago@plasmox.com",
"salary": 2796
},
{
"firstName": "Evelyn",
"lastName": "Oneil",
"age": 26,
"email": "evelynoneil@plasmox.com",
"salary": 3947
},
{
"firstName": "Consuelo",
"lastName": "Case",
"age": 23,
"email": "consuelocase@plasmox.com",
"salary": 2819
},
{
"firstName": "Earline",
"lastName": "Bush",
"age": 29,
"email": "earlinebush@plasmox.com",
"salary": 3494
},
{
"firstName": "Sanford",
"lastName": "Hurley",
"age": 26,
"email": "sanfordhurley@plasmox.com",
"salary": 3068
},
{
"firstName": "Todd",
"lastName": "Gomez",
"age": 33,
"email": "toddgomez@plasmox.com",
"salary": 3906
}
];
/**
 * Calculates the sum of salaries for all employees under the age of 30.
 *  @type {number}
 * @description 
 * 1. Filters the collection for employees where `age < 30`.
 * 2. Sums the `salary` property of the remaining employees.
 */
const totalSalary=employees.filter(emp=>emp.age<30).reduce((acc,emp)=>acc+emp.salary,0);
console.log(totalSalary)

/**
 * An array of full names for all employees.
 * Combines the `firstName` and `lastName` properties into a single string.
 *  @type {string[]}
 * @example ["Molly Rojas", "Marguerite Santiago", ...]
 */
const fullNames:string[]=employees.map(emp=>`${emp.firstName} ${emp.lastName}`)
console.log(fullNames)

/**
 * A comma-separated string containing all employee email addresses.
 * @type {string}
 * @example "toddgomez@plasmox.com, consuelocase@plasmox.com, ..."
 * @description First maps the employee objects to their email property, 
 * then joins them using a comma delimiter.
 */
const emailId:string=employees.map(emp=>emp.email).join(",")
console.log(emailId)
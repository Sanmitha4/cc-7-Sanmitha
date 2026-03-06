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


/**
 * An array containing the first 'n' natural numbers (starting from 1).
 * @type {number[]}
 * @example [1, 2, 3, ..., 15]
 */
const n:number=15; 
const naturalNum:number[]=Array.from({length:n},(_, i) => i + 1);
console.log(naturalNum)

/**
 * An object storing the aggregate sums of odd and even numbers 
 * filtered from the naturalNum sequence.
 *  @type {Object}
 * @property {number} odd - The total sum of all odd numbers in the array.
 * @property {number} even - The total sum of all even numbers in the array.
 */
const oddEven={
    odd:naturalNum.filter(num=>num%2 !==0).reduce((acc, num) => acc + num, 0),
    even:naturalNum.filter(num=>num%2===0).reduce((acc, num) => acc + num, 0)
 }
 console.log(oddEven);


 const alphabetStr: string = "abcdefghijklmnopqrstuvwxyz";

/**
 * [aeiou] - Matches any single character in the set.
 * [^aeiou] - The '^' inside brackets means "NOT". Matches anything else.
 * /g - Global flag to find all matches.
 */
const alphaCategorized = {
  vowels: alphabetStr.match(/[aeiou]/g) || [],
  consonants: alphabetStr.match(/[^aeiou]/g) || []
};

console.log(alphaCategorized);

import assert from 'node:assert';
/**
 * A generic function type representing a transformation of a value.
 * @template T - The type of the input and output value.
 */
type FuncT<T> = (arg: T) => T;

/**
 * Composes functions from left to right (Pipe).
 * The output of the first function is passed as the input to the second, and so on.
 * @template T - The data type being processed.
 * @param {...FuncT<T>[]} fns - An array of functions to apply in sequence.
 * @returns {FuncT<T>} A single function that applies all provided functions in order.
 */
const pipe=<T>(...fns:FuncT<T>[]):FuncT<T>=>{
	return(x:T)=>{
		return fns.reduce((accumulated,current)=>current(accumulated),x );
	};
};

/**
 * Removes whitespace from the end of a string.
 * @param {string} str - The input string.
 * @returns {string}
 */
const trimRight=(str:string)=>str.trimEnd()
/**
 * Removes whitespace from the start of a string.
 * @param {string} str - The input string.
 * @returns {string}
 */
const trimLeft=(str:string)=>str.trimStart()
/**
 * Converts a string to all lowercase letters.
 * @param {string} str - The input string.
 * @returns {string}
 */
const trimLower=(str:string)=>str.toLowerCase()
/**
 * Appends a cat emoji to the end of a string.
 * @param {string} str - The input string.
 * @returns {string}
 */
const catEmojii=(str:string)=>str+'😺';
/** Execution Order: trimRight -> trimLeft -> trimLower -> catEmojii
 */
const trimRTrimLCatEmojiiPipe=pipe(
	trimRight,
	trimLeft,
	trimLower,
	catEmojii,
);
assert.strictEqual(
    trimRTrimLCatEmojiiPipe(" Welcome to the wonderland of cats "),
    "welcome to the wonderland of cats😺",
    "Pipe should trim, lowercase, and add emoji"
);

/**
 * Composes functions from right to left (Compose).
 * This is the standard mathematical composition: f(g(x)).
 * * @template T - The data type being processed.
 * @param {...FuncT<T>[]} fns - An array of functions to apply in reverse order.
 * @returns {FuncT<T>} A single function that applies all provided functions from right to left.
 */
const compose=<T>(...fns:FuncT<T>[]):FuncT<T>=>{
	const reversedFns=fns.toReversed();
	return(x:T)=>{
		return reversedFns.reduce((accumulated,current)=>current(accumulated),x);
	};
};

const trimRTrimLCatEmojiiCompose=compose(catEmojii,
    trimLower,
    trimLeft,
    trimRight,
);
assert.strictEqual(
    trimRTrimLCatEmojiiCompose(" Welcome to the wonderland of cats "),
    "welcome to the wonderland of cats😺",
    "Compose should result in the same output by processing right-to-left"
);

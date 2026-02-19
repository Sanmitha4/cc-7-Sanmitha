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


import fs from "node:fs/promises";
import fsSync from "node:fs"; // Used for one-time synchronous setup/cleanup
import path from "node:path";
import os from 'node:os';
/**
 * Asynchronously determines the type of a file system entry.
 * * This function uses `async/await` syntax to wrap the `fs.stat` promise.
 * @param {string} path - The relative or absolute path to the system entry.
 * @returns {Promise<'FILE' | 'DIRECTORY' | 'OTHER'>} A promise that resolves to:
 * - `'FILE'` for regular files.
 * - `'DIRECTORY'` for folders.
 * - `'OTHER'` for non-standard entries .
 * @throws {Error} Throws "file system error" if the path is invalid or the system 
 * returns an error during inspection.
 */
export async function getFileType(path: string): Promise<'FILE' | 'DIRECTORY' | 'OTHER'> {
    try {
        const stats = await fs.stat(path);
        if (stats.isFile()) return 'FILE';
        if (stats.isDirectory()) return 'DIRECTORY';
        return 'OTHER';
    } catch (err) {
        throw new Error("file system error",{ cause: err });
    }
}
/**
 * Asynchronously retrieves the contents or path identifier of a target location.
 * * This function leverages `getFileType` to decide the retrieval strategy:
 * - **File**: Simply returns the provided path.
 * - **Directory**: Returns a list of filenames within that directory.
 * - **Other**: Returns a generic "OTHER" string.
 *
 * @param {string} myPath - The file system path to inspect.
 * @returns {Promise<string | string[]>} A promise that resolves to the path string, 
 * an array of filenames, or the string "OTHER".
 * @throws {Error} Throws "file system error" if the type check or directory 
 * reading fails.
 */
export async function getContents(myPath: string): Promise<string | string[]> {
    try {
        const type = await getFileType(myPath);
        if (type === 'FILE') return myPath;
        if (type === 'DIRECTORY') return await fs.readdir(myPath);
        return "OTHER";
    } catch (err) {
        throw new Error("file system error",{ cause: err });
    }
}

/**
 * Recursively calculates the total size of a file or directory in bytes.
 * * This function uses an asynchronous recursive approach:
 * - If the path is a **FILE**, it returns its byte size.
 * - If the path is a **DIRECTORY**, it reads all entries and processes them in parallel
 * using `Promise.all` for optimal performance.
 * - If the path is **OTHER**, it returns `0`.
 *
 * @param {string} myPath - The file system path to measure.
 * @returns {Promise<number>} A promise that resolves to the total size in bytes.
 * @throws {Error} Throws "file system error" if the path is inaccessible or 
 * if any recursive call fails.
 */
export async function getSize(myPath: string): Promise<number> {
    try {
        const type=await getFileType(myPath);
        
        if(type=='FILE'){
            const stats=await fs.stat(myPath);
            return stats.size;
        }
        if(type==='DIRECTORY'){
            const contents=await getContents(myPath);
            const files=contents as string[];
            const promises=files.map(file=>getSize(path.join(myPath,file)));
            const sizes=await Promise.all(promises);
            return sizes.reduce((acc,curr)=>acc+curr,0);
        }
        return 0;
    }
    catch(err){
        throw new Error("file system error",{cause:err});
    }
}
    

/**
 * Executes a  suite of file system tests on a specific path.
 * * This function checks the sequential execution of type identification, 
 * content retrieval, and size calculation. It provides formatted console 
 * output for each stage and handles errors  without halting 
 * the execution of other test cases.
 *
 * @param {string} myPath - The target file system path to analyze.
 * @returns {Promise<void>} Resolves when all analysis for the path is complete.
 */

async function runTests(myPath: string) {
    console.log(`--- Starting Async Analysis: ${myPath} ---`);
    
    try {
        // Line by line execution (waits for each to finish.)
        const type = await getFileType(myPath);
        console.log("Type:", type);

        const contents = await getContents(myPath);
        console.log("Contents:", contents);

        const totalSize = await getSize(myPath);
        console.log("Total Size:", totalSize, "bytes");

    } catch (err) {
        // Any error in the block above jumps straight here
        console.error("Test Failed:", err.message);
    } finally {
        console.log(`Analysis for ${myPath} finished.\n`);
    }
}

async function start() {
    // 1. Create a dynamic test environment
    const tempDir = fsSync.mkdtempSync(path.join(os.tmpdir(), 'assignment-test-'));
    const tempFile = path.join(tempDir, 'test-file.txt');
    
    try {
        // 2. Prepare dummy data
        fsSync.writeFileSync(tempFile, "This is some dummy content for testing.");
        
        console.log("...Initializing Dynamic Test Suite...");

        // 3. Run tests using relative paths or dynamically generated ones
        // Test a local project file (relative)
        await runTests("./package.json");
        
        // Test the dynamic directory
        await runTests(tempDir);
        
        // Test the dynamic file
        await runTests(tempFile);

        console.log("All dynamic tests completed");

    } catch (error) {
        console.error("Initialization Error:", error);
    } finally {
        // 4. Cleanup: Remove the temp folder and files after tests
        fsSync.rmSync(tempDir, { recursive: true, force: true });
        console.log("Temporary test folders cleaned up.");
    }
}

start();

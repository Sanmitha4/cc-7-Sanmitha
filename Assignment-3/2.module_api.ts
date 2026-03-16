import fs from "node:fs";
import path from "node:path";
import os from 'node:os';
import fsPromises from "node:fs/promises";

/**
 * This function utilizes `fs.promises.stat` to inspect the metadata of the 
 * provided path and classifies it into one of three specific types.
 * @param path the relative path to the file system
 * @returns Promise<'FILE'|'DIRECTORY'|'OTHER'> a promise that resolves to
 * 'FILE' if path is regular file
 * 'DIRECTORY' if path is a directory
 * 'OTHER' if path exists and its neither file or directory
 * @throws ERROR Rejects with new Error("FILE ERROR") if path does not exist
 */function getFileType(filePath: string): Promise<'FILE' | 'DIRECTORY' | 'OTHER'> {
    return fsPromises.stat(filePath)
        .then(stats => {
            if (stats.isFile()) return 'FILE';
            if (stats.isDirectory()) return 'DIRECTORY';
            return 'OTHER';
        })
        .catch(() => {
            throw new Error(`Could not access the file at: ${path}`);
        });
}


/**
 * 
 * @param path the relative path to the file system
 * @returns Promise<string|string[]> a promise that resolves to path(string) ,a list of files(string[]) or an "OTHER" message(string)
 * @throws {Error} Rejects with "FILE ERROR" if the directory cannot be read or 
 * if `getFileType` fails.
 */
function getContents(filePath: string): Promise<string | string[]> {
    return getFileType(filePath)
        .then(type => {
            if (type === 'FILE') {
                return filePath; 
            } else if (type === 'DIRECTORY') {
                return fsPromises.readdir(filePath); 
            }
            return "OTHER";
        })
        .catch(() => {
            throw new Error(`Could not access the file at: ${path}`);
        });
}

/**
 * If the path is a **FILE**, returns the size attribute of the `fs.Stats
 * If the path is a **DIRECTORY**, it reads all entries and recursively calls itself 
 * to sum the total size of all file.
 * - If the path is **OTHER**, it returns `0
 * @param filePath relative path to the file or directory.
 * @returns Promise<number> A promise that resolves to the total size in bytes.
 * @throws {Error} Rejects with `"FILE SYSTEM ERROR"` if a directory entry is 
 * unreadable or the path is invalid.
 */
function getSize(filePath: string): Promise<number> {
    return fsPromises.stat(filePath)
        .then(stats => {
            if (stats.isFile()) {
                return stats.size;
            } else if (stats.isDirectory()) {
                return fsPromises.readdir(filePath)
                    .then(files => {
                        const promises = files.map(file => getSize(path.join(filePath, file)));
                        
                        return Promise.all(promises);
                    })
                    .then(sizes => sizes.reduce((a, b) => a + b, 0));
            }
            return 0;
        })
        .catch(() => {
            throw new Error(`Could not access the file at: ${path}`);
        });
}

// This creates a unique folder in system's temporary directory.
const tempBaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-suite-'));

const testPath = tempBaseDir; 
const testPath1 = path.join(tempBaseDir, 'number.ts');
// Handle the "null" device for both Windows (NUL) and Mac/Linux (/dev/null)
const testPath2 = os.platform() === 'win32' ? 'NUL' : '/dev/null';

// Create the dummy file so getFileType/getSize have something to work with
try {
    fs.writeFileSync(testPath1, "// Test File Content\nconsole.log('Hello');");
    console.log(`Setup: Created temporary test environment at ${tempBaseDir}`);
} catch (err) {
    console.error("Setup Error:", err.message);
}
/**
 *This function performs the following operations in order:
 *filetype,contents and then size. 
 * @param path The path to be tested.
 * @returns A promise that resolves when the test sequence for the path is complete.
 * Performs filetype, contents, and size operations in order.
 */
function runFullTest(path) {
    console.log(`\n Starting Tests for: ${path} `);
    
    return getFileType(path)
        .then(type => {
            console.log(`Type: ${type}`);
            return getContents(path);
        })
        .then(contents => {
            console.log(`Contents:`, contents);
            return getSize(path);
        })
        .then(totalSize => {
            console.log(`Total Size: ${totalSize} bytes`);
        })
        .catch(err => {
            console.error(`Error processing ${path}:`, err.message);
        })
        .finally(() => {
            console.log(`Finished Testing: ${path}`);
        });
}

// --- 3. EXECUTION CHAIN ---
console.log("Starting Sequential Test Suite...");

runFullTest(testPath) 
    .then(() => runFullTest(testPath1)) 
    .then(() => runFullTest(testPath2)) 
    .then(() => {
        console.log("\n--- ALL TESTS COMPLETED ---");
        
        // Optional: Cleanup the temp folder after all tests are done
        fs.rmSync(tempBaseDir, { recursive: true, force: true });
        console.log("Cleanup: Temporary folder deleted.");
    })
    .catch(err => {
        console.error("Test Error:", err);
    });

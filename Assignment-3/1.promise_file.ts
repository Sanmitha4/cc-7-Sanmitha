import fs from "node:fs";
import path from "node:path";
import os from 'node:os';


/**
 * 
 * @param path the relative path to the file system
 * @returns Promise<'FILE'|'DIRECTORY'|'OTHER'> a promise that resolves to
 * 'FILE' if path is regular file
 * 'DIRECTORY' if path is a directory
 * 'OTHER' if path exists and its neither file or directory
 * @throws ERROR Rejects with new Error("FILE ERROR") if path does not exist
 */
function getFileType(path: string): Promise<'FILE'|'DIRECTORY'|'OTHER'>{
    return new Promise((resolve,reject)=>{
        fs.stat(path,(err,stats)=>{
            if(err){
                return reject(new Error(`Could not access the file at: ${path}`));
            }else{
                if(stats.isFile()){
                    resolve("FILE");
                }
                else if(stats.isDirectory()){
                    resolve("DIRECTORY");
                }
                else{
                    resolve("OTHER");
                }
            }
        });
    });
}

/**
 * 
 * @param path the relative path to the file system
 * @returns Promise<string|string[]> a promise that resolves to path(string) ,a list of files(string[]) or an "OTHER" message(string)
 * @throws {Error} Rejects with "FILE ERROR" if the directory cannot be read or 
 * if `getFileType` fails.
 */
function getContents(path:string):Promise<string|string[]>{
    return getFileType(path).then(type=>{
        return new Promise((resolve,reject)=>{
            if(type==='FILE'){
                resolve(path);
            }
            else if(type==='DIRECTORY'){
                fs.readdir(path,(err,files)=>{
                    if(err){
                        reject(new Error(`Could not read the directory at ${path}`));
                    }
                    else{
                        resolve(files);
                    }
                });
            }
            else{
                const errorMsg = `Unsupported file system entry type encountered at: ${path}`;
                reject(new Error(errorMsg));
            }
        });
    });
}

/**
 * 
 * @param filePath relative path to the file or directory.
 * @returns Promise<number> A promise that resolves to the total size in bytes.
 * @throws {Error} Rejects with `"FILE SYSTEM ERROR"` if any part of the tree cannot be reached
 */
function getSize(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err){
                return reject(new Error(`Access denied or path not found: ${filePath}`));
                
            }

            if (stats.isFile()) {
                resolve(stats.size);
            } else if (stats.isDirectory()) {
                // Read all items in directory
                fs.readdir(filePath, (err, files) => {
                    if (err) {
                        return reject(new Error("Unable to read the directory at: ${filePath}"));
                    }

                    // Create a promise for each sub-item's size
                    const promises = files.map(file => getSize(path.join(filePath, file)));

                    // Sum them all up once they resolve
                    Promise.all(promises)
                        .then(sizes => resolve(sizes.reduce((a, b) => a + b, 0)))
                        .catch(() => reject(new Error(`Error calculating size for directory: ${filePath}`)));
                });
            } else {
                reject(new Error(`Cannot calculate size of unsupported type at: ${filePath}`));
            }
        });
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
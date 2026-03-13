import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from "node:fs/promises";
import path from "node:path";
import os from 'node:os';
import { getFileType, getContents, getSize } from './3.async';

// --- The Test Environment Setup ---
let tempDir: string;
let tempFile: string;
const fileContent = "Hello, Vitest!";

beforeAll(async () => {
    // Create a unique temp directory for this test run
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vitest-fs-test-'));
    tempFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(tempFile, fileContent);
});

afterAll(async () => {
    // Clean up after tests finish
    await fs.rm(tempDir, { recursive: true, force: true });
});

// --- Tests ---

describe('File System Utils (Async/Await)', () => {

    describe('getFileType()', () => {
        it('should identify a file correctly', async () => {
            const type = await getFileType(tempFile);
            expect(type).toBe('FILE');
        });

        it('should identify a directory correctly', async () => {
            const type = await getFileType(tempDir);
            expect(type).toBe('DIRECTORY');
        });

        it('should throw "file system error" for non-existent paths', async () => {
            await expect(getFileType('./dev-null')).rejects.toThrow("file system error");
        });
    });

    describe('getContents()', () => {
        it('should return the path itself if it is a file', async () => {
            const result = await getContents(tempFile);
            expect(result).toBe(tempFile);
        });

        it('should return an array of filenames for a directory', async () => {
            const result = await getContents(tempDir);
            expect(Array.isArray(result)).toBe(true);
            expect(result).toContain('test.txt');
        });
    });

    describe('getSize()', () => {
        it('should return the correct size of a file in bytes', async () => {
            const size = await getSize(tempFile);
            expect(size).toBe(Buffer.byteLength(fileContent));
        });

        it('should calculate the total size of a directory recursively', async () => {
            // Create a sub-directory with another file
            const subDir = path.join(tempDir, 'sub');
            await fs.mkdir(subDir);
            await fs.writeFile(path.join(subDir, 'inner.txt'), "Hi"); // 2 bytes

            const totalSize = await getSize(tempDir);
            const expectedSize = Buffer.byteLength(fileContent) + 2;
            
            // We check >= because some OS filesystems include directory metadata size
            expect(totalSize).toBeGreaterThanOrEqual(expectedSize);
        });
    });
});
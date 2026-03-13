// delay.ts
export function delay(milliseconds: number): Promise<undefined> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, milliseconds);
    });
}
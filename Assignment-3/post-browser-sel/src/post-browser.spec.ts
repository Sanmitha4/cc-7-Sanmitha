import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import assert from 'assert';

async function runPostBrowserTests() {
    // Initialize Chrome Driver
    let driver: WebDriver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to your local or deployed app
        await driver.get('http://localhost:5173/');

        // --- Scenario 1: Initial Load (1st Post) ---
        console.log("Testing Initial Load...");
        const postTitle = await driver.wait(until.elementLocated(By.id('post-title')), 5000);
        const titleText = await postTitle.getText();
        console.log(`Verified: 1st Post Title is "${titleText}"`);

        // --- Scenario 2: Prev/Next Navigation ---
        console.log("Testing Navigation...");
        const nextBtn = await driver.findElement(By.id('next-btn'));
        await nextBtn.click();
        
        // Wait for the title to change from the first one
        await driver.wait(async () => {
            const newTitle = await driver.findElement(By.id('post-title')).getText();
            return newTitle !== titleText;
        }, 5000);
        console.log("Verified: Navigated to Next post.");

        // --- Scenario 3: Error Scenarios (Mocking/Simulating) ---
        // Since Selenium doesn't intercept network as easily as Playwright, 
        // you can simulate a "Fail to fetch" by going offline or using a URL parameter if your app supports it.
        // Or, check for an error message if the ID is invalid.
        // Example: check if error div is visible
        // const errorMsg = await driver.findElement(By.className('error-ui'));
        // assert.ok(await errorMsg.isDisplayed());

        // --- Scenario 4: Refresh ---
        console.log("Testing Refresh...");
        await driver.navigate().refresh();
        const refreshedTitle = await driver.wait(until.elementLocated(By.id('post-title')), 5000);
        const finalTitle = await refreshedTitle.getText();
        
        // Verify it reset to the 1st post (matching our initial title)
        assert.strictEqual(finalTitle, titleText, "Refresh did not reset to 1st post");
        console.log("Verified: Refresh reset data to 1st post.");

    } catch (error) {
        console.error("Test Case Failed ❌", error);
    } finally {
        await driver.quit();
    }
}

runPostBrowserTests();
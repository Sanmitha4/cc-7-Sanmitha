import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';

test.describe('Drum Machine State Engine', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Buttons in normal mode: start is enabled', async ({ page }) => {
    await expect(page.locator('#recStart')).toBeEnabled();
    await expect(page.locator('#recStart')).toHaveText('start');
    await expect(page.locator('#recPause')).toBeDisabled();
    await expect(page.locator('#recStop')).toBeDisabled();
    await expect(page.locator('#recClear')).toBeDisabled();

    // Playback Panel - Should be completely disabled because there's no recording yet
    await expect(page.locator('#playStart')).toBeDisabled();
    await expect(page.locator('#playStop')).toBeDisabled();
  });

  test('When recording is enabled: start is disabled', async ({ page }) => {
    await page.locator('#recStart').click();
    await expect(page.locator('#recStart')).toBeDisabled();
    await expect(page.locator('#recPause')).toBeEnabled();
    await expect(page.locator('#recStop')).toBeEnabled();
  });

  test('When pause button is enabled ,the start button flips to resume button and when resume is enabled the start button will be disabled', async ({ page }) => {
    await page.locator('#recStart').click();
    await page.locator('#recPause').click();
    await expect(page.locator('#recStart')).toBeEnabled();
    await expect(page.locator('#recStart')).toHaveText('resume');

    await page.locator('#recStart').click();
    
    await expect(page.locator('#recStart')).toBeDisabled();
    await expect(page.locator('#recPause')).toBeEnabled();
  });

  test('A recording is tested', async ({ page }) => {
    await page.locator('#recStart').click();

    await page.keyboard.press('a');
    await page.waitForTimeout(200); 
    await page.keyboard.press('s');
    await page.waitForTimeout(200);
    await page.keyboard.press('d');
    await page.waitForTimeout(200);

    await page.locator('#recStop').click();

    await expect(page.locator('#playStart')).toBeEnabled();
    await expect(page.locator('#recClear')).toBeEnabled();

    await page.locator('#playStart').click();
    
    await expect(page.locator('#playStart')).toBeDisabled();
    await expect(page.locator('#playStop')).toBeEnabled();
    await expect(page.locator('#recStart')).toBeDisabled(); 
  });

  test('Clear  resets the UI', async ({ page }) => {
    await page.locator('#recStart').click();
    await page.keyboard.press('a');
    await page.locator('#recStop').click();

    await expect(page.locator('#playStart')).toBeEnabled();
    await expect(page.locator('#recClear')).toBeEnabled();

    await page.locator('#recClear').click();

    await expect(page.locator('#playStart')).toBeDisabled();
    await expect(page.locator('#recClear')).toBeDisabled();
  });

});
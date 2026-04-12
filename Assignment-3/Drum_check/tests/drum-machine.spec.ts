
import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';

test.describe('Drum Machine State Engine', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  // --- Basic State Engine Tests ---
  test('Buttons in normal mode: start is enabled', async ({ page }) => {
    await expect(page.locator('#recStart')).toBeEnabled();
    await expect(page.locator('#recStart')).toHaveText('start');
    await expect(page.locator('#playStart')).toBeDisabled();
  });

  test('When recording is enabled: start is disabled', async ({ page }) => {
    await page.locator('#recStart').click();
    await expect(page.locator('#recStart')).toBeDisabled();
    await expect(page.locator('#recPause')).toBeEnabled();
  });

  test('When pause button is enabled ,the start button flips to resume button and when resume is enabled the start button will be disabled ', async ({ page }) => {
    await page.locator('#recStart').click();
    await page.locator('#recPause').click();
    await expect(page.locator('#recStart')).toBeEnabled();
    await expect(page.locator('#recStart')).toHaveText('resume');

    await page.locator('#recStart').click();
    await expect(page.locator('#recStart')).toBeDisabled();
  });

  test('Clear resets the UI (with modal confirmation)', async ({ page }) => {
    await page.locator('#recStart').click();
    await page.keyboard.press('a');
    await page.locator('#recStop').click();
// Click clear - triggers the async modal
    await page.locator('#recClear').click();
    await page.locator('#modalConfirm').click();
// ACTION NEEDED: Confirm the deletion in the modal!
    await expect(page.locator('#playStart')).toBeDisabled();
    await expect(page.locator('#recClear')).toBeDisabled();
  });

  // --- Customization Suite ---
  test.describe('Drum Machine Customization', () => {

    test('Customize toggle controls button states correctly', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await expect(page.locator('#editKeysBtn')).toBeEnabled();
      await expect(page.locator('#deleteKeysBtn')).toBeEnabled();

      await page.locator('#customizeToggle').dispatchEvent('click');
      await expect(page.locator('#editKeysBtn')).toBeDisabled();
      await expect(page.locator('#deleteKeysBtn')).toBeDisabled();
    });

    test('Edit Keys: Successfully change a key mapping', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await page.locator('#editKeysBtn').click();

      const firstInput = page.locator('.edit-key-input').first();
      await firstInput.fill('Q');
      await page.locator('#saveEditBtn').click();

      await expect(page.locator('.key').first()).toHaveText(/Q/);
    });

    test('Edit Keys: Validation prevents duplicate keys', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await page.locator('#editKeysBtn').click();

      const inputs = page.locator('.edit-key-input');
      await inputs.nth(0).fill('A');
      await inputs.nth(1).fill('A');
      
      await page.locator('#saveEditBtn').click();
      await expect(page.locator('#editError')).toBeVisible();
    });

    test('Delete Keys: Successfully remove a drum pad', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await page.locator('#deleteKeysBtn').click();

      await page.locator('.delete-checkbox').nth(1).dispatchEvent('click');
      await page.locator('#saveDeleteBtn').click();

      await expect(page.locator('.key')).toHaveCount(8);
    });

    test('Default Toggle: Restores layout after customization', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await page.locator('#deleteKeysBtn').click();
      await page.locator('.delete-checkbox').first().dispatchEvent('click');
      await page.locator('#saveDeleteBtn').click();

      // Click Default Toggle and confirm in modal
      await page.locator('#defaultToggle').dispatchEvent('click');
      await page.locator('#modalConfirm').click(); 

      await expect(page.locator('#customizeToggle')).not.toBeChecked();
      await expect(page.locator('.key')).toHaveCount(9);
    });

    test('Default Toggle: Cancel reset keeps custom layout', async ({ page }) => {
      await page.locator('#customizeToggle').dispatchEvent('click');
      await page.locator('#deleteKeysBtn').click();
      await page.locator('.delete-checkbox').first().dispatchEvent('click');
      await page.locator('#saveDeleteBtn').click();

      // Click Default Toggle and cancel in modal
      await page.locator('#defaultToggle').dispatchEvent('click');
      await page.locator('#modalCancel').click(); 

      await expect(page.locator('.key')).toHaveCount(8);
      await expect(page.locator('#defaultToggle')).not.toBeChecked();
    });
  });
});
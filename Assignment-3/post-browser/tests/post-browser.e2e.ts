import { test, expect } from '@playwright/test';

test.describe('Post Browser E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app (Playwright will use the baseURL from config)
    await page.goto('/');
  });

  test('1. Initial load - should show the first post', async ({ page }) => {
    await expect(page.locator('.post-id')).toContainText('Post #1');
    await expect(page.locator('.post-title')).not.toBeEmpty();
  });

  test('2. Navigation - prev and next buttons', async ({ page }) => {
    // Click Next
    await page.click('#next-btn');
    await expect(page.locator('.post-id')).toContainText('Post #2');

    // Click Previous
    await page.click('#prev-btn');
    await expect(page.locator('.post-id')).toContainText('Post #1');
  });
  // 3. Error Scenarios (Post & Comments)
  test('3a. Error scenario - post fetch failure', async ({ page }) => {
  // Use fulfill with 500 to simulate a server crash/error
  await page.route('**/posts/2', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Internal Server Error" })
    });
  });

  await page.click('#next-btn');
  await expect(page.locator('.error')).toBeVisible();
});

  test('3b. Error scenario - comment fetch failure', async ({ page }) => {
  // Mock a structured server error
  await page.route('**/comments', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' })
    });
  });

  await page.click('#view-comments');
  
  // Highlighting: Ensure your UI actually updates the button text to this exact string
  await expect(page.locator('#view-comments')).toHaveText('Error loading comments');
});
test('4. Refresh - resets to 1st post and clears data', async ({ page }) => {
  // 1. Move away from state #1
  await page.click('#next-btn'); 
  // Wait for the UI to definitely show Post #2
  await expect(page.locator('.post-id')).toHaveText(/Post #2/); 

  // 2. Click Refresh
  await page.click('#refresh-btn');
  
  // 3. Instead of waiting for navigation, just expect the text to flip back.
  // Playwright's 'toHaveText' has a built-in "wait and retry" logic.
  await expect(page.locator('.post-id')).toHaveText(/Post #1/);
});
});
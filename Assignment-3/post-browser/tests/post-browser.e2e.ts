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
    await page.route('**/posts/2', route => route.abort());
    await page.click('#next-btn');
    await expect(page.locator('.error')).toBeVisible();
  });

  test('3b. Error scenario - comment fetch failure', async ({ page }) => {
    // Mock comment failure
    await page.route('**/comments', route => route.fulfill({ status: 500 }));
    await page.click('#view-comments');
    await expect(page.locator('#view-comments')).toHaveText('Error loading comments');
  });

  // 4. Refresh (Matching your requirement: Reset to Post 1)
  test('4. Refresh - resets to 1st post and clears data', async ({ page }) => {
    await page.click('#next-btn'); 
    
    // Trigger Refresh
    await page.click('#refresh-btn');
    
    // If your app resets currentId to 1 on refresh:
    await expect(page.locator('.post-id')).toContainText('Post #1');
  });
});

  
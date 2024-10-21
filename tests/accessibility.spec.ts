import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; 

test.describe('homepage', () => { 
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:4321/'); 

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 

    expect(accessibilityScanResults.violations).toEqual([]); 
  });
});


test.describe("modal dialog", () => {
  test("The modal should open and don't have accessibility issues", async ({ page }) => {
    await page.goto("http://localhost:4321/");
    const modalBtn = await page.waitForSelector("id=open-modal");
    await modalBtn.click();
    // await page.locator("id=close-modal").focus
    // await page.locator("id=close-modal").blur()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("#modal-wrapper")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  })
})
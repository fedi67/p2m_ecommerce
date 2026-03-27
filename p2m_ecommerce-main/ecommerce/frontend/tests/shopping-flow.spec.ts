import { test, expect } from '@playwright/test';

// Replace this with your actual local React development URL
const BASE_URL = 'http://localhost:5174'; 

test('Complete User Shopping Flow', async ({ page }) => {

  // 1. Make a new account
  //await test.step('Register a new account', async () => {
    //await page.goto(`${BASE_URL}/`); 
    
    // Fill out the registration form (Replace selectors with your actual HTML attributes)
    //await page.click('button:has-text("S inscrire")');
    //await page.fill('input[name="first_name"]', 'John');
    //await page.fill('input[name="email"]', 'hopper@example.com');
    //await page.locator('select[name="gender"]').selectOption('H');
    //await page.fill('input[name="age"]', '22');
    //await page.fill('input[name="country"]', 'Tunisia');
    //await page.fill('input[name="password"]', 'superSecret123!');
    //await page.click('button:has-text("CONFIRMER L ADHESION")');
    
    // Verify successful registration by checking the URL or a success message
    //await expect(page.locator('text=Adhésion confirmée. Bienvenue au Studio.')).toBeVisible();
  //});

  // 2. Log in
  await test.step('Log into the account', async () => {
    await page.goto(`${BASE_URL}/Login`);
    
    await page.fill('input[name="email"]', 'hopper@example.com');
    await page.fill('input[name="password"]', 'superSecret123!');
    await page.click('button:has-text("S IDENTIFIER")');
    
    // Ensure the login was successful (e.g., looking for a welcome message or profile icon)
    await expect(page).toHaveURL(/.*admin|.*profile/);
  });

  // 3. Prompt for recommended clothing
  await test.step('Find recommended clothing', async () => {
    // Navigate to wherever your recommendations are triggered
    await page.goto(`${BASE_URL}/Shop`);
    
    // Simulate searching or clicking a "Recommendations" filter
    await page.fill('input[placeholder="Échangez avec votre styliste..."]', 'im looking for some trousers');
    await page.locator('button:has-text("➜")').click();
    
    // Wait for the React app to fetch data from FastAPI and render the items
    // (Assuming your clothing cards have a class like 'clothing-card')
    const clothingItems = page.locator('.reveal');
    // Playwright will keep checking the count until it is no longer 0
    await expect(clothingItems).not.toHaveCount(0, { timeout: 15000 });
  });

  // 4. Put an article in the cart
  await test.step('Add recommended item to cart', async () => {
    // Grab the very first clothing item on the page
    const firstItem = page.locator('.mood-card-container').first();
    
    // Assuming you are already scoped to the product card (e.g., firstItem)
    // This finds the div with the flex display, then clicks the very first span inside it

    await firstItem.hover();

    await firstItem.locator('span').first().click();

    // 1. SET UP THE LISTENER FIRST 
    // This tells Playwright what to do the moment the alert appears
    page.once('dialog', async dialog => {
      // Optional: Verify the text says what you expect
        expect(dialog.message()).toContain('ajouté au panier'); 
      
      // THIS IS HOW YOU CLICK "OK"
        await dialog.accept(); 
    });
    
    // 2. NOW CLICK THE BUTTON
    // This triggers the alert, and Playwright immediately runs the listener above
    await firstItem.getByRole('button', { name: 'AJOUTER AU PANIER' }).click();

    await page.goto(`${BASE_URL}/`);

    await page.click('div[class=cart-icon-pro]');
    
    // Optional: Check for a success toast notification
    //await expect(page.locator('text=Item added to cart')).toBeVisible();
  });

});
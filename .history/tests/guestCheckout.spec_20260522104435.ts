import { test, expect } from '@playwright/test';
import { HomePage }          from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage }       from '../pages/ProductPage';
import { CartPage }          from '../pages/CartPage';
import { CheckoutPage }      from '../pages/CheckoutPage';
import { ConfirmationPage }  from '../pages/ConfirmationPage';
import { TEST_GUEST, SEARCH_QUERY } from '../fixtures/testData';

/**
 * TC-P01 – Happy Path: Guest Checkout with Cash on Delivery
 *
 * Automates the core user flow:
 *   1. Open storefront
 *   2. Search for a product
 *   3. Add it to the cart
 *   4. Proceed to guest checkout
 *   5. Fill in address details
 *   6. Select "Cash on delivery"
 *   7. Place order and assert confirmation
 */
test.describe('TC-P01 – Guest Checkout (Cash on Delivery)', () => {

  test('should complete a full guest checkout successfully', async ({ page }) => {
    const home         = new HomePage(page);
    const results      = new SearchResultsPage(page);
    const productPage  = new ProductPage(page);
    const cart         = new CartPage(page);
    const checkout     = new CheckoutPage(page);
    const confirmation = new ConfirmationPage(page);

    // ── Step 1: Open storefront ─────────────────────────────────────────────
    await home.goto();
    await expect(page).toHaveURL(/shopware6-demo/, { timeout: 15_000 });
    await expect(page).toHaveTitle(/.+/); // page has a non-empty title

    // ── Step 2: Search for a product ────────────────────────────────────────
    await home.searchFor(SEARCH_QUERY);
    await results.waitForResults();
    await expect(page).toHaveURL(/search/);

    // ── Step 3: Open first product detail page ──────────────────────────────
    await results.clickFirstProduct();
    await productPage.waitForPage();
    const productName = await productPage.getProductName();
    expect(productName.length).toBeGreaterThan(0); // product name is visible

    // ── Step 4: Add product to cart ─────────────────────────────────────────
    await productPage.addToCart();

    // ── Step 5: Navigate to cart and verify item ─────────────────────────────
    await cart.goto();
    await cart.waitForCart();
    const itemCount = await cart.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1); // at least one item in cart

    // ── Step 6: Begin checkout ───────────────────────────────────────────────
    await cart.beginCheckout();
    // After clicking, we expect to be on the register/login page or address form
    await expect(page).toHaveURL(/checkout|account\/register/, { timeout: 15_000 });

    // ── Step 7: Fill guest address form ─────────────────────────────────────
    await checkout.fillGuestAddress(TEST_GUEST);
    await checkout.submitAddressForm();

    // After submitting, we expect to be past the registration step
    await expect(page).toHaveURL(/checkout\/confirm|checkout\/address/, { timeout: 15_000 });

    // ── Step 8: Select Cash on Delivery ─────────────────────────────────────
    await checkout.selectCashOnDelivery();

    // ── Step 9: Place the order ──────────────────────────────────────────────
    await checkout.confirmOrder();

    // ── Step 10: Assert order confirmation ──────────────────────────────────
    await confirmation.assertSuccess();

    const orderNumber = await confirmation.getOrderNumber();
    expect(orderNumber.length).toBeGreaterThan(0); // order number is present
  });

});

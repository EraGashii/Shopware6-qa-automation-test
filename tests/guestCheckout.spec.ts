import { test, expect } from '@playwright/test';
import { HomePage }          from '../pages/HomePage';
import { ProductPage }       from '../pages/ProductPage';
import { CartPage }          from '../pages/CartPage';
import { CheckoutPage }      from '../pages/CheckoutPage';
import { ConfirmationPage }  from '../pages/ConfirmationPage';
import { TEST_GUEST } from '../fixtures/testData';

/**
 * TC-P01 – Happy Path: Guest Checkout with Cash on Delivery
 *
 * Automates the core user flow:
 *   1. Open storefront
 *   2. Open an available product
 *   3. Add it to the cart
 *   4. Proceed to guest checkout
 *   5. Fill in address details
 *   6. Select "Cash on delivery"
 *   7. Place order and assert confirmation
 */
test.describe('TC-P01 – Guest Checkout (Cash on Delivery)', () => {

  test('should complete a full guest checkout successfully', async ({ page }) => {
    const home         = new HomePage(page);
    const productPage  = new ProductPage(page);
    const cart         = new CartPage(page);
    const checkout     = new CheckoutPage(page);
    const confirmation = new ConfirmationPage(page);

    // ── Step 1: Open storefront ─────────────────────────────────────────────
    await home.goto();
    await home.acceptCookiesIfVisible();

    await expect(page).toHaveURL(/shopware6-demo/, { timeout: 15_000 });
    await expect(page).toHaveTitle(/.+/);

    // ── Step 2: Open demo product detail page ──────────────────────────────
    await home.openDemoProduct();
    await productPage.waitForPage();

    const productName = await productPage.getProductName();
    expect(productName.length).toBeGreaterThan(0);

    // ── Step 3: Add product to cart ─────────────────────────────────────────
    await productPage.addToCart();

    // ── Step 4: Navigate to cart and verify item ────────────────────────────
    await cart.goto();
    await cart.waitForCart();

    const itemCount = await cart.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);

    // ── Step 5: Begin checkout ──────────────────────────────────────────────
    await cart.beginCheckout();
    await expect(page).toHaveURL(/checkout|account\/register/, { timeout: 15_000 });

    // ── Step 6: Fill guest address form ─────────────────────────────────────
    await checkout.fillGuestAddress(TEST_GUEST);
    await checkout.submitAddressForm();

    await expect(page).toHaveURL(/checkout\/confirm|checkout\/address/, { timeout: 15_000 });

    // ── Step 7: Select Cash on Delivery ─────────────────────────────────────
    await checkout.selectCashOnDelivery();

    // ── Step 8: Place the order ─────────────────────────────────────────────
    await checkout.confirmOrder();

    // ── Step 9: Assert order confirmation ───────────────────────────────────
    await confirmation.assertSuccess();

    const orderNumber = await confirmation.getOrderNumber();
    expect(orderNumber.length).toBeGreaterThan(0);
  });

});
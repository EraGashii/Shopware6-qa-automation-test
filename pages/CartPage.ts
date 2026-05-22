import { type Page, type Locator, expect } from '@playwright/test';

/**
 * CartPage – /checkout/cart
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly beginCheckoutBtn: Locator;
  readonly emptyCartMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart-item, .line-item, [data-cart-item]');
    this.beginCheckoutBtn = page.locator(
      'a[href*="/checkout/confirm"], a:has-text("Begin checkout"), ' +
      'a:has-text("Proceed to checkout"), .begin-checkout-btn, a:has-text("Zur Kasse")'
    ).first();
    this.emptyCartMsg = page.locator(
      '.cart-empty, :text("Your shopping cart is empty"), :text("Ihr Warenkorb ist leer")'
    ).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCart(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async beginCheckout(): Promise<void> {
    await this.beginCheckoutBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(this.beginCheckoutBtn).toBeEnabled();
    await this.beginCheckoutBtn.click();
  }
}

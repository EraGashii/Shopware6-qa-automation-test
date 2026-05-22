import { type Page, type Locator, expect } from '@playwright/test';

/**
 * HomePage – Shopware 6 storefront home / search
 */
export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchSubmitBtn: Locator;
  readonly cartLink: Locator;
  readonly cartItemCount: Locator;

  constructor(page: Page) {
    this.page = page;
    // Shopware 6 search bar (stable attribute selectors)
    this.searchInput = page.locator('input[name="search"]');
    this.searchSubmitBtn = page.locator('button[type="submit"].header-search-btn, .search-btn, button[aria-label*="search" i]').first();
    this.cartLink = page.locator('[data-offcanvas-cart="true"], .header-cart, a[href*="/checkout/cart"]').first();
    this.cartItemCount = page.locator('.header-cart-badge, .cart-count, [data-cart-count]').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/shopware6-demo/);
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}

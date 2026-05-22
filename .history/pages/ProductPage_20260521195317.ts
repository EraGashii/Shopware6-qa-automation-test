import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ProductPage – individual product detail page
 */
export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly addToCartBtn: Locator;
  readonly cartNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('.product-detail-name, h1.product-name, [itemprop="name"]').first();
    // Shopware 6 "Add to cart" button
    this.addToCartBtn = page.locator(
      'button[type="submit"].btn-buy, .product-detail-buy button[type="submit"], ' +
      'button:has-text("Add to cart"), button:has-text("In den Warenkorb")'
    ).first();
    // Success flash / offcanvas notification after adding
    this.cartNotification = page.locator(
      '.flashbag-notification, .offcanvas-cart, [data-offcanvas-cart], .alert-success'
    ).first();
  }

  async waitForPage(): Promise<void> {
    await this.productTitle.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async getProductName(): Promise<string> {
    return (await this.productTitle.textContent())?.trim() ?? '';
  }

  async addToCart(): Promise<void> {
    await this.addToCartBtn.waitFor({ state: 'visible' });
    await this.addToCartBtn.click();
    // Wait for the cart overlay or success indicator
    await this.page.waitForTimeout(1500); // brief pause for Shopware's AJAX
  }
}

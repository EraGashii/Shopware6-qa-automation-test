import { type Page, type Locator, expect } from '@playwright/test';

/**
 * SearchResultsPage – product listing / search results
 */
export class SearchResultsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly firstProduct: Locator;

  constructor(page: Page) {
    this.page = page;
    // Shopware 6 product cards in search results / category listing
    this.productCards = page.locator('.product-box, .card.product-card, [data-product-id]');
    this.firstProduct = this.productCards.first();
  }

  async waitForResults(): Promise<void> {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 15_000 });
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(0);
  }

  async clickFirstProduct(): Promise<void> {
    await this.firstProduct.locator('a').first().click();
  }
}

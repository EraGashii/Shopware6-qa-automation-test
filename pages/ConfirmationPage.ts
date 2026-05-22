import { type Page, expect } from '@playwright/test';

/**
 * ConfirmationPage – order success page shown after placing order
 */
export class ConfirmationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout\/finish|account\/order/, {
      timeout: 20_000,
    });
  }

  async getOrderNumber(): Promise<string> {
    return this.page.url();
  }
}
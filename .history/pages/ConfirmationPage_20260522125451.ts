import { type Page, type Locator, expect } from '@playwright/test';

/**
 * ConfirmationPage – order success page shown after placing order
 */
export class ConfirmationPage {
  readonly page: Page;
  readonly orderNumber: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successHeading = page.locator(
      'h1:has-text("Thank you"), h2:has-text("Thank you"), ' +
      '.finish-ordernumber, .checkout-finish-header, ' +
      '[class*="finish"], h1:has-text("Danke")'
    ).first();
    this.orderNumber = page.locator(
      '.finish-ordernumber strong, .order-number, ' +
      '[data-order-number], :text-matches("\\d{5,}", "g")'
    ).first();
  }

  async assertSuccess(): Promise<void> {
    // URL should contain /checkout/finish
    await expect(this.page).toHaveURL(/checkout\/finish|account\/order/, { timeout: 20_000 });
    await this.successHeading.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async getOrderNumber(): Promise<string> {
    await this.orderNumber.waitFor({ state: 'visible', timeout: 10_000 });
    return (await this.orderNumber.textContent())?.trim() ?? '';
  }
}

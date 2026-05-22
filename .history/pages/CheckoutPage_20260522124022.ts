import { type Page, type Locator } from '@playwright/test';
import type { GuestAddress } from '../fixtures/testData';

/**
 * CheckoutPage – guest checkout + order confirmation
 */
export class CheckoutPage {
  readonly page: Page;
  readonly guestLoginTab: Locator;
  readonly guestEmailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cityInput: Locator;
  readonly countrySelect: Locator;
  readonly continueButton: Locator;
  readonly cashOnDeliveryOption: Locator;
  readonly confirmOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.guestLoginTab = page.locator(
      '[data-guest-login="true"], .guest-login, .checkout-as-guest'
    ).first();

    this.guestEmailInput = page.locator(
      '#guestMail:visible, #personalMail:visible, input[type="email"]:visible'
    ).first();

    this.firstNameInput = page.locator(
      '#billingAddressAddressFirstName, input[name*="firstName"]'
    ).first();

    this.lastNameInput = page.locator(
      '#billingAddressAddressLastName, input[name*="lastName"]'
    ).first();

    this.streetInput = page.locator(
      '#billingAddressAddressStreet, input[name*="street"]'
    ).first();

    this.zipCodeInput = page.locator(
      '#billingAddressAddressZipcode, input[name*="zipcode"]'
    ).first();

    this.cityInput = page.locator(
      '#billingAddressAddressCity, input[name*="city"]'
    ).first();

    this.countrySelect = page.locator(
      '#billingAddressAddressCountry, select[name*="country"]'
    ).first();

    this.continueButton = page.locator(
      'button[type="submit"], button:has-text("Continue"), button:has-text("Weiter")'
    ).first();

    this.cashOnDeliveryOption = page.locator(
      'label:has-text("Cash on delivery"), label:has-text("Nachnahme")'
    ).first();

    this.confirmOrderButton = page.locator(
      '#confirmFormSubmit, button:has-text("Place order"), button:has-text("Submit order")'
    ).first();
  }

  async fillGuestAddress(address: GuestAddress): Promise<void> {
    const guestTab = this.guestLoginTab;

    if (await guestTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await guestTab.click();
    }

    const guestOption = this.page.getByText(
      /Guest checkout|Als Gast bestellen|Without customer account/i
    );

    if (await guestOption.isVisible().catch(() => false)) {
      await guestOption.click();
    }

    await this.guestEmailInput.waitFor({
      state: 'visible',
      timeout: 15_000,
    });

    await this.guestEmailInput.fill(address.email);
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.streetInput.fill(address.street);
    await this.zipCodeInput.fill(address.zipCode);
    await this.cityInput.fill(address.city);

    if (await this.countrySelect.isVisible().catch(() => false)) {
      await this.countrySelect.selectOption({ label: address.country });
    }
  }

  async submitAddressForm(): Promise<void> {
    await this.continueButton.click();
  }

  async selectCashOnDelivery(): Promise<void> {
    if (await this.cashOnDeliveryOption.isVisible().catch(() => false)) {
      await this.cashOnDeliveryOption.click();
    }
  }

  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
  }
}
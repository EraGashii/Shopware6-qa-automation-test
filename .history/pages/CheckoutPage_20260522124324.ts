import { type Page, type Locator, expect } from '@playwright/test';

export interface GuestAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zipCode: string;
  city: string;
  /** ISO country name as shown in Shopware dropdown, e.g. "Germany" */
  country?: string;
}

/**
 * CheckoutPage – guest registration form + payment selection.
 *
 * Shopware 6 guest checkout can be a multi-step process.
 * This page object handles both the address form step and
 * the payment / order-confirm step.
 */
export class CheckoutPage {
  readonly page: Page;

  // ── Guest registration form ──────────────────────────────────────────────
  readonly guestLoginTab: Locator;
  readonly guestEmailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cityInput: Locator;
  readonly countrySelect: Locator;
  readonly continueAsGuestBtn: Locator;

  // ── Payment / confirm step ───────────────────────────────────────────────
  readonly cashOnDeliveryOption: Locator;
  readonly confirmOrderBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Shopware 6 uses #personalMail, #billingAddressAddressFirstName, etc.
    this.guestLoginTab = page.locator(
      'a:has-text("Guest"), button:has-text("Guest"), ' +
      '.checkout-login-as-guest, [data-guest-registration]'
    ).first();

  this.guestEmailInput = page.locator(
  '#guestMail:visible, #personalMail:visible, input[type="email"]:visible'
).first();

    this.firstNameInput = page.locator(
      '#billingAddressAddressFirstName, input[name="billingAddress[firstName]"], ' +
      'input[id*="FirstName"]'
    ).first();

    this.lastNameInput = page.locator(
      '#billingAddressAddressLastName, input[name="billingAddress[lastName]"], ' +
      'input[id*="LastName"]'
    ).first();

    this.streetInput = page.locator(
      '#billingAddressAddressStreet, input[name="billingAddress[street]"], ' +
      'input[id*="Street"]'
    ).first();

    this.zipCodeInput = page.locator(
      '#billingAddressAddressZipcode, input[name="billingAddress[zipcode]"], ' +
      'input[id*="Zipcode"], input[id*="zipCode"]'
    ).first();

    this.cityInput = page.locator(
      '#billingAddressAddressCity, input[name="billingAddress[city]"], ' +
      'input[id*="City"]'
    ).first();

    this.countrySelect = page.locator(
      '#billingAddressAddressCountry, select[name="billingAddress[countryId]"], ' +
      'select[id*="Country"]'
    ).first();

    // "Continue as Guest" / register button
    this.continueAsGuestBtn = page.locator(
      'button[type="submit"]:has-text("Continue"), ' +
      'button[type="submit"]:has-text("Register"), ' +
      'button[type="submit"]:has-text("Weiter"), ' +
      '.checkout-aside-container button[type="submit"]'
    ).first();

    // ── Payment ────────────────────────────────────────────────────────────
    // Cash on Delivery option (radio or visible label)
    this.cashOnDeliveryOption = page.locator(
      'input[type="radio"]:near(label:has-text("Cash on delivery")), ' +
      'label:has-text("Cash on delivery"), ' +
      'label:has-text("Nachnahme"), ' +
      '.payment-method-label:has-text("Cash")'
    ).first();

    this.confirmOrderBtn = page.locator(
      'button:has-text("Place order"), button:has-text("Order now"), ' +
      'button:has-text("Zahlungspflichtig bestellen"), ' +
      'button[type="submit"].confirm-order-submit'
    ).first();
  }

  async fillGuestAddress(address: GuestAddress): Promise<void> {
    
    // Some Shopware versions show a "continue as guest" link first
    const guestTab = this.guestLoginTab;
    if (await guestTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await guestTab.click();
    }

    await this.guestEmailInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.guestEmailInput.fill(address.email);
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.streetInput.fill(address.street);
    await this.zipCodeInput.fill(address.zipCode);
    await this.cityInput.fill(address.city);

    if (address.country) {
      await this.countrySelect.selectOption({ label: address.country });
    }
  }

  async submitAddressForm(): Promise<void> {
    await this.continueAsGuestBtn.waitFor({ state: 'visible' });
    await this.continueAsGuestBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCashOnDelivery(): Promise<void> {
    await this.cashOnDeliveryOption.waitFor({ state: 'visible', timeout: 10_000 });
    await this.cashOnDeliveryOption.click();

    // Confirm payment method is now selected
    const radioSibling = this.page.locator(
      'input[type="radio"]:near(label:has-text("Cash on delivery")), ' +
      'input[type="radio"]:near(label:has-text("Nachnahme"))'
    ).first();
    if (await radioSibling.count() > 0) {
      await expect(radioSibling).toBeChecked({ timeout: 5_000 });
    }
  }

  async confirmOrder(): Promise<void> {
    await this.confirmOrderBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await expect(this.confirmOrderBtn).toBeEnabled();
    await this.confirmOrderBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}

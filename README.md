# Shopware 6 – Automated E2E Test
**QA / Automation Tester Intern Exercise · Solution25**

---

## What This Tests

Automates **TC-P01 – Happy Path Guest Checkout with Cash on Delivery**:

1. Opens the Shopware 6 demo storefront  
2. Opens an available demo product directly from the storefront
3. Opens the product detail page and adds it to the cart  
4. Navigates to the cart and verifies the item is present  
5. Proceeds through guest checkout, filling in address details  
6. Selects "Cash on Delivery" as the payment method  
7. Places the order and validates successful checkout flow

---

## Target Environment

```
https://www.shopware6-demo.development-s25.com/
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (first time only)
npx playwright install --with-deps chromium firefox
```

---

## Running the Tests

```bash
# Run all tests (headless, Chromium + Firefox)
npx playwright test

# Run in headed mode (watch the browser)
npx playwright test --headed

# Run only on Chromium
npx playwright test --project=chromium

# Run with HTML report
npx playwright test --reporter=html
npx playwright show-report
```

---

## Project Structure

```
Shopware6-qa-automation-test/
├── playwright.config.ts       # Playwright config (browsers, base URL, timeouts)
├── tests/
│   └── guestCheckout.spec.ts  # TC-P01 end-to-end test
├── pages/                     # Page Object Model
│   ├── HomePage.ts
│   ├── SearchResultsPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── ConfirmationPage.ts
└── fixtures/
    └── testData.ts            # Shared test data (guest address, search query)
```

---

## Design Decisions

### Page Object Model
Each page has its own class with stable locator strategies. Selectors prefer:
- Shopware's native IDs (`#billingAddressAddressFirstName`, etc.)
- Semantic roles and `has-text()` matchers
- `data-*` attributes where available  

Fragile nth-child chains are avoided.

### Assertions
Every major step has a meaningful assertion (URL checks, element visibility, cart validation, checkout navigation) — not just "the page loaded".

### Retries
`retries: 1` in config handles occasional network flakiness on the public demo, without masking real failures.

---

## What I Would Improve Given More Time

1. Improve confirmation page assertions by validating a visible confirmation message or generated order number if consistently available in the demo environment.
2. **More test cases** – TC-P02 through TC-N04 from the test plan, especially the negative cases (empty cart, missing fields, invalid email).
3. **Product availability guard** – If the demo store has no stock, the test fails misleadingly. A setup step that confirms stock before running would make failures clearer.
4. **CI integration** – Add a `.github/workflows/playwright.yml` to run tests on push/PR with artifact upload for the HTML report.
5. **Environment variables** – Move `baseURL` and guest data to `.env` so the suite can target a local instance without touching code.
6. **Visual regression** – Add screenshot comparison on the confirmation page to catch layout regressions.

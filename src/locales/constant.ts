export const AMAZON_CONFIG = {
  baseUrl: "https://www.amazon.in",
  loginSelectors: {
    signInButton: "#nav-link-accountList",
    emailField: "#ap_email",
    continueButton: "#continue",
    passwordField: "#ap_password",
    submitButton: "#signInSubmit",
    mfaCheck: "#nav-link-accountList-nav-line-1",
  },
  ordersSelectors: {
    ordersButton: "#nav-orders",
    ordersContainer: ".a-box-group",
    productTitle: ".yohtmlc-product-title",
    productPrice: ".currencyINRFallback",
    purchaseDetails: ".a-size-base.a-color-secondary",
    productLink: ".a-link-normal",
  },
  timeout: {
    pageLoad: 60000,
    login: 150000,
    mfaWait: 300000,
    navigation: 90000,
  },
};

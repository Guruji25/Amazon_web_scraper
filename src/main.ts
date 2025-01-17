import { chromium } from "playwright";
import * as readline from "readline";
import { AMAZON_CONFIG } from "./locales/constant";

const promptUser = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
};

const scrapeAmazonOrders = async () => {

  const username = await promptUser("Enter your Amazon email: ");
  const password = await promptUser("Enter your Amazon password: ");

  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("https://www.amazon.in/gp/css/order-history", { timeout: 60000 });

    await page.waitForSelector(AMAZON_CONFIG.loginSelectors.emailField, { timeout: 150000 });

    await page.fill(AMAZON_CONFIG.loginSelectors.emailField, username);
    await page.click(AMAZON_CONFIG.loginSelectors.continueButton);
    await page.fill(AMAZON_CONFIG.loginSelectors.passwordField, password);
    await page.click(AMAZON_CONFIG.loginSelectors.submitButton);

    await page.click('#nav-orders', { timeout: 15000 });

    await page.waitForSelector('.a-box-group', { timeout: 90000 });

    const orders = await page.$$eval('.a-box-group', (orderElements) =>
      orderElements.slice(0, 10).map((order) => {
        const details = order.querySelectorAll('.a-size-base.a-color-secondary')
        const nameElement = order.querySelector('.yohtmlc-product-title');
        const priceElement = details[1]
        const date = details[0];
        const linkElement = order.querySelector('.a-link-normal');
        return {
          name: nameElement?.textContent?.trim() || "N/A",
          price: priceElement?.textContent?.trim() || "N/A",
          purchased_date: date?.textContent?.trim() || "N/A",
          link: linkElement
            ? `https://www.amazon.in/${linkElement.getAttribute("href")}`
            : "N/A",
        };
      })
    );

    // Final Output
    console.log("Result:", JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
};

scrapeAmazonOrders();
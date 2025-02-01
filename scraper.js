import { chromium } from "playwright";

async function getDetails(leetcodeID) {
  const userDataDir = "./chrome_data"; // Stores session data to avoid detection

  const browser = await chromium.launchPersistentContext(userDataDir, {
    channel: "chrome", // Use Chrome instead of Chromium
    headless: false, // Makes bot detection harder
    viewport: null, // Uses real screen size
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  // Set realistic headers
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });

  // Go to LeetCode profile
  await page.goto(`https://leetcode.com/u/${leetcodeID}/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000, // Handle slow loading
  });

  // Small delay to mimic human behavior
  await page.waitForTimeout(3000);

  // Log full page HTML for debugging
  const pageHTML = await page.content();
  console.log("Full HTML:\n", pageHTML);

  // Check if the user exists
  const userNotFound = await page.locator(
    ".text-label-2.dark\\:text-dark-label-2.text-xl.font-bold"
  ).isVisible();

  if (userNotFound) {
    console.log(`${leetcodeID} not found`);
    await browser.close();
    return null;
  }

  // Extract elements safely
  const elements = await page.locator(".text-sd-foreground.text-xs.font-medium").allTextContents();
  const imgLocator = page.locator(".h-20.w-20.rounded-lg.object-cover");
  const hasImage = await imgLocator.count();
  const imgSRC = hasImage > 0 ? await imgLocator.first().getAttribute("src") : null;
  const usernameE = await page.locator(
    ".text-label-1.dark\\:text-dark-label-1.break-all.text-base.font-semibold"
  ).textContent();

  // Parse values safely
  const values = elements.map(item => item.split("/")[0]);
  const total = values.reduce((acc, val) => acc + parseInt(val, 10), 0);
  const points = parseInt(values[0], 10) + parseInt(values[1], 10) * 2 + parseInt(values[2], 10) * 3;

  const result = {
    username: usernameE,
    image: imgSRC,
    solved: values,
    totalSolved: total,
    points: points,
  };

  console.log(result);
  return result;
}
export default getDetails;
getDetails("bhavyaCodes").then(() => process.exit());

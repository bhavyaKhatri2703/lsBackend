import { chromium } from 'patchright';

async function getDetails(leetcodeID) {
  const browser = await chromium.launch({ 
    headless: true }); // Initialize Playwright browser
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  });
  
  await page.goto(`https://leetcode.com/u/${leetcodeID}/`, {
    waitUntil: "networkidle"
  });

  const userNotFound = await page.locator(
    ".text-label-2.dark\\:text-dark-label-2.text-xl.font-bold"
  ).isVisible();
  
  if (userNotFound) {
    console.log(`${leetcodeID} not found`);
    await browser.close();
    return null;
  }

  const elements = await page.locator(".text-sd-foreground.text-xs.font-medium").allTextContents();
  const imgElement = await page.locator(".h-20.w-20.rounded-lg.object-cover")
  const usernameE = await page.locator(
    ".text-label-1.dark\\:text-dark-label-1.break-all.text-base.font-semibold"
  )

  console.log(elements);
  console.log(imgElement);
  console.log(usernameE)

  const imgSRC = imgElement ? await imgElement.evaluate((el) => el.src) : null;
  const name = usernameE
  ? await usernameE.evaluate((el) => el.textContent)
  : null;

  const values = elements.map(item => item.split("/")[0]);
  
  const total = values.reduce((acc, val) => acc + parseInt(val, 10), 0);
  const points = parseInt(values[0], 10) + parseInt(values[1], 10) * 2 + parseInt(values[2], 10) * 3;

  const result = {
    username: name,
    image: imgSRC,
    solved: values,
    totalSolved: total,
    points: points,
  };

  await browser.close();
  console.log(result);
  return result;
}

export default getDetails;

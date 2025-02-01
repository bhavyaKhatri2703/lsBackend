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

  const pageHTML = await page.content();
  console.log("Full HTML:\n", pageHTML);

  const userNotFound = await page.$(
    ".text-label-2.dark\\:text-dark-label-2.text-xl.font-bold"
  );
  if (userNotFound) {
    console.log(`${leetcodeID} not found`)
    await browser.close();
    return null;
  }

  const elements = await page.$$(".text-sd-foreground.text-xs.font-medium");
  const imgElement = await page.$(".h-20.w-20.rounded-lg.object-cover");
  const usernameE = await page.$(
    ".text-label-1.dark\\:text-dark-label-1.break-all.text-base.font-semibold"
  );



  const values = await Promise.all(
    elements.map((el) => el.evaluate((el) => el.textContent))
  );

  const value = values.map((item) => item.split("/")[0]);

  const imgSRC = imgElement ? await imgElement.evaluate((el) => el.src) : null;
  const name = usernameE
    ? await usernameE.evaluate((el) => el.textContent)
    : null;

  const total =
    parseInt(value[0], 10) + parseInt(value[1], 10) + parseInt(value[2], 10);
  const points =
    parseInt(value[0], 10) +
    parseInt(value[1], 10) * 2 +
    parseInt(value[2], 10) * 3;

  const result = {
    username: name,
    image: imgSRC,
    solved: value,
    totalSolved: total,
    points: points,
  };

  await browser.close();

 console.log("Values:", values);
 console.log("Image:", imgSRC);
 console.log("Username:", name);


  return result;
}
getDetails("bhavyaCodes")
export default getDetails;

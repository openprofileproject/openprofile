const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
  const userId = event.queryStringParameters.user_id;
  
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'user_id parameter is required' }),
    };
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(`${process.env.URL}/view.html?user_id=${userId}`, { waitUntil: 'networkidle0' });
    
    // Wait for the profile info to load
    await page.waitForSelector('#profile-info');

    const element = await page.$('#profile-info');
    const screenshot = await element.screenshot({ type: 'png' });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: screenshot.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate screenshot' }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
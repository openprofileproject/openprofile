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
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    console.log('Creating new page...');
    const page = await browser.newPage();
    
    const url = `${process.env.URL}/view.html?user_id=${userId}`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    console.log('Waiting for #profile-info selector...');
    await page.waitForSelector('#profile-info');

    console.log('Taking screenshot...');
    const element = await page.$('#profile-info');
    const screenshot = await element.screenshot({ type: 'png' });

    console.log('Screenshot taken successfully');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: screenshot.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Detailed error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate screenshot', details: error.message }),
    };
  } finally {
    if (browser !== null) {
      console.log('Closing browser');
      await browser.close();
    }
  }
};
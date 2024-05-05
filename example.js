// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

// To use Chromium
const puppeteerCore = require('puppeteer-core')

// Specify the Chromium executable path manually
const chromeExecutablePath = '/usr/bin/chromium-browser'; // Replace with actual browser if needed
async function findChromeExecutablePath() {}
findChromeExecutablePath();

// Specify the home directory
const homeDirectory = process.env.HOME;

// Specify the node project directory name
const nodeProject = "puppeteersigninheadless";

// puppeteer usage as normal
async function run () {
    const browser = await puppeteerCore.launch({
      executablePath: chromeExecutablePath,
      headless: 'new',
      userDataDir: `${homeDirectory}/${nodeProject}/userdata`,
      args: ['--disable-blink-features=AutomationControlled'] // Disable automation features
    });
    var [page] = await browser.pages();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0");  //  Necessary to make stealth plugin work with certain platforms

    let googlepageSuccess = true; //initialize the success flag to true
      try {
      // Navigate to the first page
      await page.goto('https://myaccount.google.com/');
      await new Promise(resolve => setTimeout(resolve, 5000))
    } catch (e) {
      googlepageSuccess = false; //set success flag to false if an error occurs
      console.log(e); //log the error message to the console
    }
    if(googlepageSuccess) {
      console.log('Opened Accounts page on Google.com.');
    } else {
      console.log('Did not open Accounts page on Google.com.');
    }

    // Set the cookies as extra HTTP headers
    const cookies = require(`${homeDirectory}/${nodeProject}/userdata/cookies.json`);
    await page.setExtraHTTPHeaders({
    'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
    });

//    The rest of your code goes here

    // Take a screenshot
    await page.screenshot({path: `${homeDirectory}/${nodeProject}/screenshot.png`});
    await browser.close();
}
run();

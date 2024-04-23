// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// specify what the home directory is
const homeDirectory = process.env.HOME;

//specify the node project directory name
const nodeProject = "puppeteersigninheadless";

// puppeteer usage as normal
async function run () {
    const browser = await puppeteer.launch({
      headless: 'new',
      userDataDir: '${homeDirectory}/${nodeProject}/userdata'
    });
    var [page] = await browser.pages();

    let googlepageSuccess = true; //initialize the success flag to true
      try {
      // Navigate to the first page
      await page.goto('https://myaccount.google.com/');
      await page.waitForTimeout(5000);
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

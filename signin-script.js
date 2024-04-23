// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// specify what the home directory is
const homeDirectory = process.env.HOME;

//specify the node project directory name (change puppeteersigninheadless if needed)
const nodeProject = "puppeteersigninheadless";

// puppeteer usage as normal
async function run () {
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: '${homeDirectory}/${nodeProject}/userdata'
    });
//    const page = await browser.newPage();
    var [page] = await browser.pages();
    await page.goto('about:blank');
    await page.waitForTimeout(10000);
    const cookies = await page.cookies();
    const fs = require('fs');
    fs.writeFileSync(`${homeDirectory}/${nodeProject}/userdata/cookies.json`, JSON.stringify(cookies));
}
run();
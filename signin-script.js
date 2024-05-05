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

// Specify the node project directory name (change puppeteersigninheadless if needed)
const nodeProject = "puppeteersigninheadless";

// puppeteer usage as normal
async function run() {
  const browser = await puppeteerCore.launch({
      executablePath: chromeExecutablePath,
      headless: false,
      userDataDir: `${homeDirectory}/${nodeProject}/userdata`,
      args: ['--disable-blink-features=AutomationControlled'] // Disable automation features
  });
  var [page] = await browser.pages();
  await page.goto('about:blank');

  // Wait for 10 seconds using setTimeout
  await new Promise(resolve => setTimeout(resolve, 10000));

  const cookies = await page.cookies();
  const fs = require('fs');
  fs.writeFileSync(`${homeDirectory}/${nodeProject}/userdata/cookies.json`, JSON.stringify(cookies));
}

run();

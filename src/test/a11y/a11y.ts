import puppeteer, { Browser } from 'puppeteer';
import { config } from '../config';

const pa11y = require('pa11y');

interface Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];
}

interface PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

jest.setTimeout(10000);
describe('Accessibility', () => {
  let browser: Browser;
  let hasAfterAllRun = false;

  const setup = async () => {
    if (hasAfterAllRun) {
      return;
    }
    if (browser) {
      await browser.close();
    }
    browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  };

  const signedOutUrls = ['/terms-and-conditions', '/accessibility-statement', '/cookies', '/not-found', '/'];

  beforeAll(setup);

  afterAll(async () => {
    hasAfterAllRun = true;
    await browser.close();
  });

  describe.each(signedOutUrls)('Signed out page %s', url => {
    test('should have no accessibility errors', async () => {
      const result: Pa11yResult = await pa11y(config.TEST_URL + url, {
        screenCapture: `functional-output/pa11y/${url}.png`,
        browser: browser,
      });
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    });
  });

  test('/browse page', async () => {
    console.log(config.TEST_URL);
    const testUrl = config.TEST_URL as string;
    const page = await browser.newPage();
    await page.goto(testUrl);
    await page.waitForSelector('#signInName', { visible: true, timeout: 0 });
    await page.type('#signInName', process.env.B2C_TEST_LOGIN_EMAIL as string);
    await page.type('#password', process.env.B2C_TEST_LOGIN_PASSWORD as string);
    await page.click('#next');
    // const cookies = await page.cookies(testUrl);
    await page.close();

    const result: Pa11yResult = await pa11y(testUrl + '/browse', {
      browser: browser,
      screenCapture: `functional-output/pa11y/browse.png`,
    });
    expect(result.issues).toEqual(expect.any(Array));
    expectNoErrors(result.issues);

    // const browsePage = await browser.newPage();
    // await browsePage.goto(testUrl);
    // await browsePage.waitForSelector('a[href^=/watch/]', { visible: true, timeout: 0 });
    // await browsePage.click('a[href^=/watch/]');
    // const watchUrl = browsePage.url();
    // await browsePage.close();
    //
    // const watchResult: Pa11yResult = await pa11y(watchUrl, {
    //   browser: browser,
    //   screenCapture: `functional-output/pa11y/watch.png`
    // });
    // expect(watchResult.issues).toEqual(expect.any(Array));
    // expectNoErrors(watchResult.issues);
  }, 30000);
});

// testing accessibility of the home page
// testAccessibility('/browse');
// testAccessibility('/watch/something');

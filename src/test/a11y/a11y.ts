import puppeteer, { Browser, Page } from 'puppeteer';
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

async function signIn(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.goto(config.TEST_URL as string);
  await page.waitForSelector('#signInName', { visible: true, timeout: 0 });
  await page.type('#signInName', process.env.B2C_TEST_LOGIN_EMAIL as string);
  await page.type('#password', process.env.B2C_TEST_LOGIN_PASSWORD as string);
  await page.click('#next');
  return page;
}

jest.setTimeout(10000);
const screenshotDir = `${__dirname}/../../../functional-output/pa11y`;
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
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
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
        screenCapture: `${screenshotDir}/${url}.png`,
        browser: browser,
      });
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    });
  });

  const testUrl = config.TEST_URL as string;

  test('/browse page', async () => {
    const page = await signIn(browser);
    await page.close();

    const result: Pa11yResult = await pa11y(testUrl + '/browse', {
      browser: browser,
      screenCapture: `${screenshotDir}/browse.png`,
    });
    expect(result.issues).toEqual(expect.any(Array));
    expectNoErrors(result.issues);
  });

  test('/watch/x page', async () => {
    const page = await signIn(browser);
    await page.waitForSelector('a[href^="/watch/"]', { visible: true, timeout: 0 });
    await page.click('a[href^="/watch/"]');
    const watchUrl = page.url();
    await page.close();

    const watchResult: Pa11yResult = await pa11y(watchUrl, {
      browser: browser,
      screenCapture: `${screenshotDir}/watch.png`,
    });
    expect(watchResult.issues.map(issue => issue.code)).toEqual([
      'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name',
      'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Div.Name',
      'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Div.Name',
    ]);
  }, 30000);
});

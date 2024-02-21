import axios from 'axios';
import { config } from '../config';
import * as https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pa11y = require('pa11y');
const server = axios.create({
  baseURL: config.TEST_URL,
  httpAgent: new https.Agent({ rejectUnauthorized: false }),
});

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

function ensurePageCallWillSucceed(url: string): Promise<void> {
  server.get(url).catch(error => {
    // if the url is for /not-found then don't worry about 404 status codes
    if (url === '/not-found' && error.response.status === 404) {
      return;
    }
    throw new Error(`Failed to load page: ${url}`);
  });
  return Promise.resolve();
}

function runPally(url: string): Pa11yResult {
  return pa11y(config.TEST_URL + url, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
  });
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

jest.retryTimes(3);
jest.setTimeout(15000);

describe('Accessibility', () => {
  describe.each(['/sign-in', '/terms-and-conditions', '/accessibility-statement', '/browse', '/not-found'])(
    'Page %s',
    url => {
      test('should have no accessibility errors', async () => {
        await ensurePageCallWillSucceed(url);
        const result = await runPally(url);
        expect(result.issues).toEqual(expect.any(Array));
        expectNoErrors(result.issues);
      });
    }
  );
});

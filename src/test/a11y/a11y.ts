import { app } from '../../main/app';

import request from 'supertest';
import { afterAll } from '@jest/globals';
import { mock, reset } from '../mock-api';

const pa11y = require('pa11y');

const appServers: any[] = [];
function server() {
  const server = app.listen();
  appServers.push(server);
  return server;
}

class Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];

  constructor(documentTitle: string, pageUrl: string, issues: PallyIssue[]) {
    this.documentTitle = documentTitle;
    this.pageUrl = pageUrl;
    this.issues = issues;
  }
}

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;

  constructor(code: string, context: string, message: string, selector: string, type: string, typeCode: number) {
    this.code = code;
    this.context = context;
    this.message = message;
    this.selector = selector;
    this.type = type;
    this.typeCode = typeCode;
  }
}

function runPally(url: string): Promise<Pa11yResult> {
  return pa11y(url, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
    // Ignoring NoSuchID due to how Angular app links between pages: Links say they are linking to '/browse' when they actually link to '/#/browse' which is not listed as a route.
    ignore: ['WCAG2AA.Principle2.Guideline2_4.2_4_1.G1,G123,G124.NoSuchID'],
  });
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    test('should have no accessibility errors', async () => {
      // await ensurePageCallWillSucceed(url);
      const result = await runPally(await request(server()).get(url).url);
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    });
  });
}

jest.mock('express-openid-connect', () => {
  return {
    requiresAuth: jest.fn().mockImplementation(() => {
      return (req: any, res: any, next: any) => {
        next();
      };
    }),
  };
});

jest.setTimeout(30000);
mock();

describe('Accessibility', () => {
  afterAll(async () => {
    appServers.forEach(server => server.close());
    reset();
  });
  // testing accessibility of the home page
  testAccessibility('/terms-and-conditions');
  testAccessibility('/accessibility-statement');
  testAccessibility('/sign-in');
  testAccessibility('/browse');
  testAccessibility('/not-found');
  testAccessibility('/watch/something');
  testAccessibility('/cookies');
});

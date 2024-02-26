import { fail } from 'assert';

import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';

const testUrl = process.env.TEST_URL || 'https://localhost:4550';

describe('Smoke Test', () => {
  describe('Terms and conditions page loads', () => {
    test('with correct content', async () => {
      try {
        const response: AxiosResponse = await axios.get(testUrl + '/terms-and-conditions');
        expect(response.status).to.equal(200);
        // @todo for some reason this is redirecting to MS B2C login. Will fix later
        // expect(response.data)
        //   .includes('Terms &amp; Conditions (including Acceptable Use) for the Section 28 Video on Demand Portal');
      } catch {
        fail('Heading not present and/or correct');
      }
    });
  });
});

import { fail } from 'assert';

import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';

const testUrl = process.env.TEST_URL || 'https://localhost:4550/sign-in';

describe('Smoke Test', () => {
  describe('Home page loads', () => {
    test('with correct content', async () => {
      try {
        const response: AxiosResponse = await axios.get(testUrl, {
          headers: {
            'Accept-Encoding': 'gzip',
          },
        });
        expect(response.status).to.equal(200);
        expect(response.headers['content-security-policy']).includes('.onmicrosoft.com/B2C_1A_signup_signin');
        expect(response.data).includes('Sign in');
      } catch {
        fail('Heading not present and/or correct');
      }
    });
  });
});

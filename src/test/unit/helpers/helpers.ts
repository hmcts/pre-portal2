import { describe, test } from '@jest/globals';
import { generateSearchParamsForPage, getPaginatedPageTitle, getPaginationLinks } from '../../../main/helpers/helpers';
import { PaginatedRequest } from '../../../main/services/pre-api/types';

describe('generateSearchParamsForPage', () => {
  test('should generate query string with valid params and page', () => {
    const params = { name: 'John', age: 30 };
    const page = 2;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('name=John&age=30&page=2');
  });

  test('should exclude params with falsy values', () => {
    const params = { name: 'John', age: 0, city: null, country: undefined };
    const page = 1;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('name=John&page=1');
  });

  test('should exclude the "size" parameter', () => {
    const params = { name: 'someone', size: 20 };
    const page = 3;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('name=someone&page=3');
  });

  test('should return only the page parameter if no valid params are provided', () => {
    const params = { size: 10, age: 0 };
    const page = 5;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('page=5');
  });

  test('should return an empty string if no params and page is 0', () => {
    const params = { size: 10, age: 0 };
    const page = 0;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('');
  });

  test('should handle empty params object', () => {
    const params = {};
    const page = 1;

    const result = generateSearchParamsForPage(params, page);

    expect(result).toBe('page=1');
  });
});

describe('getPaginatedPageTitle', () => {
  test('should generate title for paginated data', () => {
    const baseTitle = 'Users';
    const data = [1, 2, 3];
    const pagination = {
      currentPage: 0,
      size: 3,
      totalElements: 10,
      totalPages: 4,
    };

    const result = getPaginatedPageTitle(baseTitle, data, pagination);

    expect(result).toBe('Users 1 to 3 of 10');
  });

  test('should generate title for partial last page', () => {
    const baseTitle = 'Users';
    const data = [7, 8];
    const pagination = {
      currentPage: 2,
      size: 3,
      totalElements: 8,
      totalPages: 3,
    };

    const result = getPaginatedPageTitle(baseTitle, data, pagination);

    expect(result).toBe('Users 7 to 8 of 8');
  });

  test('should generate base title if data array is empty', () => {
    const baseTitle = 'Users';
    const data = [];
    const pagination = {
      currentPage: 0,
      size: 3,
      totalElements: 0,
      totalPages: 0,
    };

    const result = getPaginatedPageTitle(baseTitle, data, pagination);

    expect(result).toBe('Users');
  });

  test('should handle large pagination numbers', () => {
    const baseTitle = 'Items';
    const data = [1001, 1002, 1003];
    const pagination = {
      currentPage: 333,
      size: 3,
      totalElements: 1005,
      totalPages: 335,
    };

    const result = getPaginatedPageTitle(baseTitle, data, pagination);

    expect(result).toBe('Items 1000 to 1002 of 1005');
  });
});

describe('getPaginationLinks', () => {
  test('should generate pagination links with ellipses and current page highlighted', () => {
    const pagination = {
      currentPage: 3,
      totalPages: 10,
      size: 10,
      totalElements: 100,
    };
    const path = '/users';
    const currentParams = { query: 'test' } as PaginatedRequest;

    const result = getPaginationLinks(pagination, path, currentParams);

    expect(result.items).toEqual([
      { href: '/users?query=test', number: 1, current: false },
      { href: '/users?query=test&page=1', number: 2, current: false },
      { href: '/users?query=test&page=2', number: 3, current: false },
      { href: '/users?query=test&page=3', number: 4, current: true },
      { href: '/users?query=test&page=4', number: 5, current: false },
      { href: '/users?query=test&page=5', number: 6, current: false },
      { ellipsis: true },
      { href: '/users?query=test&page=9', number: 10, current: false },
    ]);
    expect(result.previous['href']).toBe('/users?query=test&page=2');
    expect(result.next['href']).toBe('/users?query=test&page=4');
  });

  test('should generate links without ellipses when pages are contiguous', () => {
    const pagination = {
      currentPage: 1,
      totalPages: 3,
      size: 10,
      totalElements: 30,
    };
    const path = '/users';
    const currentParams = { query: 'test' } as PaginatedRequest;

    const result = getPaginationLinks(pagination, path, currentParams);

    expect(result.items).toEqual([
      { href: '/users?query=test', number: 1, current: false },
      { href: '/users?query=test&page=1', number: 2, current: true },
      { href: '/users?query=test&page=2', number: 3, current: false },
    ]);
    expect(result.previous['href']).toBe('/users?query=test');
    expect(result.next['href']).toBe('/users?query=test&page=2');
  });

  test('should generate links for a single page without previous or next links', () => {
    const pagination = {
      currentPage: 0,
      totalPages: 1,
      size: 10,
      totalElements: 10,
    };
    const path = '/users';
    const currentParams = { query: 'test' } as PaginatedRequest;

    const result = getPaginationLinks(pagination, path, currentParams);

    expect(result.items).toEqual([{ href: '/users?query=test', number: 1, current: true }]);
    expect(result.previous).toEqual({});
    expect(result.next).toEqual({});
  });
});

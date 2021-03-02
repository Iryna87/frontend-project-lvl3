import { test, expect } from '@jest/globals';
import rss from '../src/index.js';

test('rss', () => {
  expect(rss()).toEqual('Yes');
});

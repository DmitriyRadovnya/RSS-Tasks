import { beforeAll, afterEach, afterAll, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from '../mocks/node';
import '@testing-library/jest-dom';

expect.extend(matchers);

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
});
afterAll(() => server.close());

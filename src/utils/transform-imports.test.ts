/**
 * @file Tests for the import path transformer.
 *
 * Covers static imports, export-from statements, dynamic imports,
 * type-only imports, and edge cases (relative imports, no matches,
 * empty content).
 */

import { describe, it, expect } from 'vitest';
import { transformImports } from './transform-imports';
import type { ConsumerConfig } from '../types/index';

const sampleConfig: ConsumerConfig = {
  alias: '@',
  aliases: {
    '@errors/*': ['src/shared/errors/*'],
    '@shared/*': ['src/shared/*'],
    '@lib/*': ['src/lib/*'],
    '@services/*': ['src/services/*'],
  },
  paths: {
    errors: 'src/shared/errors',
    shared: 'src/shared',
    lib: 'src/lib',
    services: 'src/services',
  },
};

describe('transformImports', () => {
  it('transforms static imports', () => {
    const input = `import { ApiError } from '@errors/api-error';`;
    const expected = `import { ApiError } from '@/shared/errors/api-error';`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('transforms export-from statements', () => {
    const input = `export { ApiError } from '@errors/api-error';`;
    const expected = `export { ApiError } from '@/shared/errors/api-error';`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('transforms dynamic imports', () => {
    const input = `const mod = import('@services/storage-provider');`;
    const expected = `const mod = import('@/services/storage-provider');`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('transforms type-only imports', () => {
    const input = `import type { ApiResponse } from '@shared/types/api';`;
    const expected = `import type { ApiResponse } from '@/shared/types/api';`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('transforms named imports in export type statements', () => {
    const input = `export type { ApiResponse } from '@shared/types/api';`;
    const expected = `export type { ApiResponse } from '@/shared/types/api';`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('transforms multiple imports in the same file', () => {
    const input = [
      `import { ApiError } from '@errors/api-error';`,
      `import { PAGE_SIZE } from '@shared/shared-constants';`,
    ].join('\n');
    const expected = [
      `import { ApiError } from '@/shared/errors/api-error';`,
      `import { PAGE_SIZE } from '@/shared/shared-constants';`,
    ].join('\n');
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('leaves relative imports untouched', () => {
    const input = `import { foo } from './bar';\nimport { baz } from '../qux';`;
    expect(transformImports(input, sampleConfig)).toBe(input);
  });

  it('leaves non-matching imports untouched', () => {
    const input = `import { z } from 'zod';`;
    expect(transformImports(input, sampleConfig)).toBe(input);
  });

  it('leaves npm package imports untouched', () => {
    const input = `import axios from 'axios';\nimport { NextRequest } from 'next/server';`;
    expect(transformImports(input, sampleConfig)).toBe(input);
  });

  it('handles empty content', () => {
    expect(transformImports('', sampleConfig)).toBe('');
  });

  it('does not modify non-import code', () => {
    const input = [
      `const x = 42;`,
      `export function hello() { return 'world'; }`,
      `type Foo = string;`,
    ].join('\n');
    expect(transformImports(input, sampleConfig)).toBe(input);
  });

  it('handles a mix of transformed and untouched imports', () => {
    const input = [
      `import { z } from 'zod';`,
      `import { ApiError } from '@errors/api-error';`,
      `import { helper } from './local';`,
    ].join('\n');
    const result = transformImports(input, sampleConfig);
    expect(result).toContain(`import { z } from 'zod'`);
    expect(result).toContain(`import { ApiError } from '@/shared/errors/api-error'`);
    expect(result).toContain(`import { helper } from './local'`);
  });

  it('handles double-quoted imports', () => {
    const input = `import { ApiError } from "@errors/api-error";`;
    const expected = `import { ApiError } from "@/shared/errors/api-error";`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('strips leading src/ from consumer paths', () => {
    const input = `import { Provider } from '@services/storage-provider';`;
    const expected = `import { Provider } from '@/services/storage-provider';`;
    expect(transformImports(input, sampleConfig)).toBe(expected);
  });

  it('handles hyphenated path keys like services-storage', () => {
    const config: ConsumerConfig = {
      alias: '@',
      aliases: {},
      paths: {
        'services-storage': 'src/shared/services/storage',
      },
    };
    const input = `import { StorageProvider } from '@services-storage/types';`;
    const expected = `import { StorageProvider } from '@/shared/services/storage/types';`;
    expect(transformImports(input, config)).toBe(expected);
  });

  it('returns content unchanged when paths is empty', () => {
    const config: ConsumerConfig = { alias: '@', aliases: {}, paths: {} };
    const input = `import { x } from '@errors/foo';`;
    expect(transformImports(input, config)).toBe(input);
  });

  it('strips trailing src/ from the consumer path', () => {
    const config: ConsumerConfig = {
      alias: '@',
      aliases: {},
      paths: {
        utils: 'src/shared/utils',
      },
    };
    const input = `import { format } from '@utils/format-zod-issues';`;
    const expected = `import { format } from '@/shared/utils/format-zod-issues';`;
    expect(transformImports(input, config)).toBe(expected);
  });

  describe('internal prefix handling', () => {
    it('strips @items/ prefix to match path key', () => {
      const input = `import { InvalidJsonError } from '@items/errors/http-errors';`;
      const expected = `import { InvalidJsonError } from '@/shared/errors/http-errors';`;
      expect(transformImports(input, sampleConfig)).toBe(expected);
    });

    it('strips @src/items/ prefix to match path key (barrel import)', () => {
      const input = `import { normalizeUnknownError } from '@src/items/errors';`;
      const expected = `import { normalizeUnknownError } from '@/shared/errors';`;
      expect(transformImports(input, sampleConfig)).toBe(expected);
    });

    it('strips @src/ prefix to match path key', () => {
      const input = `import { PAGE_SIZE } from '@src/shared/constants';`;
      const expected = `import { PAGE_SIZE } from '@/shared/constants';`;
      expect(transformImports(input, sampleConfig)).toBe(expected);
    });

    it('falls through when path key is not in config (consumer alias handles it)', () => {
      const config: ConsumerConfig = {
        alias: '@',
        aliases: {},
        paths: {
          errors: 'src/shared/errors',
          utils: 'src/shared/utils',
        },
      };
      const input = `import { PAGE_SIZE } from '@src/shared/constants';`;
      const expected = `import { PAGE_SIZE } from '@shared/constants';`;
      expect(transformImports(input, config)).toBe(expected);
    });

    it('handles @items/utils/ prefix', () => {
      const config: ConsumerConfig = {
        alias: '@',
        aliases: {},
        paths: {
          utils: 'src/shared/utils',
        },
      };
      const input = `import { formatZodIssues } from '@items/utils/format-zod-issues';`;
      const expected = `import { formatZodIssues } from '@/shared/utils/format-zod-issues';`;
      expect(transformImports(input, config)).toBe(expected);
    });

    it('handles @utils/ without internal prefix (direct match)', () => {
      const config: ConsumerConfig = {
        alias: '@',
        aliases: {},
        paths: {
          utils: 'src/shared/utils',
        },
      };
      const input = `import { format } from '@utils/format-zod-issues';`;
      const expected = `import { format } from '@/shared/utils/format-zod-issues';`;
      expect(transformImports(input, config)).toBe(expected);
    });
  });
});

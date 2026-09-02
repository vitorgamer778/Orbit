import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const workspace = await readFile(
  new URL('../app/orbit-workspace.tsx', import.meta.url),
  'utf8',
);
const config = await readFile(
  new URL('../next.config.ts', import.meta.url),
  'utf8',
);

test('core portfolio interactions remain wired', () => {
  for (const behavior of [
    'KeyboardSensor',
    'duplicateSelected',
    'deleteSelected',
    'filter-panel',
    'CommandDialog',
  ])
    assert.match(workspace, new RegExp(behavior));
});

test('production security headers remain configured', () => {
  for (const header of [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'X-Frame-Options',
  ])
    assert.match(config, new RegExp(header));
});

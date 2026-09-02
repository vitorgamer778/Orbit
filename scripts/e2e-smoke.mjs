import assert from 'node:assert/strict';

const baseUrl =
  process.env.ORBIT_BASE_URL ?? 'https://orbit-project-ops.vercel.app';
const response = await fetch(baseUrl, { redirect: 'follow' });
const html = await response.text();
assert.equal(response.status, 200, `Expected ${baseUrl} to return 200`);
assert.match(html, /Orbit/);
assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
console.log(`Production smoke passed: ${baseUrl}`);

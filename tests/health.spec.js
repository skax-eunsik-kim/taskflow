'use strict';

const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/server');
const { version } = require('../package.json');

test('health response includes the running service version', async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(await response.json(), {
    ok: true,
    service: 'taskflow',
    version
  });
});

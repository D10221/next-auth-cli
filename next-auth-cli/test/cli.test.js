import assert from 'assert';
import childProcess from 'child_process';
import cli from 'next-auth-cli';
import { promisify } from 'util';
import { binLocation, connection_strings, unlinkSqlite } from './common.js';

describe('next-auth-cli (module)', () => {
  // NOTE this tests work because of 'yarn' monorepo
  //
  it('"module" can be imported', () => {
    assert.equal(cli.name, 'next-auth-cli');
  });

  it('"module" can be dynamically imported', async () => {
    const { default: imported } = await import('next-auth-cli');
    assert.equal(imported.name, 'next-auth-cli');
    assert.strictEqual(imported, cli); // no leaks
  });
});

describe('next-auth-cli (cli)', function () {
  this.timeout(5000); // 5 seconds ?
  this.beforeEach(unlinkSqlite);

  it('helps', async () => {
    try {
      const { stdout, stderr } = await run('--help');
      assert.ok(/next-auth-cli\s+<cmd>\s+\[args\]/i.test(stdout));
    } catch (error) {
      assert.fail(error.message);
    }
  });
  /**
   * it can't re-configure adapter
   */
  it(`syncs [config]`, async () => {
    try {
      const result = await run('sync', './test/next-auth-config.js'); //.catch((e) => e);
      // Assert fail
      assert.ok(!(result instanceof Error));
      // assert.ok(/SQLITE_ERROR\: no such table: users/.test(result.message))
    } catch (error) {
      assert.fail(error.message);
    }
  });
  // sync  --database
  for (const { key, value: connection_string } of connection_strings) {
    it(`syncs ${key} --database`, async () => {
      try {
        const result = await run('sync', '--database', connection_string).catch(
          (e) => e
        );
        assert.ok(!(result instanceof Error), result.stdout);
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  }
  // sync  --database --adapter
  for (const { key, value: connection_string } of connection_strings) {
    it(`syncs ${key} --database --adapter`, async () => {
      try {
        const result = await run(
          'sync',
          '--database',
          // @ts-ignore
          connection_string,
          '--adapter',
          './test/next-auth-external-adapter.js'
        ).catch((e) => e);
        assert.ok(!(result instanceof Error), result.stdout);
      } catch (error) {
        assert.fail(`${key} sync FAILED`);
      }
    });
  }
});
const exec = promisify(childProcess.exec);
/**
 * @param {string[]} args
 */
function run(...args) {
  return exec(['node', binLocation, ...args].join(' '), {
    encoding: 'utf-8',
  });
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { archivedTargets } from '../scripts/content-policy.mjs';
const repo = fileURLToPath(new URL('../../', import.meta.url));
async function snapshot(root, relative = '') {
  const result = {};
  for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
    const path = join(relative, entry.name);
    if (entry.isDirectory()) Object.assign(result, await snapshot(root, path));
    else result[path] = createHash('sha256').update(await readFile(join(root, path))).digest('hex');
  }
  return result;
}
test('clean and repeated content generation agree and cannot resurrect retired pages', async (t) => {
  const temp = await mkdtemp(join(tmpdir(), 'harness-discovery-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  for (const directory of ['reference', 'systems', 'comparisons', 'examples', 'patterns', 'reviews', 'site/scripts', 'site/src/lib']) {
    await mkdir(join(temp, directory, '..'), { recursive: true });
    await cp(join(repo, directory), join(temp, directory), { recursive: true });
  }
  const output = join(temp, 'site/src/content/docs');
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'choose.mdx'), 'hand-authored page sentinel');
  const run = () => {
    const result = spawnSync(process.execPath, ['scripts/sync-content.mjs'], { cwd: join(temp, 'site'), encoding: 'utf8', env: { ...process.env, GITHUB_SHA: 'review-source-ref' } });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  };
  run();
  const first = await snapshot(output);
  await writeFile(join(output, 'capabilities/obsolete.mdx'), 'stale generated content');
  await writeFile(join(output, 'model.md'), 'unarchived stale model');
  run();
  assert.deepEqual(await snapshot(output), first);
  await rm(output, { recursive: true }); await mkdir(output, { recursive: true });
  await writeFile(join(output, 'choose.mdx'), 'hand-authored page sentinel'); run();
  assert.deepEqual(await snapshot(output), first);
  for (const target of archivedTargets) {
    const body = await readFile(join(output, target), 'utf8');
    assert.match(body, /pagefind: false/); assert.match(body, /noindex, follow/);
    assert.match(body, /Archived design material/); assert.match(body, /review-source-ref/);
  }
  const model = await readFile(join(output, 'model.md'), 'utf8');
  const original = await readFile(join(temp, 'reference/model.md'), 'utf8');
  assert.deepEqual(model.match(/^#{2,6} .+$/gm), original.match(/^#{2,6} .+$/gm));
  assert.equal(await readFile(join(output, 'choose.mdx'), 'utf8'), 'hand-authored page sentinel');
});

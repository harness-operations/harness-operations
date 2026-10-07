import { test, expect } from '@playwright/test';
import { isReviewedSubject, scopeRows } from '../src/lib/discovery.mjs';

async function interests(page, goal = 'coding', mode = 'developer') {
  await page.goto('/choose/');
  await page.locator(`input[name="goal"][value="${goal}"]`).check();
  await page.locator('[data-next]').click();
  await page.locator(`input[name="mode"][value="${mode}"]`).check();
  await page.locator('[data-next]').click();
}
const noOverflow = async (page) => expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

test('a blocked chooser bundle leaves a usable static fallback', async ({ page }) => {
  let blocked = false;
  await page.route('**/_astro/GuidedChooser*.js', (route) => { blocked = true; return route.abort(); });
  await page.goto('/choose/');
  expect(blocked).toBe(true);
  await expect(page.locator('[data-chooser]')).toBeHidden();
  await expect(page.locator('[data-chooser-fallback]')).toBeVisible();
  await page.locator('[data-chooser-fallback] a[href="/capabilities/"]').click();
  await expect(page.getByRole('heading', { name: 'Explore capabilities', level: 1 })).toBeVisible();
});
test('invalid initialization data preserves fallback navigation without an uncaught error', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/choose/', async (route) => {
    const response = await route.fetch();
    const original = await response.text();
    const body = original.replace(/(<script\b[^>]*data-subjects[^>]*>)[\s\S]*?(<\/script>)/, '$1{broken-json$2');
    expect(body).not.toEqual(original);
    await route.fulfill({ response, body });
  });
  await page.goto('/choose/');
  await expect(page.locator('[data-chooser-fallback]')).toBeVisible();
  await expect(page.locator('[data-chooser]')).toBeHidden();
  await page.locator('[data-chooser-fallback] a[href="/systems/"]').click();
  await expect(page.getByRole('heading', { name: 'Systems', level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});
test('empty shortlists can clear interests without losing goal and interface choices', async ({ page }) => {
  await interests(page);
  await page.locator('input[value="background"]').check();
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-gap]')).toBeVisible();
  await expect(page.locator('[data-gap]')).not.toContainText('application you asked for');
  await page.locator('[data-clear-interests]').click();
  await expect(page.locator('[data-gap]')).toBeHidden();
  await expect(page.locator('[data-summary]')).toContainText('Build software · Developer tools');
  await expect(page.locator('[data-summary]')).not.toContainText('Run work in the background');
  await expect(page.locator('[data-clear-interests]')).toBeHidden();
  await expect(page.locator('#chooser-results-heading')).toBeFocused();
  await page.locator('[data-edit]').click();
  await expect(page.locator('input[value="coding"]')).toBeChecked();
  await page.locator('[data-next]').click();
  await expect(page.locator('input[value="developer"]')).toBeChecked();
});
test('native Tab, arrow, and Space navigation completes the wizard without focus shortcuts', async ({ page }) => {
  await page.goto('/choose/');
  // Establish the beginning of the form once, then use only actual keyboard traversal.
  await page.locator('[data-step="0"] [data-step-heading]').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('input[value="coding"]')).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-next]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/^Question 2 of 3/);
  await page.keyboard.press('Tab');
  await expect(page.locator('input[value="application"]')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('input[value="developer"]')).toBeChecked();
  await page.keyboard.press('Tab'); // Back
  await expect(page.locator('[data-back]')).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/^Question 3 of 3/);
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); // two interest checkboxes
  await page.keyboard.press('Tab'); // Back
  await expect(page.locator('[data-back]')).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); // Show options, Skip interests
  await expect(page.locator('[data-skip]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/^Your shortlist/);
  await expect(page.locator('#chooser-results-heading')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-result-id]:visible h3 a').first()).toBeFocused();
});
test('every visible result retains all canonical material scope fields', async ({ page, request }) => {
  const response = await request.get('/systems/index.json'); expect(response.ok()).toBe(true);
  const index = await response.json();
  await interests(page, 'explore', 'any'); await page.locator('[data-skip]').click();
  await page.locator('[data-more]').click();
  const ids = await page.locator('[data-result-id]:visible').evaluateAll((cards) => cards.map((card) => card.dataset.resultId));
  for (const id of ids) {
    const subject = index.subjects.find((entry) => entry.id === id); expect(isReviewedSubject(subject)).toBe(true);
    const card = page.locator(`[data-result-id="${id}"]`);
    for (const { key, value } of scopeRows(subject)) await expect(card.locator(`[data-scope-key="${key}"] + dd`)).toHaveText(value);
    await expect(card.locator('time')).toHaveAttribute('datetime', subject.reviewed_at);
  }
});
test('all question groups explain their inputs and new searches collapse old source details', async ({ page }) => {
  await interests(page);
  for (const step of ['0', '1', '2']) {
    const describedBy = await page.locator(`[data-step="${step}"]`).getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy(); await expect(page.locator(`[id="${describedBy}"]`)).toHaveCount(1);
  }
  await page.locator('[data-skip]').click();
  await page.locator('[data-result-id]:visible summary').first().click();
  await expect(page.locator('[data-result-id]:visible details[open]')).toHaveCount(1);
  await page.locator('[data-edit]').click();
  await page.locator('[data-next]').click(); await page.locator('[data-next]').click(); await page.locator('[data-skip]').click();
  await expect(page.locator('[data-result-id] details[open]')).toHaveCount(0);
});
test('the whole chooser interaction creates no answer requests, cookies, URL data, or storage', async ({ page }) => {
  await page.goto('/choose/'); await expect(page.locator('[data-chooser]')).toBeVisible();
  await page.waitForLoadState('networkidle');
  const snapshot = () => page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), cookie: document.cookie, url: location.href }));
  const before = await snapshot(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.locator('input[value="coding"]').check(); await page.locator('[data-next]').click();
  await page.locator('input[value="developer"]').check(); await page.locator('[data-next]').click();
  await page.locator('input[value="background"]').check(); await page.locator('[data-next]').click();
  await page.locator('[data-clear-interests]').click(); await page.locator('[data-edit]').click();
  await page.locator('[data-reset]').click();
  expect(await snapshot()).toEqual(before); expect(requests).toEqual([]);
});
for (const theme of ['light', 'dark']) test(`320px ${theme} chooser and expanded results remain usable`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 }); await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await interests(page, 'explore', 'any'); await noOverflow(page);
  await page.locator('[data-skip]').click(); await page.locator('[data-more]').click();
  await page.locator('[data-result-id]:visible summary').first().click(); await noOverflow(page);
  await page.screenshot({ path: testInfo.outputPath(`narrow-${theme}.png`), fullPage: false });
});
test('high-contrast mode retains native selection, focus, and layout', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/choose/');
  const input = page.locator('input[value="coding"]'); await input.focus(); await page.keyboard.press('Space');
  await expect(input).toBeChecked(); await expect(input).toBeFocused();
  expect(await input.evaluate((el) => getComputedStyle(el).appearance)).not.toBe('none');
  await noOverflow(page);
});
test('site search actually excludes archived routes, not only their visible navigation', async ({ page }) => {
  await page.goto('/capabilities/');
  const result = await page.evaluate(async () => {
    const pagefind = await import('/pagefind/pagefind.js');
    const collect = async (term) => Promise.all((await pagefind.search(term)).results.map(async (result) => (await result.data()).url));
    return { active: await collect('capabilities'), historical: await collect('Reference Model') };
  });
  expect(result.active.length).toBeGreaterThan(0);
  for (const url of [...result.active, ...result.historical]) expect(new URL(url, page.url()).pathname).not.toMatch(/^\/(model|overview|principles|governance|terminology)\/|^\/apply\/(from-harness-engineering|external-validation)\//);
});

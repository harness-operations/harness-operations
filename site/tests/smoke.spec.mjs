import { test, expect } from '@playwright/test';

test('homepage leads with Systems without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Harness Operations', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Systems', exact: true })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Systems navigation and canonical entries are reachable', async ({ page }) => {
  await page.goto('/systems/');
  await expect(page.getByRole('heading', { name: 'Systems', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Claude Projects/i }).first()).toBeVisible();

  await page.goto('/systems/claude-projects/');
  await expect(page.getByRole('heading', { name: /Claude Projects/i, level: 1 })).toBeVisible();
});

test('Standards and Boundaries uses the canonical route', async ({ page }) => {
  await page.goto('/standards/');
  await expect(page.getByRole('heading', { name: 'Standards and Boundaries', level: 1 })).toBeVisible();
});

test('search opens and accepts a query', async ({ page }) => {
  await page.goto('/');
  const searchButton = page.getByRole('button', { name: /search/i }).first();
  await expect(searchButton).toBeVisible();
  await searchButton.click();

  const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
  await expect(searchInput).toBeVisible();
  await searchInput.fill('Claude Projects');
  await expect(searchInput).toHaveValue('Claude Projects');
});

test('System Comparisons renders canonical data and filters live evidence', async ({ page }) => {
  await page.goto('/apply/matrix/');
  await expect(page.getByRole('heading', { name: 'System Comparisons', level: 1 })).toBeVisible();

  await page.locator('[data-filter-role]').selectOption('harness');
  await page.locator('[data-filter-evidence]').selectOption('live_test');
  await expect(page.locator('[data-result-count]')).not.toHaveText('0 scoped rows shown');

  await expect(page.getByRole('rowheader', { name: /OpenAI Codex/ })).toBeVisible();
  await expect(page.getByRole('rowheader', { name: /Anthropic Claude Code/ })).toBeVisible();
});

const { chromium } = require('playwright');
const path = require('path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForLoadState('load');
  await page.waitForSelector('.stat');

  if (errors.length) throw new Error('Page errors: ' + errors.join(' | '));
  assert.match(await page.title(), /IPMS TUDM/);
  await page.locator('[data-page="profiles"]').click();
  assert.equal(await page.locator('.profile-card').count(), 8, 'seeded profile cards');
  assert.equal(await page.locator('.profile-card img').count(), 8, 'profile avatars');

  await page.locator('[data-page="contractors"]').click();
  assert.equal(await page.locator('.profile-card').count(), 2, 'contractor module');
  await page.locator('[data-page="profiles"]').click();
  await page.locator('#search').fill('Aiman');
  assert.equal(await page.locator('.profile-card').count(), 1, 'profile search');
  await page.locator('#search').fill('');
  await page.locator('#cat').selectOption('visitor');
  assert.equal(await page.locator('.profile-card').count(), 2, 'category filter');
  await page.locator('#cat').selectOption('');
  await page.locator('#status').selectOption('pending');
  assert.equal(await page.locator('.profile-card').count(), 1, 'status filter');
  await page.locator('#status').selectOption('');

  await page.locator('[data-profile="p1"]').click();
  assert.match(await page.locator('#modal-body').innerText(), /Aiman Hakim/);
  await page.locator('[data-edit="p1"]').click();
  await page.locator('#profile-form input[name="name"]').fill('Aiman Hakim Demo Updated');
  await page.locator('#profile-form button.primary').click();
  assert.equal(await page.locator('.profile-card').count(), 8, 'profile update returns to list');

  await page.locator('[data-page="requests"]').click();
  await page.locator('[data-action="new-request"]').click();
  await page.locator('#request-form input[name="subject"]').fill('Test permohonan automatik');
  await page.locator('#request-form button.primary').click();
  assert.equal(await page.locator('tbody tr').count(), 4, 'new request added');
  await page.locator('[data-request]').first().click();
  await page.locator('[data-decision="approved"]').click();

  await page.locator('[data-page="cards"]').click();
  await page.locator('[data-action="new-card"]').click();
  await page.locator('#card-form input[name="ref"]').fill('TEST-CARD-AUTO-01');
  await page.locator('#card-form button.primary').click();
  assert.equal(await page.locator('tbody tr').count(), 3, 'demo card metadata added');

  await page.locator('[data-page="users"]').click();
  assert.equal(await page.locator('tbody tr').count(), 3, 'demo roles display');
  await page.locator('[data-page="reports"]').click();
  assert.equal(await page.locator('[data-export]').count(), 4, 'CSV export options');
  await page.locator('[data-page="audit"]').click();
  assert.ok(await page.locator('tbody tr').count() >= 4, 'audit events recorded');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-page="dashboard"]').click();
  assert.equal(await page.locator('.stat').count(), 4, 'mobile dashboard');
  assert.equal(errors.length, 0, 'no uncaught page errors');

  // The dashboard must still render when browser storage is blocked (e.g. privacy restrictions).
  const blockedStoragePage = await browser.newPage();
  await blockedStoragePage.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('Storage access blocked', 'SecurityError'); }
    });
  });
  await blockedStoragePage.goto('file://' + path.resolve('index.html'));
  await blockedStoragePage.waitForSelector('.stat');
  assert.equal(await blockedStoragePage.locator('.stat').count(), 4, 'dashboard renders without localStorage');
  assert.match(await blockedStoragePage.locator('#view').innerText(), /Penyimpanan browser tidak tersedia/);
  await blockedStoragePage.close();

  // Old or incomplete local data must be rejected and replaced with a valid demo seed.
  const staleDataPage = await browser.newPage();
  await staleDataPage.addInitScript(() => {
    localStorage.setItem('ipms-tudm-demo-v3', JSON.stringify({ profiles: [], requests: [] }));
  });
  await staleDataPage.goto('file://' + path.resolve('index.html'));
  await staleDataPage.waitForSelector('.stat');
  assert.equal(await staleDataPage.locator('.stat').count(), 4, 'dashboard renders with stale storage');
  await staleDataPage.locator('[data-page="profiles"]').click();
  assert.equal(await staleDataPage.locator('.profile-card').count(), 8, 'invalid stored schema is replaced by demo seed');
  await staleDataPage.close();

  const malformedDataPage = await browser.newPage();
  await malformedDataPage.addInitScript(() => {
    localStorage.setItem('ipms-tudm-demo-v3', '{invalid-json');
  });
  await malformedDataPage.goto('file://' + path.resolve('index.html'));
  await malformedDataPage.waitForSelector('.stat');
  assert.equal(await malformedDataPage.locator('.stat').count(), 4, 'dashboard renders with malformed storage');
  await malformedDataPage.close();

  console.log('PASS: dashboard, profile list/search/filter, profile details/edit, request create/review, demo card create, role display, reports, audit trail, mobile layout, blocked storage, stale storage and malformed storage.');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

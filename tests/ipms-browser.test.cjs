const { chromium } = require('playwright');
const path = require('path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('file://' + path.resolve('index.html'));
  await page.waitForLoadState('load');

  assert.match(await page.title(), /IPMS TUDM/);
  assert.equal(await page.locator('.profile-card').count(), 8, 'eight synthetic profiles should render');
  assert.equal(await page.locator('.profile-card img').count(), 8, 'each profile should have an avatar');

  await page.locator('#search').fill('Aiman');
  assert.equal(await page.locator('.profile-card:visible').count(), 1, 'name search should filter profiles');
  await page.locator('#search').fill('');

  await page.locator('#category').selectOption('visitor');
  assert.equal(await page.locator('.profile-card:visible').count(), 2, 'visitor filter should show two profiles');
  await page.locator('#category').selectOption('');

  await page.locator('#status').selectOption('pending');
  assert.equal(await page.locator('.profile-card:visible').count(), 1, 'pending filter should show one profile');
  await page.locator('#status').selectOption('');

  await page.locator('.profile-card').first().click();
  assert.equal(await page.locator('#modal.show').count(), 1, 'profile click should open details');
  assert.match(await page.locator('#modal-body').innerText(), /Aiman Hakim/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#modal.show').count(), 0, 'Escape should close details');

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.locator('.profile-card').count(), 8, 'mobile layout should retain profile cards');
  assert.equal(pageErrors.length, 0, 'page should not throw JavaScript errors');

  console.log('PASS: title, 8 profiles, avatars, search, category filter, status filter, profile details, Escape close, mobile viewport, no page errors.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

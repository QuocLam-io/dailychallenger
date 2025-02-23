import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dailychallenger.netlify.app/');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('button', { name: 'Sign in with Google Google' }).click();
  await page.goto('https://dailychallenger.netlify.app/');
  await page.getByRole('button', { name: 'Create a challenge plus icon' }).click();
  await page.getByRole('textbox', { name: 'Challenge input' }).click();
  await page.getByRole('textbox', { name: 'Challenge input' }).fill('This is a test');
  await page.getByRole('button', { name: 'Create Create a challenge' }).click();
  await page.getByRole('button', { name: 'Check mark icon Mark as done' }).click();
  await page.getByRole('button', { name: 'Create a new challenge' }).click();
  await page.getByRole('button', { name: 'Close challenger form button' }).click();
});
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from './pages/LoginPage';

test.describe('Login Page - Complete E2E Tests', () => {
    let loginPage: LoginPage;
    let jsErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
        jsErrors = [];
        loginPage = new LoginPage(page);

        page.on('pageerror', err => {
            jsErrors.push(err.message);
        });

        await loginPage.goto();
    });

    test('should load login page without errors', async ({ page }) => {
        await expect(page).toHaveURL(/.*login/);
        expect(jsErrors).toHaveLength(0);
    });

    test('should have username input visible and focusable', async ({ page }) => {
        await expect(loginPage.usernameInput.first()).toBeVisible();
        await loginPage.usernameInput.first().focus();
        await expect(loginPage.usernameInput.first()).toBeFocused();
    });

    test('should have continue button visible', async ({ page }) => {
        await expect(loginPage.continueButton.first()).toBeVisible();
    });

    test('should show password step after entering username', async ({ page }) => {
        // Wait for username input to be ready
        await expect(loginPage.usernameInput.first()).toBeVisible();
        await loginPage.usernameInput.first().fill('testuser');

        // Click continue and wait for transition
        await loginPage.continueButton.first().click();
        await page.waitForTimeout(1500); // Allow animation to complete

        // Password input should appear - use longer timeout
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 10000 });

        // Verify password field type
        const type = await loginPage.passwordInput.first().getAttribute('type');
        expect(type).toBe('password');
    });

    test('should have login and signup mode buttons', async ({ page }) => {
        await expect(loginPage.loginButton.first()).toBeVisible();
        await expect(loginPage.signUpButton.first()).toBeVisible();
    });

    test('should handle username entry and return to step 1', async ({ page }) => {
        // Go to step 2
        await loginPage.usernameInput.first().fill('testuser');
        await loginPage.continueButton.first().click();
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 5000 });

        // Go back to step 1
        await loginPage.backButton.click();
        await expect(loginPage.usernameInput.first()).toBeVisible({ timeout: 5000 });
    });

    test('should handle login with invalid credentials', async ({ page }) => {
        // Navigate to step 2 manually with better timeout handling
        await expect(loginPage.usernameInput.first()).toBeVisible();
        await loginPage.usernameInput.first().fill('testuser');
        await loginPage.continueButton.first().click();
        await page.waitForTimeout(1500);

        // Wait for password step
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 10000 });

        // Fill password
        await loginPage.passwordInput.first().fill('wrongpassword');
        await page.waitForTimeout(500);

        // Try to submit - the verify button might be disabled or enabled
        const verifyButton = page.getByRole('button', { name: /verify|mint/i }).first();
        const isEnabled = await verifyButton.isEnabled().catch(() => false);

        if (isEnabled) {
            await verifyButton.click();
            await page.waitForTimeout(2000);
        }

        // Check outcome - should remain on login or show error
        const currentUrl = page.url();
        console.log('After invalid login - URL:', currentUrl);

        // Test passes if we're still in the auth flow
        expect(currentUrl.includes('/login') || currentUrl.includes('/signin')).toBeTruthy();
    });

    test('should have no accessibility violations on step 1', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .include('form')
            .analyze();

        console.log('Step 1 Accessibility Violations:', results.violations.length);

        results.violations.forEach(v => {
            console.log(`- ${v.id}: ${v.description}`);
        });

        // Filter for critical/serious only
        const critical = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );
        expect(critical).toHaveLength(0);
    });

    test('should have no accessibility violations on step 2', async ({ page }) => {
        // Navigate to step 2
        await loginPage.usernameInput.first().fill('testuser');
        await loginPage.continueButton.first().click();
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 5000 });

        const results = await new AxeBuilder({ page })
            .include('form')
            .analyze();

        console.log('Step 2 Accessibility Violations:', results.violations.length);

        results.violations.forEach(v => {
            console.log(`- ${v.id}: ${v.description}`);
        });

        // Filter for critical/serious only
        const critical = results.violations.filter(
            v => v.impact === 'critical' || v.impact === 'serious'
        );
        expect(critical).toHaveLength(0);
    });

    test('should have proper labels for inputs', async ({ page }) => {
        // Check username has aria-label
        const usernameAriaLabel = await loginPage.usernameInput.first().getAttribute('aria-label');
        const usernamePlaceholder = await loginPage.usernameInput.first().getAttribute('placeholder');

        console.log('Username accessibility:', { usernameAriaLabel, usernamePlaceholder });

        // At least one accessibility method should be present
        expect(usernameAriaLabel || usernamePlaceholder).toBeTruthy();

        // Navigate to step 2 and check password
        await loginPage.usernameInput.first().fill('testuser');
        await loginPage.continueButton.first().click();
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 5000 });

        const passwordAriaLabel = await loginPage.passwordInput.first().getAttribute('aria-label');
        console.log('Password accessibility:', { passwordAriaLabel });
        expect(passwordAriaLabel).toBeTruthy();
    });

    test('should have forgot password link', async ({ page }) => {
        const forgotLink = await loginPage.forgotPasswordLink.count();
        console.log('Forgot password links found:', forgotLink);
        expect(forgotLink).toBeGreaterThan(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        await expect(loginPage.usernameInput.first()).toBeVisible();
        await expect(loginPage.continueButton.first()).toBeVisible();

        // Check input is properly sized
        const inputBox = await loginPage.usernameInput.first().boundingBox();
        expect(inputBox?.width).toBeGreaterThan(150);
    });

    test('should allow tab navigation through form', async ({ page }) => {
        await page.keyboard.press('Tab');

        // Should focus on first focusable element
        const focused = await page.locator(':focus').first();
        const tagName = await focused.evaluate(el => el.tagName.toLowerCase());
        console.log('First tab focused:', tagName);
    });

    test('should have Google sign-in option', async ({ page }) => {
        const googleButton = await loginPage.googleSignInButton.count();
        console.log('Google sign-in buttons found:', googleButton);
        expect(googleButton).toBeGreaterThan(0);
    });

    test('should have secure password input with autocomplete', async ({ page }) => {
        // Navigate to step 2
        await expect(loginPage.usernameInput.first()).toBeVisible();
        await loginPage.usernameInput.first().fill('testuser');
        await loginPage.continueButton.first().click();
        await page.waitForTimeout(1500);
        await expect(loginPage.passwordInput.first()).toBeVisible({ timeout: 10000 });

        // Verify password is masked
        const inputType = await loginPage.passwordInput.first().getAttribute('type');
        expect(inputType).toBe('password');

        // Check for autocomplete attributes
        const autocomplete = await loginPage.passwordInput.first().getAttribute('autocomplete');
        console.log('Password autocomplete:', autocomplete);
        expect(autocomplete).toBeTruthy();
    });

    test('should navigate back to landing page', async ({ page }) => {
        const logoLink = page.locator('a[href="/"]').first();
        if (await logoLink.count() > 0) {
            await logoLink.click();
            await expect(page).toHaveURL('/');
        } else {
            // Use browser back
            await page.goBack();
        }
    });
});

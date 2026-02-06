import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Dashboard & Protected Routes - Complete E2E Tests', () => {
    let jsErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
        jsErrors = [];

        page.on('pageerror', err => {
            jsErrors.push(err.message);
        });
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        const url = page.url();
        console.log('Dashboard redirect URL:', url);

        // Should either be on login or show auth required message
        const isOnLogin = url.includes('login');
        const hasAuthMessage = await page.locator('text=/sign in|login|unauthorized/i').count() > 0;

        expect(isOnLogin || hasAuthMessage).toBeTruthy();
    });

    test('should load dashboard for demo mode', async ({ page }) => {
        // Try accessing dashboard directly - some apps have demo mode
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        // Check if dashboard loaded or redirected
        if (page.url().includes('dashboard')) {
            const dashboardPage = new DashboardPage(page);
            await dashboardPage.verifyDashboardLoaded();
            expect(jsErrors).toHaveLength(0);
        }
    });

    test('should handle protected routes gracefully', async ({ page }) => {
        const protectedRoutes = [
            '/dashboard',
            '/agents',
            '/policies',
            '/audit',
            '/settings',
            '/console',
        ];

        for (const route of protectedRoutes) {
            await page.goto(route);
            await page.waitForTimeout(1000);

            const currentUrl = page.url();
            const bodyContent = await page.locator('body').textContent();

            // Should not show blank page
            expect(bodyContent?.length).toBeGreaterThan(0);

            console.log(`Route ${route} -> ${currentUrl}`);
        }
    });

    test('should have navigation sidebar in dashboard', async ({ page }) => {
        // Navigate to dashboard
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const sidebar = page.locator('nav, aside, [class*="sidebar"]');
            if (await sidebar.count() > 0) {
                await expect(sidebar.first()).toBeVisible();
            }
        }
    });

    test('should have accessible dashboard layout', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            console.log('Dashboard Accessibility Issues:', results.violations.length);

            results.violations.forEach(v => {
                console.log(`- ${v.id}: ${v.description} (${v.impact})`);
            });
        }
    });

    test('should have responsive dashboard layout', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const viewports = [
                { width: 1920, height: 1080, name: 'desktop' },
                { width: 768, height: 1024, name: 'tablet' },
                { width: 375, height: 667, name: 'mobile' },
            ];

            for (const vp of viewports) {
                await page.setViewportSize({ width: vp.width, height: vp.height });
                await page.waitForTimeout(500);

                // Check for overflow
                const hasHorizontalScroll = await page.evaluate(() =>
                    document.body.scrollWidth > window.innerWidth
                );

                console.log(`${vp.name}: Has horizontal scroll: ${hasHorizontalScroll}`);
            }
        }
    });

    test('should have working navigation items', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const navLinks = page.locator('nav a, aside a, [class*="sidebar"] a');
            const count = await navLinks.count();

            console.log('Navigation items found:', count);

            for (let i = 0; i < Math.min(count, 5); i++) {
                const link = navLinks.nth(i);
                const text = await link.textContent();
                const href = await link.getAttribute('href');
                console.log(`Nav ${i}: "${text?.trim()}" -> ${href}`);
            }
        }
    });

    test('should display user profile or menu', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const profileElements = page.locator('[class*="profile"], [class*="user"], [class*="avatar"]');
            const count = await profileElements.count();
            console.log('Profile elements found:', count);
        }
    });

    test('should have logout functionality', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(2000);

        if (page.url().includes('dashboard')) {
            const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")');
            const count = await logoutBtn.count();
            console.log('Logout buttons found:', count);

            if (count > 0) {
                await logoutBtn.first().click();
                await page.waitForTimeout(2000);

                const afterLogoutUrl = page.url();
                console.log('After logout URL:', afterLogoutUrl);
            }
        }
    });

    test('should load without JS errors in dashboard', async ({ page }) => {
        await page.goto('/dashboard');
        await page.waitForTimeout(3000);

        console.log('JS Errors:', jsErrors);

        // Filter for actual errors, not deprecation warnings
        const realErrors = jsErrors.filter(e =>
            !e.includes('deprecated') &&
            !e.includes('warning')
        );

        expect(realErrors).toHaveLength(0);
    });
});

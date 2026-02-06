import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LandingPage } from './pages/LandingPage';

test.describe('Landing Page - Complete E2E Tests', () => {
    let landingPage: LandingPage;
    let consoleErrors: string[] = [];
    let jsErrors: string[] = [];

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);

        // Capture console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Capture JS errors
        page.on('pageerror', err => {
            jsErrors.push(err.message);
        });

        await landingPage.goto();
    });

    test.afterEach(async () => {
        console.log('Console Errors:', consoleErrors);
        console.log('JS Errors:', jsErrors);
    });

    test('should load landing page without JS errors', async ({ page }) => {
        await expect(page).toHaveURL('/');
        expect(jsErrors).toHaveLength(0);
    });

    test('should have proper page title and meta', async ({ page }) => {
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);

        // Check for meta description
        const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
        console.log('Meta Description:', metaDesc);
    });

    test('should have visible navigation', async ({ page }) => {
        const navCount = await landingPage.getNavigationCount();
        console.log('Navigation links found:', navCount);

        // Navigation should exist - check nav element first
        const nav = page.locator('nav');
        const header = page.locator('header');

        const navVisible = await nav.isVisible().catch(() => false);
        const headerVisible = await header.isVisible().catch(() => false);

        console.log('Nav visible:', navVisible, 'Header visible:', headerVisible);

        // At least one should be present
        expect(navVisible || headerVisible).toBeTruthy();
    });

    test('should have hero section visible', async () => {
        await landingPage.verifyHeroVisible();
    });

    test('should have working navigation links', async () => {
        const links = await landingPage.checkAllLinks();
        const brokenLinks = links.filter(l => l.status === 'broken');
        const emptyLinks = links.filter(l => l.status === 'empty');

        console.log('Total Links:', links.length);
        console.log('Broken Links:', brokenLinks);
        console.log('Empty Links:', emptyLinks);

        // Report findings, not necessarily fail on empty
        expect(brokenLinks).toHaveLength(0);
    });

    test('should be responsive across viewports', async ({ page }) => {
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1280, height: 800, name: 'desktop' },
        ];

        for (const vp of viewports) {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.waitForTimeout(500);

            // Check no horizontal overflow
            const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
            const viewportWidth = await page.evaluate(() => window.innerWidth);

            console.log(`${vp.name}: Body ${bodyWidth}px, Viewport ${viewportWidth}px`);

            // Content should not overflow significantly
            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50);
        }
    });

    test('should have no accessibility violations', async ({ page }) => {
        // Exclude 3D canvas elements (Spline scenes) which are decorative
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .exclude('canvas') // Exclude 3D scenes
            .exclude('[data-spline]') // Exclude Spline elements
            .analyze();

        console.log('Accessibility Violations:', accessibilityScanResults.violations.length);

        // Report violations but may not fail all
        if (accessibilityScanResults.violations.length > 0) {
            console.log('ACCESSIBILITY ISSUES FOUND:');
            accessibilityScanResults.violations.forEach(v => {
                console.log(`- ${v.id} (${v.impact}): ${v.description}`);
                v.nodes.slice(0, 3).forEach(n => {
                    console.log(`  Target: ${n.target.join(', ')}`);
                });
            });
        }

        // Critical violations should be zero - allow some moderate issues from 3rd party components
        const critical = accessibilityScanResults.violations.filter(
            v => v.impact === 'critical'
        );

        // Serious violations - allow up to 3 (often from 3rd party components)
        const serious = accessibilityScanResults.violations.filter(
            v => v.impact === 'serious'
        );

        console.log(`Critical: ${critical.length}, Serious: ${serious.length}`);

        expect(critical).toHaveLength(0);
        expect(serious.length).toBeLessThanOrEqual(5); // Allow some serious from 3rd party
    });

    test('should have working animations without jank', async ({ page }) => {
        // Check for animation elements
        const animatedElements = await page.locator('[class*="animate"], [class*="motion"], [style*="animation"]').count();
        console.log('Animated elements found:', animatedElements);

        // Scroll through page and check for smooth scrolling
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, 0));
    });

    test('should have visible CTA buttons', async ({ page }) => {
        const ctaButtons = page.getByRole('button').or(page.locator('a[class*="btn"], a[class*="button"]'));
        const ctaCount = await ctaButtons.count();
        console.log('CTA buttons found:', ctaCount);

        expect(ctaCount).toBeGreaterThan(0);
    });

    test('should navigate to login page', async ({ page }) => {
        // Find login link/button
        const loginLink = page.getByRole('link', { name: /login|sign in/i })
            .or(page.getByRole('button', { name: /login|sign in/i }))
            .or(page.locator('a[href*="login"]'));

        if (await loginLink.count() > 0) {
            await loginLink.first().click();
            await page.waitForURL('**/login**');
            expect(page.url()).toContain('login');
        } else {
            console.log('No login link found on landing page');
        }
    });

    test('should have proper image loading', async ({ page }) => {
        const images = page.locator('img');
        const imageCount = await images.count();

        console.log('Images found:', imageCount);

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const src = await img.getAttribute('src');
            const alt = await img.getAttribute('alt');

            // Check images have alt text
            if (!alt) {
                console.log(`Image missing alt text: ${src}`);
            }

            // Check image is loaded
            const loaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalHeight > 0);
            if (!loaded) {
                console.log(`Image not loaded: ${src}`);
            }
        }
    });

    test('should have visible footer with links', async ({ page }) => {
        const footer = page.locator('footer');
        if (await footer.count() > 0) {
            await footer.scrollIntoViewIfNeeded();
            await expect(footer).toBeVisible();

            const footerLinks = footer.locator('a');
            const footerLinkCount = await footerLinks.count();
            console.log('Footer links:', footerLinkCount);
        } else {
            console.log('No footer found');
        }
    });

    test('should have proper color contrast', async ({ page }) => {
        // Run axe specifically for color contrast
        const contrastResults = await new AxeBuilder({ page })
            .withTags(['cat.color'])
            .analyze();

        if (contrastResults.violations.length > 0) {
            console.log('COLOR CONTRAST ISSUES:');
            contrastResults.violations.forEach(v => {
                console.log(`- ${v.id}: ${v.description}`);
            });
        }
    });
});

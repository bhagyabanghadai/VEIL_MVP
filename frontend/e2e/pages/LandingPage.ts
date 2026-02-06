import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LandingPage extends BasePage {
    readonly heroSection: Locator;
    readonly loginButton: Locator;
    readonly getStartedButton: Locator;
    readonly navigationLinks: Locator;
    readonly featuresSection: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('section').first();
        this.loginButton = page.getByRole('button', { name: /login/i })
            .or(page.getByRole('link', { name: /login/i }))
            .or(page.locator('a[href*="login"]'));
        this.getStartedButton = page.getByRole('button', { name: /get started|start|launch/i })
            .or(page.getByRole('link', { name: /get started|start|launch/i }));
        this.navigationLinks = page.locator('nav a, header a');
        this.featuresSection = page.locator('[data-testid="features"], .features, section:has-text("feature")');
        this.footer = page.locator('footer');
    }

    async goto() {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }

    async verifyHeroVisible() {
        await expect(this.heroSection).toBeVisible();
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async getNavigationCount(): Promise<number> {
        return await this.navigationLinks.count();
    }

    async checkAllLinks(): Promise<{ href: string; status: 'ok' | 'broken' | 'empty' }[]> {
        const links = await this.page.locator('a[href]').all();
        const results: { href: string; status: 'ok' | 'broken' | 'empty' }[] = [];

        for (const link of links) {
            const href = await link.getAttribute('href');
            if (!href || href === '#') {
                results.push({ href: href || 'null', status: 'empty' });
            } else {
                results.push({ href, status: 'ok' });
            }
        }
        return results;
    }

    async checkResponsiveness() {
        const viewports = [
            { width: 375, height: 667, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1280, height: 800, name: 'desktop' },
            { width: 1920, height: 1080, name: 'wide' },
        ];

        for (const vp of viewports) {
            await this.page.setViewportSize({ width: vp.width, height: vp.height });
            await this.takeScreenshot(`landing-${vp.name}`);
        }
    }
}

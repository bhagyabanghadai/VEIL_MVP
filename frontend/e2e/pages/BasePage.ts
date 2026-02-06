import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly loadingIndicators: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loadingIndicators = page.locator('[data-loading], .loading, .spinner');
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForNoLoaders() {
        await expect(this.loadingIndicators.first()).toBeHidden({ timeout: 10000 }).catch(() => {
            // Loaders may not exist, that's fine
        });
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({
            path: `e2e-screenshots/${name}.png`,
            fullPage: true
        });
    }

    async checkForConsoleErrors(): Promise<string[]> {
        const errors: string[] = [];
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        return errors;
    }

    async checkForJSErrors(): Promise<string[]> {
        const errors: string[] = [];
        this.page.on('pageerror', err => {
            errors.push(err.message);
        });
        return errors;
    }
}

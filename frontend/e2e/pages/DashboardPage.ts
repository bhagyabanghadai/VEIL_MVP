import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly sidebar: Locator;
    readonly mainContent: Locator;
    readonly header: Locator;
    readonly logoutButton: Locator;
    readonly navigationItems: Locator;
    readonly welcomeMessage: Locator;
    readonly statsCards: Locator;
    readonly charts: Locator;
    readonly profileMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.sidebar = page.locator('nav, aside, [class*="sidebar"], [data-testid="sidebar"]');
        this.mainContent = page.locator('main, [role="main"], [class*="content"]');
        this.header = page.locator('header');
        this.logoutButton = page.getByRole('button', { name: /logout|sign out/i })
            .or(page.locator('[data-testid="logout"]'));
        this.navigationItems = page.locator('nav a, aside a, [class*="sidebar"] a');
        this.welcomeMessage = page.locator('h1, h2').filter({ hasText: /welcome|dashboard|command/i });
        this.statsCards = page.locator('[class*="card"], [class*="stat"], [data-testid*="stat"]');
        this.charts = page.locator('canvas, svg[class*="chart"], [class*="chart"]');
        this.profileMenu = page.locator('[data-testid="profile"], [class*="profile"], [aria-label*="profile"]');
    }

    async goto() {
        await this.page.goto('/dashboard');
        await this.waitForPageLoad();
    }

    async verifyDashboardLoaded() {
        await expect(this.mainContent).toBeVisible();
    }

    async getNavigationItems(): Promise<string[]> {
        const items = await this.navigationItems.allTextContents();
        return items.filter(text => text.trim().length > 0);
    }

    async navigateTo(section: string) {
        await this.page.getByRole('link', { name: new RegExp(section, 'i') })
            .or(this.page.locator(`a:has-text("${section}")`))
            .first()
            .click();
        await this.waitForPageLoad();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async checkAllDashboardSections(): Promise<{ section: string; visible: boolean }[]> {
        const sections = ['agents', 'policies', 'audit', 'settings'];
        const results: { section: string; visible: boolean }[] = [];

        for (const section of sections) {
            try {
                await this.navigateTo(section);
                await this.page.waitForTimeout(1000);
                const visible = await this.mainContent.isVisible();
                results.push({ section, visible });
            } catch {
                results.push({ section, visible: false });
            }
        }
        return results;
    }
}

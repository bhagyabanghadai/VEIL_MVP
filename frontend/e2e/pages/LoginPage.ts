import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    // Step 1: Username/Email input
    readonly usernameInput: Locator;
    readonly continueButton: Locator;

    // Step 2: Password input  
    readonly passwordInput: Locator;
    readonly verifyButton: Locator;
    readonly backButton: Locator;

    // General
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signUpButton: Locator;
    readonly loginButton: Locator;
    readonly googleSignInButton: Locator;
    readonly formContainer: Locator;

    // Legacy compatibility aliases
    readonly emailInput: Locator;

    constructor(page: Page) {
        super(page);

        // Step 1 elements - username entry
        this.usernameInput = page.getByLabel(/username|email/i)
            .or(page.locator('input[name="username"]'))
            .or(page.locator('input#username-input'))
            .or(page.locator('input[placeholder*="Username" i]'));

        this.continueButton = page.getByRole('button', { name: /continue to password/i })
            .or(page.locator('button[aria-label*="Continue"]'));

        // Step 2 elements - password entry
        this.passwordInput = page.getByLabel(/password/i)
            .or(page.locator('input[type="password"]'))
            .or(page.locator('input[name="password"]'))
            .or(page.locator('input#password-input'));

        this.verifyButton = page.getByRole('button', { name: /verify identity|mint identity/i });
        this.backButton = page.getByRole('button', { name: /back/i });

        // General elements
        this.errorMessage = page.locator('[role="alert"]')
            .or(page.locator('.error, [class*="error"], [data-testid="error"]'));
        this.forgotPasswordLink = page.getByRole('link', { name: /forgot/i })
            .or(page.locator('a[href*="forgot"]'));
        this.signUpButton = page.getByRole('button', { name: /signup/i });
        this.loginButton = page.getByRole('button', { name: /login|log in/i });
        this.googleSignInButton = page.getByRole('button', { name: /google/i });
        this.formContainer = page.locator('form');

        // Legacy alias for backwards compatibility
        this.emailInput = this.usernameInput;
    }

    async goto() {
        await this.page.goto('/login');
        await this.waitForPageLoad();
    }

    /**
     * Complete login flow - handles multi-step form
     */
    async login(username: string, password: string) {
        // Step 1: Enter username and proceed
        await this.usernameInput.fill(username);
        await this.continueButton.click();

        // Wait for step 2 to appear
        await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });

        // Step 2: Enter password and submit
        await this.passwordInput.fill(password);
        await this.verifyButton.click();
    }

    /**
     * Enter username only (step 1)
     */
    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
        await this.continueButton.click();
        await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    }

    async verifyStep1Elements() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.continueButton).toBeVisible();
    }

    async verifyStep2Elements() {
        await expect(this.passwordInput).toBeVisible();
        await expect(this.verifyButton).toBeVisible();
        await expect(this.backButton).toBeVisible();
    }

    async verifyFormElements() {
        await this.verifyStep1Elements();
    }

    async getErrorMessage(): Promise<string | null> {
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
            return await this.errorMessage.textContent();
        } catch {
            return null;
        }
    }

    async goBackToStep1() {
        await this.backButton.click();
        await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
    }
}

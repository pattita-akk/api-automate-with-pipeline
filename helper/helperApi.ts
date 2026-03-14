import { expect, APIResponse } from '@playwright/test';

export class Product {
    static async getProduct(response: APIResponse): Promise <void> {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.products).toBeDefined();
    }
}
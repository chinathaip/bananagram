import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("http://localhost:3000/");
	await page.getByRole("link", { name: "About us" }).click();
	await page.getByRole("link", { name: "About us" }).click({
		button: "right"
	});
	await expect(page.getByText("1").first()).toBeVisible();
});

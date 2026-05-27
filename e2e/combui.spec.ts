import { test, expect } from "@playwright/test";

test.describe("CombUI page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the page header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /combui/i })).toBeVisible();
    await expect(
      page.getByText(/describe a component and watch it come to life/i)
    ).toBeVisible();
  });

  test("shows the prompt input and generate button", async ({ page }) => {
    const input = page.getByPlaceholder(/describe the component/i);
    await expect(input).toBeVisible();
    await expect(input).not.toBeDisabled();

    await expect(page.getByRole("button", { name: /generate/i })).toBeVisible();
  });

  test("shows the empty state initially", async ({ page }) => {
    await expect(
      page.getByText(/generated code will appear here/i)
    ).toBeVisible();
  });

  test("shows the preview placeholder initially", async ({ page }) => {
    await expect(
      page.getByText(/live preview will appear here/i)
    ).toBeVisible();
  });

  test("shows the theme toggle button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /switch to dark mode/i })
    ).toBeVisible();
  });

  test("input is empty by default", async ({ page }) => {
    const input = page.getByPlaceholder(/describe the component/i);
    await expect(input).toHaveValue("");
  });

  test("typing a prompt and pressing generate submits it", async ({ page }) => {
    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a blue button");
    await page.getByRole("button", { name: /generate/i }).click();

    // The input should be disabled while loading
    await expect(input).toBeDisabled();

    // A Cancel button should appear instead of Generate
    await expect(
      page.getByRole("button", { name: /cancel/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /generate/i })
    ).not.toBeVisible();
  });

  test("shows loading state while generating", async ({ page }) => {
    // Intercept the API call and delay it
    await page.route("**/api/generate", async (route) => {
      await new Promise((r) => setTimeout(r, 5000));
      const payload = JSON.stringify({ choices: [{ delta: { content: "test" } }] });
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: `data: ${payload}\n\ndata: [DONE]\n\n`,
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a button");
    await page.getByRole("button", { name: /generate/i }).click();

    // Loading indicator should appear
    await expect(page.getByText(/waiting for response/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
  });

  test("cancels an in-flight generation", async ({ page }) => {
    // Use a long delay so we can hit cancel before it completes
    await page.route("**/api/generate", async (route) => {
      await new Promise((r) => setTimeout(r, 30_000));
      const payload = JSON.stringify({ choices: [{ delta: { content: "test" } }] });
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: `data: ${payload}\n\ndata: [DONE]\n\n`,
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a card");
    await page.getByRole("button", { name: /generate/i }).click();

    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
    await expect(input).toBeDisabled();

    await page.getByRole("button", { name: /cancel/i }).click();

    // Wait for React state to settle after the abort
    await expect(async () => {
      await expect(input).not.toBeDisabled();
    }).toPass({ timeout: 10_000 });

    await expect(
      page.getByRole("button", { name: /generate/i })
    ).toBeVisible();
  });

  test("displays an error from the API", async ({ page }) => {
    await page.route("**/api/generate", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "Too many requests. Please try again later." }),
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a button");
    await page.getByRole("button", { name: /generate/i }).click();

    await expect(
      page.getByText("Too many requests. Please try again later.")
    ).toBeVisible();

    // Should show a "Try again" link
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("dismisses the error when Try Again is clicked", async ({ page }) => {
    await page.route("**/api/generate", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "Too many requests. Please try again later." }),
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a button");
    await page.getByRole("button", { name: /generate/i }).click();

    await expect(page.getByText("Too many requests")).toBeVisible();
    await page.getByRole("button", { name: /try again/i }).click();

    // Error should be gone, back to normal state
    await expect(page.getByText("Too many requests")).not.toBeVisible();
    await expect(input).not.toBeDisabled();
  });

  test("renders the generated code on screen", async ({ page }) => {
    const code = 'function Button() { return <button style={{color:\"red\"}}>Click</button>; }';

    await page.route("**/api/generate", async (route) => {
      const payload = JSON.stringify({
        choices: [{ delta: { content: code + "\n\nrender(<Button />)" } }],
      });
      const body = `data: ${payload}\n\ndata: [DONE]\n\n`;
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body,
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a red button");
    await page.getByRole("button", { name: /generate/i }).click();

    // The code should appear with syntax highlighting applied
    await expect(page.locator("pre code")).toBeVisible();
    // "Click" appears in both the code display AND the live preview (rendered button).
    // Use .first() to avoid strict-mode ambiguity.
    await expect(page.getByText("Click").first()).toBeVisible();
  });

  test("copy button becomes enabled when code is present", async ({ page }) => {
    await page.route("**/api/generate", async (route) => {
      const payload = JSON.stringify({
        choices: [{ delta: { content: "const X = () => null;\n\nrender(<X />)" } }],
      });
      const body = `data: ${payload}\n\ndata: [DONE]\n\n`;
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body,
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a button");
    await page.getByRole("button", { name: /generate/i }).click();

    const copyButton = page.getByRole("button", { name: /copy/i });
    await expect(copyButton).toBeVisible();
    await expect(copyButton).not.toBeDisabled();
  });

  test("prevents submitting an empty prompt", async ({ page }) => {
    // Simulate a real user on the form — clicking Generate with empty input
    await page.getByRole("button", { name: /generate/i }).click();

    // No loading state should appear
    await expect(
      page.getByRole("button", { name: /generate/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /cancel/i })
    ).not.toBeVisible();
  });

  test("toggles the theme", async ({ page }) => {
    // Initially the toggle says "Switch to dark mode" (light mode by default)
    const toggleButton = page.getByRole("button", { name: /switch to dark mode/i });

    await expect(toggleButton).toBeVisible();

    await toggleButton.click();

    // Should now switch to dark mode label
    await expect(
      page.getByRole("button", { name: /switch to light mode/i })
    ).toBeVisible();

    // The html element should have the dark class
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("persists theme preference across reloads", async ({ page }) => {
    const toggleButton = page.getByRole("button", { name: /switch to dark mode/i });
    await toggleButton.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Reload
    await page.reload();

    // Theme should still be dark
    await expect(
      page.getByRole("button", { name: /switch to light mode/i })
    ).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("inputs cannot be submitted while already loading", async ({ page }) => {
    // Use a long delay so we can observe the loading state
    await page.route("**/api/generate", async (route) => {
      await new Promise((r) => setTimeout(r, 30_000));
      const payload = JSON.stringify({ choices: [{ delta: { content: "test" } }] });
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: `data: ${payload}\n\ndata: [DONE]\n\n`,
      });
    });

    const input = page.getByPlaceholder(/describe the component/i);
    await input.fill("a button");
    await page.getByRole("button", { name: /generate/i }).click();

    await expect(input).toBeDisabled();

    // Cancel to clean up
    await page.getByRole("button", { name: /cancel/i }).click();
  });
});
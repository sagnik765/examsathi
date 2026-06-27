// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/react";
import { App, resetPersistentStore } from "./App.jsx";
import { analyzeWellness, createSeedEntries, getSupportState } from "./lib/wellness.js";

afterEach(() => {
  cleanup();
  resetPersistentStore();
});

describe("wellness analysis", () => {
  it("builds a warning state from the seeded week", () => {
    const analysis = analyzeWellness(createSeedEntries());
    const state = getSupportState(analysis);

    expect(state.label).toMatch(/warning/i);
    expect(analysis.topTriggerLabel).toBe("Comparison");
    expect(analysis.avgSleep).toBeLessThan(6.5);
  });
});

describe("App interactions", () => {
  it("sends a grounded Saathi reply from the live chat", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByLabelText(/talk to saathi/i),
      "I keep comparing marks and sleeping late.",
    );
    await user.click(screen.getByRole("button", { name: /send to saathi/i }));

    expect(screen.getByText(/comparison appears/i)).toBeInTheDocument();
    expect(screen.getByText(/average sleep/i)).toBeInTheDocument();
  });

  it("saves a new journal check-in and updates the recent log", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText(/^date$/i));
    await user.type(screen.getByLabelText(/^date$/i), "2026-06-27");
    await user.clear(screen.getByLabelText(/what happened today/i));
    await user.type(
      screen.getByLabelText(/what happened today/i),
      "Comparison after the mock felt heavy, and I studied until 1:20 AM.",
    );

    await user.click(screen.getByRole("button", { name: /save check-in/i }));

    expect(
      screen.getByText(/comparison after the mock felt heavy/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/check-in saved and patterns updated/i)).toBeInTheDocument();
  });

  it("queues a peer support request from the connect tab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /^connect$/i })[0]);
    await user.click(screen.getAllByRole("button", { name: /join circle/i })[0]);

    expect(screen.getByText(/queued/i)).toBeInTheDocument();
    expect(screen.getByText(/peer support requested/i)).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/react";
import { App, resetPersistentStore } from "./App.jsx";
import {
  analyzeWellness,
  buildSaathiReply,
  createSeedEntries,
  getScaleSignalCoverage,
  getSupportState,
} from "./lib/wellness.js";

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

  it("reports scale evidence coverage without presenting a clinical score", () => {
    const coverage = getScaleSignalCoverage(createSeedEntries());

    expect(coverage).toHaveLength(3);
    expect(coverage.find((scale) => scale.id === "pss10").matchedItems).toBeGreaterThan(0);
    expect(coverage.every((scale) => scale.matchedItems <= scale.totalItems)).toBe(true);
  });
});

describe("App interactions", () => {
  it("switches between screens without leaving the app static", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /^community$/i })[0]);

    expect(screen.getByText(/connect with students for the same exam/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^safety$/i }).length).toBeGreaterThan(0);
  });

  it("sends a grounded Saathi reply from the live chat", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByLabelText(/talk to saathi/i),
      "I keep comparing marks and sleeping late.",
    );
    await user.click(screen.getByRole("button", { name: /send to saathi/i }));

    expect(screen.getByText(/comparison shows up/i)).toBeInTheDocument();
    expect(screen.getByText(/average sleep/i)).toBeInTheDocument();
  });

  it("saves a new journal check-in and updates the recent log", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /^check-in$/i })[0]);
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

    await user.click(screen.getAllByRole("button", { name: /^community$/i })[0]);
    await user.click(screen.getAllByRole("button", { name: /join circle/i })[0]);

    expect(screen.getByText(/peer circle request added/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^safety$/i }));
    expect(screen.getByText(/peer support requested/i)).toBeInTheDocument();
  });

  it("avoids repeating the same sleep advice when the user pushes back", () => {
    const analysis = analyzeWellness(createSeedEntries());
    const first = buildSaathiReply(
      "I feel behind after the mock and I keep sleeping late.",
      analysis,
      [],
    );
    const second = buildSaathiReply(
      "What good will sleeping at 12:30 do if I cannot concentrate anyway?",
      analysis,
      [{ role: "assistant", ...first }],
    );

    expect(second.text).toMatch(/concentration/i);
    expect(second.text).not.toMatch(/12:30/);
  });
});

import { describe, expect, it } from "vitest";
import { getSupportState } from "./App.jsx";

describe("getSupportState", () => {
  it("returns a warning state after three days of poor signals", () => {
    const state = getSupportState({ poorSleepDays: 3, highStressDays: 1 });
    expect(state.label).toBe("Warning");
    expect(state.tone).toBe("warning");
  });

  it("returns a critical state after seven days of poor signals", () => {
    const state = getSupportState({ poorSleepDays: 7, highStressDays: 2 });
    expect(state.label).toBe("Critical warning");
    expect(state.tone).toBe("critical");
  });
});

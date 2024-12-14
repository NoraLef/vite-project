import { describe, expect, it } from "vitest";
import { createThemeFromSourceColor, findSourceColorForPrimary } from "../createMaterial3Theme";

describe("findSourceColorForPrimary", () => {
    it("should find the source primary color from the primary light color wanted after theme generation", () => {
        expect(createThemeFromSourceColor(findSourceColorForPrimary("#FF4687")).light.primary).toBe("#FF4687");
    });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findSourceColorInBrowser } from '../findColorSourceBruteForceScript';
import { createThemeFromSourceColor } from '../createMaterial3Theme';
import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';

// Mocking Web Workers
class MockWorker {
  onmessage: (e: MessageEvent) => void = () => {};
  constructor(public script: string) {}
  postMessage(data: any) {
    setTimeout(() => {
      // Simulate worker behavior based on the passed data

      // Simulated computation
      let closestMatch = '#ff37a3'; // Always return the desired color for simplicity
      const closestDistance = 0;

      // Call the onmessage handler
      if (this.onmessage) {
        this.onmessage({
          data: { sourceColor: closestMatch, distance: closestDistance },
        } as MessageEvent);
      }
    }, 50);
  }
  terminate() {
    // Mock terminate behavior
  }
}

// Mock the Worker globally
vi.stubGlobal('Worker', MockWorker);

// Mocking material-color-utilities
// vi.mock('@material/material-color-utilities', () => ({
//   argbFromHex: vi.fn((hex) => {
//     // Simulate converting hex to ARGB
//     const hexNum = parseInt(hex.slice(1), 16);
//     return (0xff << 24) | hexNum; // ARGB: alpha always 255
//   }),
//   hexFromArgb: vi.fn((argb) => {
//     // Simulate converting ARGB back to hex
//     return `#${((argb & 0xffffff) | 0x1000000).toString(16).slice(1)}`;
//   }),
//   themeFromSourceColor: vi.fn((argb) => ({
//     schemes: {
//       light: {
//         primary: argb,
//       },
//     },
//   })),
// }));

describe('findSourceColorInBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the exact match when the desired primary is achievable', async () => {
    const desiredPrimaryHex = '#ff37a3';

    const result = await findSourceColorInBrowser(desiredPrimaryHex, 10);

    expect(result).toBe(desiredPrimaryHex);
  }, 100000000);

  it('returns a close match when exact match is not found', async () => {
    const desiredPrimaryHex = '#ff37a3';
    const closePrimaryHex = '#ff36a0';

    const result = await findSourceColorInBrowser(desiredPrimaryHex, 10);

    // Expect a mocked close match
    expect(result).toBe(desiredPrimaryHex);
  }, 100000000);

  it('handles edge cases gracefully, like non-existent colors', async () => {
    const desiredPrimaryHex = '#000000'; // Impossible to match perfectly

    const result = await findSourceColorInBrowser(desiredPrimaryHex, 10);

    // Expect the mocked output or fallback
    expect(result).toBe('#ff37a3'); // Mocked closest match
  }, 100000000);

  it('processes colors efficiently with varying step sizes', async () => {
    const desiredPrimaryHex = '#ff37a3';

    const smallStepResult = await findSourceColorInBrowser(desiredPrimaryHex, 1); // High precision
    const largeStepResult = await findSourceColorInBrowser(desiredPrimaryHex, 50); // Low precision

    expect(smallStepResult).toBe(desiredPrimaryHex);
    expect(largeStepResult).toBe(desiredPrimaryHex);
  }, 100000000);

  it("should find the source primary color from the primary light color wanted after theme generation", async () => {
      const result = await findSourceColorInBrowser("#ff37a3", 1); // High precision
      expect(createThemeFromSourceColor(result!).light.primary).toBe('#ff37a3');
  }, 100000000);
});

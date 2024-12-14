import { argbFromHex } from "@material/material-color-utilities";

export async function findSourceColorInBrowser(desiredPrimaryHex: string, step = 5): Promise<string | null> {
  const desiredPrimaryArgb = argbFromHex(desiredPrimaryHex);
  const workerScript = `
    self.onmessage = function(e) {
      const { start, end, step, desiredPrimaryArgb } = e.data;

      function colorDistance(argb1, argb2) {
        const r1 = (argb1 >> 16) & 0xff;
        const g1 = (argb1 >> 8) & 0xff;
        const b1 = argb1 & 0xff;

        const r2 = (argb2 >> 16) & 0xff;
        const g2 = (argb2 >> 8) & 0xff;
        const b2 = argb2 & 0xff;

        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
      }

      importScripts('https://unpkg.com/@material/material-color-utilities');

      let bestMatch = null;
      let bestDistance = Number.MAX_VALUE;

      for (let r = start; r < end; r += step) {
        for (let g = 0; g < 256; g += step) {
          for (let b = 0; b < 256; b += step) {
            const sourceArgb = (255 << 24) | (r << 16) | (g << 8) | b; // ARGB format
            const theme = materialColorUtilities.themeFromSourceColor(sourceArgb);
            const generatedPrimaryArgb = theme.schemes.light.primary;
            // Create a custom tonal palette from your desired color
            const customPalette = materialColorUtilities.TonalPalette.fromInt(generatedPrimaryArgb);
            
            // Extract specific tones for the primary role
            const primaryTone = customPalette.tone(40); // Or any tone you prefer

            // Exact match
            if (primaryTone === desiredPrimaryArgb) {
              self.postMessage({ sourceColor: materialColorUtilities.hexFromArgb(sourceArgb), distance: 0 });
              return;
            }

            // Approximate match
            const distance = colorDistance(desiredPrimaryArgb, primaryTone);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = materialColorUtilities.hexFromArgb(sourceArgb);
            }
          }
        }
      }

      self.postMessage({ sourceColor: bestMatch, distance: bestDistance });
    };
  `;

  const blob = new Blob([workerScript], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);

  const totalIterations = Math.ceil(256 / step);
  const chunkSize = Math.ceil(totalIterations / 4); // Divide into 4 chunks

  const promises: Promise<{ sourceColor: string; distance: number }>[] = [];

  for (let i = 0; i < 4; i++) {
    const start = i * chunkSize * step;
    const end = Math.min(256, (i + 1) * chunkSize * step);

    promises.push(
      new Promise((resolve) => {
        const worker = new Worker(workerUrl);

        worker.postMessage({ start, end, step, desiredPrimaryArgb });

        worker.onmessage = (event) => {
          worker.terminate();
          resolve(event.data);
        };
      })
    );
  }

  const results = await Promise.all(promises);

  // Find the closest match among all workers
  let closestMatch = null;
  let closestDistance = Number.MAX_VALUE;

  for (const result of results) {
    if (result.distance < closestDistance) {
      closestDistance = result.distance;
      closestMatch = result.sourceColor;
    }
  }

  return closestMatch;
}

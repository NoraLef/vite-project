import type { Scheme } from "@material/material-color-utilities";
import {
 argbFromHex,
 hexFromArgb,
 themeFromSourceColor,
 TonalPalette,
} from "@material/material-color-utilities";
import color from "color";

// import type {
//  Material3Scheme,
//  Material3Theme,
//  SystemScheme,
// } from "../ExpoMaterial3Theme.types";

const opacity = {
 level1: 0.08,
 level2: 0.12,
 level3: 0.16,
 level4: 0.38,
};

const elevations = ["transparent", 0.05, 0.08, 0.11, 0.12, 0.14];

export function createThemeFromSystemSchemes(schemes: {
 light: any;
 dark: any;
}): any {
 const { light, dark, palettes } = generateSchemesFromSourceColor(
  schemes.light.primary,
 );
 schemes = {
  light: { ...light, ...schemes.light },
  dark: { ...dark, ...schemes.dark },
 };

 return {
  light: {
   ...schemes.light,
   ...generateMissingFields(schemes.light, palettes),
  } as any,
  dark: {
   ...schemes.dark,
   ...generateMissingFields(schemes.dark, palettes),
  } as any,
 };
}

export function createThemeFromSourceColor(
 sourceColor: string,
): any {
 const { light, dark, palettes } = generateSchemesFromSourceColor(sourceColor);

 return {
  light: {
   ...light,
   ...generateMissingFields(light, palettes),
  } as any,
  dark: {
   ...dark,
   ...generateMissingFields(dark, palettes),
  } as any,
 };
}

function generateMissingFields(scheme: any, palettes: any) {
 const elevation = elevations.reduce(
  (acc, value, index) => ({
   ...acc,
   [`level${index}`]:
    index === 0
     ? value
     : color(scheme.surface)
       .mix(color(scheme.primary), Number(value))
       .hex(),
  }),
  {},
 ) as any;

 const customColors = {
  surfaceDisabled: color(scheme.onSurface)
   .alpha(opacity.level2)
   .rgb()
   .string(),
  onSurfaceDisabled: color(scheme.onSurface)
   .alpha(opacity.level4)
   .rgb()
   .string(),
  backdrop: color(palettes.neutralVariant.tone(20)).alpha(0.4).rgb().string(),
 };

 return { elevation, ...customColors };
}

function generateSchemesFromSourceColor(sourceColor: string) {
 const { schemes, palettes } = themeFromSourceColor(argbFromHex(sourceColor));

 // Create a custom tonal palette from your desired color
const customPalette = TonalPalette.fromInt(argbFromHex(sourceColor));

// Extract specific tones for the primary role
const primaryTone = customPalette.tone(40); // Or any tone you prefer

// Convert to hex
const primaryHex = hexFromArgb(primaryTone);
console.log("Custom Primary Color:", primaryHex);

 console.log(sourceColor);
 console.log(hexFromArgb(schemes.light.primary));

 return {
  light: transformScheme(schemes.light),
  dark: transformScheme(schemes.dark),
  palettes,
 };
}

function transformScheme(scheme: Scheme) {
 const jsonScheme = scheme.toJSON();
 type SchemeKeys = keyof typeof jsonScheme;

 return Object.entries(jsonScheme).reduce(
  (acc, [key, value]) => {
   return {
    ...acc,
    [key]: color(value).hex(),
   };
  },
  {} as { [key in SchemeKeys]: string },
 );
}

// Function to estimate initial guess for the source color
const guessInitialSourceColor = (desiredPrimary: string) => {
 const desiredPrimaryArgb = argbFromHex(desiredPrimary);

 // Start with the desired primary color itself
 let sourceColor = desiredPrimaryArgb;

 let smallestDifference = Infinity;
 let bestGuess = sourceColor;

 for (let i = 0; i < 100; i++) {
  const { schemes } = themeFromSourceColor(sourceColor);
  const generatedPrimary = schemes.light.primary;

  // Calculate difference between generated primary and desired primary
  const r1 = (desiredPrimaryArgb >> 16) & 0xff;
  const g1 = (desiredPrimaryArgb >> 8) & 0xff;
  const b1 = desiredPrimaryArgb & 0xff;

  const r2 = (generatedPrimary >> 16) & 0xff;
  const g2 = (generatedPrimary >> 8) & 0xff;
  const b2 = generatedPrimary & 0xff;

  const difference = Math.sqrt(
   (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2,
  );

  // Update the best guess if this is closer
  if (difference < smallestDifference) {
   smallestDifference = difference;
   bestGuess = sourceColor;

   // Stop if the difference is negligible
   if (difference < 1) break;
  }

  // Adjust the source color dynamically to refine the guess
  const adjustment = Math.round(5 * (Math.random() - 0.5)); // Random slight adjustment
  const r = Math.min(
   255,
   Math.max(0, ((sourceColor >> 16) & 0xff) + adjustment),
  );
  const g = Math.min(
   255,
   Math.max(0, ((sourceColor >> 8) & 0xff) + adjustment),
  );
  const b = Math.min(255, Math.max(0, (sourceColor & 0xff) + adjustment));

  sourceColor = (255 << 24) | (r << 16) | (g << 8) | b;
 }

 return hexFromArgb(bestGuess);
};

// Main function to find source color
export const findSourceColorForDesiredPrimary = (
 desiredPrimary: string,
 maxIterations = 1000,
) => {
 // Use the dynamic guess as the initial source color
 const initialGuess = argbFromHex(guessInitialSourceColor(desiredPrimary));

 let sourceColor = initialGuess;
 let bestMatch = sourceColor;
 let smallestDifference = Infinity;

 // Helper to calculate color difference
 const colorDifference = (color1: number, color2: number) => {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
 };

 for (let i = 0; i < maxIterations; i++) {
  const { schemes } = themeFromSourceColor(sourceColor);
  const generatedPrimary = schemes.light.primary;

  const difference = colorDifference(
   argbFromHex(desiredPrimary),
   generatedPrimary,
  );

  if (difference < smallestDifference) {
   smallestDifference = difference;
   bestMatch = sourceColor;

   if (difference < 1) break;
  }

  const adjustment = Math.round(10 * (Math.random() - 0.5)); // Random adjustment
  const r = Math.min(
   255,
   Math.max(0, ((sourceColor >> 16) & 0xff) + adjustment),
  );
  const g = Math.min(
   255,
   Math.max(0, ((sourceColor >> 8) & 0xff) + adjustment),
  );
  const b = Math.min(255, Math.max(0, (sourceColor & 0xff) + adjustment));

  sourceColor = (255 << 24) | (r << 16) | (g << 8) | b;
 }

 return hexFromArgb(bestMatch);
};

export const findApproxSourceColor = (knownPrimary: string) => {
 const targetPrimaryArgb = argbFromHex(knownPrimary);
 let bestMatchSource = null;
 let smallestDifference = Infinity;

 while (bestMatchSource !== targetPrimaryArgb) {
  // Generate a random source color (or refine intelligently)
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const sourceColor = (255 << 24) | (r << 16) | (g << 8) | b;

  // const { schemes } = themeFromSourceColor(sourceColor);
  // const generatedPrimary = schemes.light.primary;
  const { light } = createThemeFromSourceColor(hexFromArgb(sourceColor));
  const generatedPrimary = argbFromHex(light.primary);

  // Calculate color difference
  const difference =
   Math.abs(
    (generatedPrimary >> 16) & (0xff - (targetPrimaryArgb >> 16)) & 0xff,
   ) +
   Math.abs(
    (generatedPrimary >> 8) & (0xff - (targetPrimaryArgb >> 8)) & 0xff,
   ) +
   Math.abs(generatedPrimary & (0xff - targetPrimaryArgb) & 0xff);

  console.log({ generatedPrimary: hexFromArgb(generatedPrimary) });
  console.log({ knownPrimary });
  if (difference < smallestDifference) {
   smallestDifference = difference;
   bestMatchSource = sourceColor;

   // Stop early if very close
   if (difference < 0.1) break;
  }
 }

 return bestMatchSource != null ? hexFromArgb(bestMatchSource) : "Not found";
};

// Helper function to search for a source color that maps to the desired primary
export function findSourceColorForPrimary(
 targetPrimary: string,
): string {
 const targetArgb = argbFromHex(targetPrimary);

 for (let r = 0; r < 256; r++) {
  for (let g = 0; g < 256; g++) {
   for (let b = 0; b < 256; b++) {
    const sourceArgb = (255 << 24) | (r << 16) | (g << 8) | b; // ARGB format
    // const theme = themeFromSourceColor(sourceArgb);
    // const generatedPrimary = theme.schemes.light.primary;
    const { light } = createThemeFromSourceColor(hexFromArgb(sourceArgb));
    const generatedPrimary = light.primary;
    // Create a custom tonal palette from your desired color
    const customPalette = TonalPalette.fromInt(generatedPrimary);
            
    // Extract specific tones for the primary role
    const primaryTone = customPalette.tone(40); // Or any tone you prefer

    // if (generatedPrimary === targetArgb) {
      if (primaryTone === targetArgb) {
      console.log({ primaryTone });
      console.log({ targetPrimary });
      console.log("result: ", hexFromArgb(sourceArgb));
     return hexFromArgb(sourceArgb); // Matching source color
    }
   }
  }
 }

 return "Not Found"; // No match found
}
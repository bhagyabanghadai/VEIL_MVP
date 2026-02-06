# Design System: VEIL Security
**Project ID:** VEIL-V2-REBUILD
**Theme:** "Ethereal Authority" (Billion Dollar Design)

## 1. Visual Theme & Atmosphere
**"The Glass Fortress"**
The aesthetic is calm, sophisticated, and deeply premium. It moves away from "hacker" tropes (scanlines, glitches, mono-color) to a "Product-First" executive feel.
- **Mood:** Effortless, Fluid, Expensive.
- **Lighting:** Soft, diffused ambient glows (Violet, Royal Blue). No harsh neons.
- **Materiality:** "Optical Glass". Surfaces catch light elegantly. Borders are whisper-thin.

## 2. Color Palette & Roles
*   **Void Navy (#020408):** The base. A black that hints at deep ocean.
*   **Glass Panel (#0F111A):** The container. Slightly lighter, translucent.
*   **Luminous Blue (#3B82F6):** Primary Brand. Clean, high-trust blue (Intercom/Stripe style).
*   **Royal Violet (#8B5CF6):** Secondary Gradient. Adds depth and "Intelligence".
*   **Titanium White (#FFFFFF):** Primary Text. Crisp.
*   **Liquid Metal (#94A3B8):** Secondary Text. Smooth grey.

## 3. Typography Rules
*   **Headings:** `Inter` (sans-serif). Tight tracking (-0.03em). Heavy weights (600/700) but not blocky.
*   **Body:** `Inter` (sans-serif). High readability.
*   **REMOVED:** `Rajdhani` (Industrial) and excessive `Mono`. Code snippets remain Mono, but UI labels are beautiful Sans.

## 4. Component Stylings
*   **Buttons (Primary):**
    *   Gradient `Royal Violet` to `Luminous Blue`.
    *   Soft outer glow (`shadow-lg shadow-blue-500/20`).
    *   Rounded-full (Pill shape) for a friendlier, modern feel (vs the aggressive sharp corners of Cyber).
*   **Cards (Ethereal):**
    *   Bg: `bg-white/[0.02]` (Very subtle).
    *   Border: `border-white/[0.05]`.
    *   Hover: Border becomes `border-blue-500/30`. Soft lift `translate-y-[-2px]`.
*   **Gradients:**
    *   Use "Conic" or "Radial" washes for backgrounds, never hard linear stripes.

## 5. Layout Principles
*   **Whitespace:** Increase padding by 20%. "Luxury is space."
*   **Alignment:** Center-aligned Hero. Left-aligned detailed features.

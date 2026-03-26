# Design System Document

## 1. Overview & Creative North Star

### Creative North Star: "The Neural Architect"
This design system is engineered to feel less like a static interface and more like a living, breathing command deck. It moves away from the "flat web" era into a high-fidelity, editorial experience that balances intense technical density with atmospheric depth. 

The system rejects the traditional rigid grid in favor of **intentional layering** and **glassmorphism**. By utilizing translucent surfaces and subtle glows, we create a sense of focused intelligence—where data doesn't just sit on a screen, but floats within a curated digital environment. Every element is designed to convey "Claude-builds" as an elite, automated, and highly efficient powerhouse.

---

## 2. Colors

The palette is anchored in deep cosmic tones, designed to reduce eye strain during long-term monitoring while highlighting critical data points through high-chroma accents.

### Color Tokens (Material Design Convention)
*   **Background:** `#080e1d` (Deep Navy)
*   **Primary:** `#3adffa` (Vibrant Cyan) — Use for active states and primary focus.
*   **Secondary:** `#699cff` (Electric Blue) — Use for secondary actions and flow indicators.
*   **Tertiary:** `#9bffce` (Emerald Green) — Success states and "Healthy" system status.
*   **Warning (Amber):** `#f59e0b` — Actionable alerts.
*   **Error:** `#ff716c` — Critical system failures.

### The "No-Line" Rule
To achieve a premium, cutting-edge aesthetic, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` for large section backgrounds against the `surface` base.
2.  **Tonal Transitions:** Define importance by shifting from `surface-container` to `surface-bright`.

### Signature Textures & Glassmorphism
Main containers must utilize **Glassmorphism**:
*   **Fill:** `surface-container` at 60-80% opacity.
*   **Blur:** 12px - 20px backdrop-filter.
*   **Glow:** Active elements should emit a subtle outer glow (`0px 0px 12px`) using their respective functional color (Cyan, Green, or Amber) to simulate light emission from a high-tech console.

---

## 3. Typography

The system utilizes a dual-font strategy to balance technical precision with modern readability.

*   **Primary Font:** `Pretendard` (for all Korean text and standard UI labels).
*   **Secondary/Display Font:** `Space Grotesk` (for English headers and 'Claude-builds' branding).

### Typography Scale
*   **Display-LG (3.5rem / Space Grotesk):** Hero branding and critical data aggregates.
*   **Headline-SM (1.5rem / Space Grotesk):** Section titles (e.g., "Active Agents", "Hooks Pipeline").
*   **Title-MD (1.125rem / Pretendard):** Card headings and modal titles.
*   **Body-MD (0.875rem / Pretendard):** Standard system logs and status descriptions.
*   **Label-SM (0.6875rem / Inter):** Small metadata, timestamps, and micro-labels.

---

## 4. Elevation & Depth

In this design system, elevation is conveyed through **Tonal Layering** and light physics rather than drop shadows.

*   **The Layering Principle:** Stack `surface-container` tiers to create hierarchy. A `surface-container-highest` card should sit on a `surface-container-low` section. This creates a "soft lift" that feels architectural.
*   **Ambient Shadows:** Use shadows only for floating overlays (tooltips/modals). Shadow color must be a tinted version of `on-surface` at 4-8% opacity with a large 32px blur to mimic soft ambient light.
*   **The Ghost Border:** For high-density data tables or agent cards, use a "Ghost Border"—the `outline-variant` token at 15% opacity. This provides structure without creating visual noise.
*   **Interaction Glow:** When an agent is "Active" or "Processing," apply a soft inner and outer glow using the Primary Cyan. This signifies a "powered-on" state.

---

## 5. Components

### Buttons & Chips
*   **Primary Action:** Cyan gradient (`primary` to `primary-container`) with a sharp `0.25rem` radius. Text is `on-primary`.
*   **Agent Chips:** Use glassmorphism. An "Idle" agent uses a neutral `surface-variant`, while a "Success" agent uses a subtle `tertiary` (Green) glow.
*   **Status Indicators:** Pulsing dots (Primary or Tertiary) are used to show live automation.

### Input Fields
*   **Style:** Minimalist. No background fill; only a bottom `Ghost Border`. On focus, the border transitions to a 100% opaque `primary` Cyan with a subtle 4px glow.

### Cards & Lists (Data Logging)
*   **Constraint:** No divider lines. Separate log entries using `surface-container-low` and `surface-container-highest` alternating backgrounds or simply a `2.5` (0.5rem) vertical gap.
*   **Historical Logs:** Use mono-spaced numbers for timestamps to maintain alignment. Status text (Success/Failed) should use the specific functional color without a background box to keep the look "editorial."

### High-Tech Visuals (Unique to Claude-builds)
*   **Flow Connectors:** Use thin, curved SVG paths between agent cards (Secondary Blue) with animated "data pulses" (Cyan) traveling along the lines to represent active communication.

---

## 6. Do's and Don'ts

### Do
*   **DO** use Korean for all instructional and status text (진행 중, 완료, 오류).
*   **DO** use high-contrast typography scales. If a title is large, make the metadata very small and subtle.
*   **DO** embrace "Dark Space." Use the Spacing Scale `20` and `24` to let critical metrics breathe.

### Don't
*   **DON'T** use pure white (#FFFFFF) for text. Use `on-surface` (#e0e5fb) to maintain the cinematic, low-glare feel.
*   **DON'T** use rounded corners larger than `xl` (0.75rem). The system should feel "sharp" and "precision-engineered," not "bubbly."
*   **DON'T** use standard 1px grey dividers. If you feel the need for a line, try using a 4px gap instead.

---

## 7. Language & Localization
While the branding 'Claude-builds' remains in English, all UI interaction points must be localized into Korean. 
*   **Success:** 완료 (Completed) / 성공 (Success)
*   **Warning:** 주의 (Warning) / 확인 필요 (Action Required)
*   **System Status:** 가동 중 (Running) / 대기 중 (Idle) / 오류 (Error)

This ensures the system feels like a bespoke tool crafted for its specific operational context.
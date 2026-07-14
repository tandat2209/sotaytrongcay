---
name: Botanical Mentor
colors:
  surface: "#fcf9f8"
  surface-dim: "#dcd9d9"
  surface-bright: "#fcf9f8"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f6f3f2"
  surface-container: "#f0eded"
  surface-container-high: "#eae7e7"
  surface-container-highest: "#e5e2e1"
  on-surface: "#1c1b1b"
  on-surface-variant: "#42493e"
  inverse-surface: "#313030"
  inverse-on-surface: "#f3f0ef"
  outline: "#72796e"
  outline-variant: "#c2c9bb"
  surface-tint: "#3b6934"
  primary: "#154212"
  on-primary: "#ffffff"
  primary-container: "#2d5a27"
  on-primary-container: "#9dd090"
  inverse-primary: "#a1d494"
  secondary: "#65558f"
  on-secondary: "#ffffff"
  secondary-container: "#cfbdfe"
  on-secondary-container: "#594982"
  tertiary: "#343a40"
  on-tertiary: "#ffffff"
  tertiary-container: "#4a5157"
  on-tertiary-container: "#bdc3cb"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#bcf0ae"
  primary-fixed-dim: "#a1d494"
  on-primary-fixed: "#002201"
  on-primary-fixed-variant: "#23501e"
  secondary-fixed: "#e9ddff"
  secondary-fixed-dim: "#cfbdfe"
  on-secondary-fixed: "#201047"
  on-secondary-fixed-variant: "#4d3d75"
  tertiary-fixed: "#dde3eb"
  tertiary-fixed-dim: "#c1c7cf"
  on-tertiary-fixed: "#161c22"
  on-tertiary-fixed-variant: "#41474e"
  background: "#fcf9f8"
  on-background: "#1c1b1b"
  surface-variant: "#e5e2e1"
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: "600"
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: "600"
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 16px
---

## Brand & Style

The design system is built to evoke the feeling of a calm, digital greenhouse. It balances the precision of a high-fidelity tool with the warmth of an organic hobby. The brand personality is **expert yet supportive**, positioning itself as a knowledgeable companion for gardeners of all levels.

The aesthetic follows a **Contemporary Professional** style—merging the structural clarity of Notion with the refined utility of Apple Health. It prioritizes content (plants and growth data) over decorative UI. Key characteristics include:

- **Serenity through Whitespace:** Generous margins and breathing room to lower cognitive load.
- **Organic Precision:** A mix of strict grid alignment with soft, natural rounded corners.
- **High Legibility:** High-contrast text and purposeful use of color to indicate plant health and environmental needs.

## Colors

The palette is rooted in nature. The **Primary Green** is deep and stable, used for core actions and brand presence. The **Secondary Purple** provides a sophisticated contrast, reserved for highlighting specific growth stages or "milestone" moments in the plant's life cycle.

The background uses a warm off-white to reduce eye strain compared to pure white, creating a "paper-like" feel. Semantic colors are desaturated to remain harmonious with the natural theme:

- **Rain/Humidity:** Soft Blue for hydration metrics.
- **Sunlight:** Amber for light requirements.
- **Alerts:** A muted Red for urgent care needs (pests, wilting).
- **Borders:** A consistent light grey used for structural definition.

## Typography

This design system utilizes **Inter** for its neutral, systematic character and exceptional legibility on mobile displays.

- **Headings:** Use semi-bold weights with slight negative letter-spacing to appear compact and authoritative.
- **Body Text:** Standard weight for maximum readability. Line heights are slightly increased (1.5x) to provide a comfortable reading experience for plant care guides.
- **Labels:** Used for metadata (e.g., "3 days ago") and navigation titles. Label-sm uses uppercase to provide visual distinction without increasing size.

## Layout & Spacing

The layout is built on a **Mobile-First 4px Baseline Grid**.

- **Margins:** Screens use a 16px side margin for standard content, increasing to 24px for editorial headers to emphasize whitespace.
- **Grid:** A standard 2-column or 1-column layout for plant cards.
- **Vertical Rhythm:** Elements are separated by 16px (related content) or 24px (new sections).
- **Safe Areas:** Adheres strictly to iOS/Android safe area insets for bottom navigation and status bars.

## Elevation & Depth

This design system uses a **Flat-Layered** approach. Instead of heavy drop shadows, depth is communicated through:

- **Tonal Layering:** The off-white background (#FAFAF7) serves as the base. Cards and modal sheets use pure White (#FFFFFF) to appear "elevated."
- **Thin Outlines:** 1px borders in #E5E7EB are the primary way to define container boundaries, ensuring a clean, modern look.
- **Subtle Ambient Shadow:** A single, very soft shadow level (Y: 2, Blur: 8, Opacity: 4%) is reserved for interactive floating elements like the FAB or Bottom Sheets to separate them from the scrolling content below.

## Shapes

The shape language is **friendly and modern**.

- **Standard Cards/Buttons:** Use 12px-16px corner radius.
- **Small Elements (Chips/Tags):** Use 8px radius.
- **Floating Action Button (FAB):** Fully circular (pill-shaped) to distinguish it as the primary global trigger.
- **Bottom Sheets:** Top corners are rounded at 24px to create a soft, welcoming "pull-up" interaction.

## Components

### Buttons

- **Primary:** Deep green background, white text. Min-height 48px for high touch-accuracy.
- **Secondary:** Transparent background, green border (1px), green text.
- **FAB:** Circular 56x56px, Primary Green with a white "+" icon. Positioned 16px from the bottom-right.

### Cards

- White background, 1px border (#E5E7EB), 12px-16px radius.
- Used for individual plant profiles, featuring a square image thumbnail on the left and care status on the right.

### Navigation

- **Bottom Bar:** 4 tabs (Hôm nay, Cây trồng, Nhật ký, Tôi).
- Active state: Primary Green icon and label.
- Inactive state: Mid-grey icon and label.
- Height: 64px + safe area.

### Progress Bars

- 8px height, rounded ends.
- Track color: #E5E7EB.
- Fill color: Dynamic (Green for health, Blue for water, Amber for light).

### Inputs & Selection

- **Input Fields:** 12px radius, light grey border, 16px padding.
- **Checkboxes:** Circular for a more organic feel than square, using Primary Green when checked.
- **Bottom Sheets:** Used for all "Quick Actions" (e.g., adding a watering log), featuring a centered grab-handle at the top.

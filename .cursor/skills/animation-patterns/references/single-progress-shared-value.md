# Single Progress Shared Value Pattern

## Overview

When coordinating multiple animations that must stay in sync, use a single "progress" shared value (typically ranging from 0 to 1) and interpolate all other animated values from it. This ensures smooth coordination and prevents desynchronization that can occur when animating multiple shared values independently.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Single Progress Shared Value                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  progress: SharedValue<number>                       │   │
│  │  Range: [0, 1]                                       │   │
│  │  - Single source of truth                            │   │
│  │  - Animated once with withTiming/withSpring          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Interpolated from
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Multiple Interpolated Values                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ translateY   │  │ scale        │  │ opacity      │   │
│  │ = interpolate│  │ = interpolate│  │ = interpolate│   │
│  │   (progress) │  │   (progress) │  │   (progress) │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │ rotation     │  │ perspective  │                      │
│  │ = interpolate│  │ = interpolate│                      │
│  │   (progress) │  │   (progress) │                      │
│  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Progress Shared Value

A single shared value that drives the entire animation sequence.

**What it provides:**
- Single source of truth for animation state
- Typically ranges from 0 (initial state) to 1 (final state)
- Animated once using `withTiming`, `withSpring`, or `withSequence`
- Can be driven by gestures, user interactions, or automatic sequences

### 2. Interpolated Values

All animated properties are derived from the progress value using `interpolate`.

**What it provides:**
- Guaranteed synchronization across all animated properties
- Smooth coordination without timing mismatches
- Easy to adjust animation curves and timing
- Single animation to control instead of multiple

### 3. Animated Styles

Each component uses `useAnimatedStyle` to read the progress value and compute interpolated values.

**What it provides:**
- UI thread execution (no JS thread jank)
- Automatic updates when progress changes
- Type-safe interpolation with proper ranges

## Pattern Flow

### Initialization
1. Create a single progress shared value (typically initialized to 0)
2. Define interpolation ranges for each animated property
3. Create animated styles that interpolate from progress

### Animation Execution
1. Animate the progress value once (e.g., `progress.set(withTiming(1))`)
2. All interpolated values automatically update in sync
3. No need to coordinate multiple animations

### Reversal/Reset
1. Animate progress back to initial state (e.g., `progress.set(withTiming(0))`)
2. All interpolated values smoothly reverse together
3. Guaranteed synchronization throughout the transition

## Key Concepts

### Why Single Progress Value?

**Problem with multiple independent animations:**
- Each animation may have slightly different timing
- Easing functions can cause desynchronization
- Spring animations can overshoot at different rates
- Difficult to ensure all animations complete together

**Solution with single progress value:**
- One animation drives everything
- All interpolated values stay perfectly in sync
- Easy to reverse or restart the entire sequence
- Single source of truth simplifies debugging

### Interpolation Ranges

Each animated property maps the progress range `[0, 1]` to its own output range:

```typescript
// Example: translateY from 100px to 0px
const translateY = interpolate(progress.get(), [0, 1], [100, 0]);

// Example: scale from 0.8 to 1.0
const scale = interpolate(progress.get(), [0, 1], [0.8, 1]);

// Example: opacity from 0 to 1
const opacity = interpolate(progress.get(), [0, 1], [0, 1]);
```

### Progress Value Range

The progress value typically ranges from `0` to `1`, representing:
- `0`: Initial/closed state
- `1`: Final/open state
- `0.5`: Midpoint of transition

This normalized range makes it easy to:
- Understand animation state at a glance
- Create consistent interpolation ranges
- Debug animation progress

### When to Use This Pattern

**Use this pattern when:**
- Multiple properties must animate together (translateY, scale, opacity, etc.)
- Animations must stay perfectly synchronized
- You need to reverse or restart the entire sequence
- Complex multi-property transitions (e.g., modal sheets, card flips, 3D transforms)

**Don't use this pattern when:**
- Properties animate independently (e.g., separate gesture handlers)
- Animations have different timing requirements
- Properties are driven by different user interactions

## Example References

The following examples demonstrate this pattern in the codebase. **These are reference implementations only and must not be used directly as source of truth.** Always follow the guidelines from:
- `.cursor/skills/animation-performance` - for performance optimizations
- `.cursor/skills/animation-with-react-compiler` - for React Compiler compatibility
- `.cursor/skills/animation-with-worklets` - for worklet scheduling patterns

### Apple Wallet Hold Near Reader Animation

**Slug:** `apple-wallet-hold-near-reader-animation`

**Reference files:**
- `src/apps/(a-c)/apple-wallet/routes/nfc-pay.tsx`

**Pattern highlights:**
- Single `progress` shared value (0 = phone tilted away, 1 = phone near reader)
- All 3D transforms interpolated from progress:
  - `perspective`: `interpolate(progress, [0, 1], [600, 800])`
  - `rotation`: `interpolate(progress, [0, 1], [25, 0])`
  - `scale`: `interpolate(progress, [0, 1], [0.96, 1])`
  - `translateY` (shadow): `interpolate(progress, [0, 1], [0, CIRCLE_SIZE * 0.85])`
- Infinite loop animation using `withRepeat` and `withSequence`
- All transforms stay perfectly synchronized throughout the animation cycle

### Shopify Menu Transition Animation

**Slug:** `shopify-menu-transition-animation`

**Reference files:**
- `src/apps/(s-t)/shopify/lib/providers/menu-provider.tsx`
- `src/apps/(s-t)/shopify/components/menu.tsx`
- `src/apps/(s-t)/shopify/components/animated-tabs-container.tsx`

**Pattern highlights:**
- Single `menuProgress` shared value (0 = closed, 1 = open) shared via context
- Multiple components interpolate from the same progress:
  - Container opacity: `interpolate(menuProgress, [0, 1], [0, 1])`
  - Header translateY: `interpolate(menuProgress, [0, 1], [translateYDistance, 0])`
  - List translateY: `interpolate(menuProgress, [0, 1], [translateYDistance, 0])`
  - List scale: `interpolate(menuProgress, [0, 1], [0.8, 1])`
  - Tabs container translateY: `interpolate(menuProgress, [0, 1], [0, 20])`
- Single `withSpring` animation drives entire menu transition
- All components stay synchronized across the app via context

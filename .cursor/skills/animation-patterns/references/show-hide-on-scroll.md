# Show/Hide on Scroll Pattern

## Overview

A pattern for showing and hiding UI elements (headers, tab bars, FABs, etc.) based on scroll direction and position. This pattern provides smooth, direction-aware animations that respond to user scroll behavior.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Provider Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AnimationContextProvider                          │   │
│  │  - Centralized scroll state                          │   │
│  │  - useScrollDirection() hook                         │   │
│  │  - Shared values: listOffsetY, scrollDirection      │   │
│  │  - Scroll handlers: onBeginDrag, onScroll            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Provides
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │   ContentList        │  │   AnimatedHeader         │   │
│  │   (Animated.FlatList)│  │   (Show/Hide Target)     │   │
│  │                      │  │                          │   │
│  │  - Uses scrollHandler│  │  - Reads scrollDirection │   │
│  │  - Provides listRef │  │  - Uses listOffsetY      │   │
│  │                      │  │  - Applies animations   │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Scroll Direction Hook

Use `useScrollDirection` hook from `@/src/shared/lib/hooks/use-scroll-direction` to track scroll direction.

**What it provides:**
- `scrollDirection`: Current scroll direction (`"to-top"`, `"to-bottom"`, or `"idle"`)
- `offsetYAnchorOnChangeDirection`: Scroll position where direction changed (anchor point)
- `onBeginDrag`: Handler for touch start (captures initial position)
- `onScroll`: Handler for scroll events (updates direction)

### 2. Provider Pattern

Create a provider to share scroll state across components. The provider:
- Initializes `useScrollDirection()` hook
- Creates unified `scrollHandler` that updates `listOffsetY` and detects scroll direction
- Manages `isDragging` state to prevent conflicts during user interaction
- Provides shared values and handlers to all child components via context

### 3. Content List Component

The scrollable content that drives the animation:
- Uses `Animated.FlatList` for optimal performance
- Attaches the unified `scrollHandler` from provider
- Provides `listRef` for programmatic scrolling (optional, for snapping behavior)

### 4. Animated Header Component

The element that shows/hides based on scroll:
- Reads `scrollDirection` and `listOffsetY` from provider
- Uses anchor values (`opacityAnchor`, `translateYAnchor`) to preserve animation state when direction changes
- Applies interpolation-based animations:
  - **Down scroll (to-bottom)**: Hide (opacity 0, translateY -height)
  - **Up scroll (to-top)**: Show (opacity 1, translateY 0)

## Pattern Flow

### Initialization
1. Wrap app/components in `AnimatedScrollListProvider`
2. Provider initializes `useScrollDirection()` hook
3. Provider creates unified `scrollHandler` with direction detection

### Scroll Detection
1. User scrolls → `onScroll` fires
2. `useScrollDirection` compares current vs previous position
3. Updates `scrollDirection` shared value (`"to-top"` or `"to-bottom"`)
4. Stores `offsetYAnchorOnChangeDirection` when direction changes

### Animation Application
1. Header component reads `scrollDirection` and `listOffsetY`
2. `useAnimatedReaction` preserves animation state at direction changes (saves current values as anchors)
3. `useAnimatedStyle` applies interpolation based on direction:
   - Uses anchor values as starting point for new direction
   - Interpolates from anchor to target value over scroll distance

## Key Concepts

### Anchor Values

Preserve animation state when scroll direction changes to prevent visual jumps. When direction changes:
- Save current animation values (`opacity`, `translateY`) as anchor values
- Use anchors as starting point for interpolation in new direction
- Ensures smooth transitions without resetting to initial state

### Direction-Based Interpolation

Different interpolation ranges for show vs hide:

- **Hide (to-bottom)**: `[anchor, anchor + height]` → `[visible, hidden]`
- **Show (to-top)**: `[anchor - height, anchor]` → `[hidden, visible]`

### Threshold Management

Optional: Add threshold to prevent jittery behavior on small scrolls. Threshold activates only when scrolled beyond a base distance (e.g., 150px), creating a "dead zone" for micro-scrolls.

## Example References

The following examples demonstrate this pattern in the codebase. **These are reference implementations only and must not be used directly as source of truth.** Always follow the guidelines from:
- `.cursor/skills/animation-performance` - for performance optimizations
- `.cursor/skills/animation-with-react-compiler` - for React Compiler compatibility
- `.cursor/skills/animation-with-worklets` - for worklet scheduling patterns

### Gmail Header Scroll Animation

**Slug:** `gmail-header-scroll-animation`

**Reference files:**
- `src/apps/(g-i)/gmail/components/custom-header.tsx`
- `src/apps/(g-i)/gmail/components/content-list.tsx`
- `src/apps/(g-i)/gmail/lib/providers/animated-scroll-list-provider.tsx`
- `src/apps/(g-i)/gmail/routes/inbox.tsx`

### Gmail Bottom Tab Bar and FAB Animation

**Slug:** `gmail-bottom-tab-bar-and-fab-animation`

**Reference files:**
- `src/apps/(g-i)/gmail/components/compose-btn.tsx`
- `src/apps/(g-i)/gmail/components/content-list.tsx`
- `src/apps/(g-i)/gmail/components/custom-tab-bar.tsx`
- `src/apps/(g-i)/gmail/lib/providers/animated-scroll-list-provider.tsx`
- `src/apps/(g-i)/gmail/lib/hooks/use-bottom-tab-bar-height.tsx`
- `src/apps/(g-i)/gmail/routes/inbox.tsx`

### Instagram Header on Scroll Animation

**Slug:** `instagram-header-on-scroll-animation`

**Reference files:**
- `src/apps/(g-i)/instagram/lib/providers/animated-scroll.tsx`
- `src/apps/(g-i)/instagram/components/home-list.tsx`
- `src/apps/(g-i)/instagram/routes/home.tsx`
- `src/apps/(g-i)/instagram/components/custom-header.tsx`

### LinkedIn Header on Scroll Animation

**Slug:** `linkedin-header-on-scroll-animation`

**Reference files:**
- `src/apps/(j-l)/linkedin/routes/home.tsx`
- `src/apps/(j-l)/linkedin/components/home-header.tsx`


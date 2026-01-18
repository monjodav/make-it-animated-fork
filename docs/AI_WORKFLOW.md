# AI Workflow

## Overview

Building high-quality React Native animations requires deep knowledge of animation principles, performance optimization, and React Native Reanimated patterns. While AI assistance is powerful, vibecoding cannot be ignored—having balanced context and workflow can significantly speed up the development process. This repository is designed to be an active AI-friendly environment where developers can create, experiment, and play with animations. Every effort has been made to structure the codebase, provide comprehensive context, and maintain consistent patterns that make it suitable for AI-assisted development. The goal is to create a React Native animation laboratory where developers can explore animation techniques with all related data and context readily available.

## Animation File Detection System

Each animation in this repository is wrapped by a unique **slug** identifier. This slug-based system simplifies detecting all files related to a specific animation, which is a core requirement for many commands and workflows. The slug acts as a search key that connects all components, routes, utilities, and related files for a given animation.

### Finding the Search Key (Slug)

The search key (slug) can be found in one of these ways:

1. **makeitanimated.dev website**: Press the "Copy search key" button on the animation website page (https://makeitanimated.dev/animations/[slug]) - *Note: You must be logged in to access this feature*
2. **URL slug**: Extract the slug from the animation URL
3. **Constants file**: Look up the slug in `src/shared/lib/constants/animations.ts`

> **Note**: This project is configured for Cursor IDE, but the concepts and structure are applicable to any AI-powered development environment. Commands, skills, and rules can be adapted to work with other AI tools (GitHub Copilot, Claude Code, Windsurf, etc.). Refer to your IDE's documentation to understand how to configure similar functionality—most modern AI coding assistants support custom commands, rules, and skills management through similar mechanisms.

## Available Commands

The following commands are available to assist with animation development and analysis:

| Command | Description |
|---------|-------------|
| `detect-animation-files` | Finds all files in the codebase that contain a specific animation search key (slug). Useful for locating all components, routes, and utilities related to an animation. |
| `explain-animation-logic` | Provides comprehensive analysis of animation implementation, including file architecture, component hierarchy, state flow, animation techniques, and performance optimizations. |
| `sandbox` | Sets the `SANDBOX` constant to `true` in `src/shared/lib/constants/dev.ts` to enable sandbox mode for testing and experimentation. |
| `wip-animation` | Sets the `WIP_SCREEN_HREF` constant in `src/shared/lib/constants/dev.ts` by finding the href for a given animation slug. Useful for quickly switching to work-in-progress animations during development. |

## Rules

The repository includes workspace-level rules that provide consistent coding standards and patterns:

1. **`base`**: Very short base instructions that establish fundamental guidelines. The list is always in progress and changes depending on project needs.

2. **`react-native-component`**: Provides unified structure for components, ensuring consistency across the codebase. Defines component organization, naming conventions, and code structure patterns.

3. **`styles`**: Ongoing instructions for style preferences. The list is always in progress and changes depending on project needs.

## Available Skills

The following skills provide specialized knowledge and guidelines for animation development:

1. **`animation-performance`**: Provides React Native Reanimated, React Native Worklets, and React Native Gesture Handler performance optimization guidelines. Covers shared values, worklets, frame callbacks, gesture handlers, animated styles, re-renders, and debugging animation jank. Essential for ensuring smooth animations at 60fps.

   The `animation-performance` skill includes 19 reference guides organized by category:

   | Category | Reference | Impact | Description |
   |----------|-----------|--------|-------------|
   | **Shared Values** | `shared-values-read-in-worklets` | CRITICAL | Read shared values only in worklets, not on JS thread |
   | **Shared Values** | `shared-values-during-render` | CRITICAL | Don't read/modify shared values during render |
   | **Shared Values** | `shared-values-track-state-with-ref` | HIGH | Track animation state with useRef instead of reading shared values |
   | **Shared Values** | `shared-values-initialization` | HIGH | Avoid expensive initial values, use simple primitives |
   | **Re-renders** | `re-renders-use-shared-values` | CRITICAL | Use shared values instead of component state for animations |
   | **Memoization** | `memoization-animations` | HIGH | Memoize animation objects to prevent recreation |
   | **Memoization** | `memoization-frame-callbacks` | HIGH | Memoize frame callbacks with useCallback |
   | **Memoization** | `memoization-gesture-objects` | HIGH | Memoize gesture objects with useMemo |
   | **Calculations** | `calculations-use-derived-value` | HIGH | Use useDerivedValue to optimize useAnimatedStyle calculations |
   | **Calculations** | `calculations-avoid-conditionals` | HIGH | Minimize conditional logic in worklets, use useDerivedValue |
   | **Calculations** | `calculations-use-clamp` | HIGH | Use clamp instead of manual Math.min/max in worklets |
   | **Calculations** | `calculations-batch-with-schedule-on-ui` | HIGH | Batch shared value updates with scheduleOnUI |
   | **Layout** | `layout-prefer-transform` | HIGH | Prefer transform over layout properties |
   | **Reactions** | `reactions-optimize-dependencies` | HIGH | Avoid unnecessary reactions, optimize dependency tracking |
   | **Hooks** | `hooks-choose-animated-props` | HIGH | Choose useAnimatedProps vs useAnimatedStyle correctly |
   | **Animations** | `animations-cancel-properly` | MEDIUM | Cancel running animations before starting new ones |
   | **Limits** | `limits-animated-components` | MEDIUM | Limit number of simultaneously animated components |
   | **Scroll** | `scroll-handlers-throttle` | MEDIUM | Optimize scroll handlers with throttling |

2. **`animation-with-react-compiler`**: Provides guidelines for using shared values with React Compiler. Ensures compatibility by using `get()` and `set()` methods instead of directly accessing the `value` property. Critical for React Compiler-enabled projects.

3. **`animation-with-worklets`**: Provides guidelines for scheduling functions between JavaScript and UI threads using React Native Worklets. Covers `scheduleOnRN`, `scheduleOnUI`, worklets, thread scheduling, `useAnimatedReaction`, and gesture handlers. Essential for proper cross-thread communication in animations.

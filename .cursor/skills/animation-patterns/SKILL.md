---
name: animation-patterns
description: Provides reusable React Native Reanimated animation patterns and architectural approaches for implementing common animation behaviors. Applies to tasks involving building animations, animation architecture, or implementing specific animation effects.
---

# Animation Patterns

## Overview

Collection of reusable animation patterns and architectural approaches for React Native Reanimated. These patterns provide proven solutions for common animation scenarios, offering high-level schematics and implementation guidance for various animation behaviors.

## When to Apply

Reference these patterns when:
- Building animations with specific behaviors or effects
- Looking for proven architectural approaches
- Implementing common animation interactions
- Needing high-level guidance on animation structure
- Coordinating animations across multiple components

## Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| `animation-context.md` | Distribute animation values via context without triggering re-renders | Shared animation state, coordinated animations |
| `show-hide-on-scroll.md` | Show/hide elements based on scroll direction and position | Headers, tab bars, FABs, search bars |
| `single-progress-shared-value.md` | Use single progress shared value with interpolated values for synchronized animations | Multi-property transitions, modal sheets, 3D transforms, coordinated animations |

## Pattern Selection Guide

| Requirement | Pattern |
|-------------|---------|
| Header that hides on scroll down, shows on scroll up | `show-hide-on-scroll.md` |
| Element that appears/disappears based on scroll position | `show-hide-on-scroll.md` |
| Coordinated animations across multiple components | `show-hide-on-scroll.md` |
| Sharing animation values across components without re-renders | `animation-context.md` |
| Creating animation context with shared values | `animation-context.md` |
| Multiple properties that must animate in sync (translateY, scale, opacity, etc.) | `single-progress-shared-value.md` |
| Complex multi-property transitions (modal sheets, card flips, 3D transforms) | `single-progress-shared-value.md` |
| Animations that need to reverse or restart together | `single-progress-shared-value.md` |

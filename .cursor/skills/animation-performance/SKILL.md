---
name: animation-performance
description: Provides React Native Reanimated, React Native Worklets, React Native Gesture Handler performance optimization guidelines for smooth animations. Applies to tasks involving shared values, worklets, frame callbacks, gesture handlers, animated styles, re-renders, or debugging animation jank and frame drops.
---

# Animation Performance Tips

## Overview

Performance optimization guide for React Native Reanimated animations, covering shared values, worklets, memoization, and rendering optimizations. These guidelines ensure buttery smooth animations at 60fps.

## When to Apply

Reference these guidelines when:
- Debugging janky or stuttering animations
- Optimizing animation performance (FPS drops)
- Working with shared values and worklets
- Implementing gesture handlers
- Optimizing animated lists and scroll handlers
- Reviewing Reanimated code for performance issues

## Priority-Ordered Guidelines

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Shared Values Usage | CRITICAL | `shared-values-*` |
| 2 | Re-renders | CRITICAL | `re-renders-*` |
| 3 | Memoization | HIGH | `memoization-*` |
| 4 | Animation Calculations | HIGH | `calculations-*` |
| 5 | Layout vs Transform | HIGH | `layout-*` |
| 6 | Component Limits | MEDIUM | `limits-*` |
| 7 | Scroll Optimization | MEDIUM | `scroll-*` |

## Quick Reference

### Critical: Shared Values Usage

**Common mistakes:**
- Reading shared values on JS thread (causes thread blocking)
- Accessing shared values during render (violates Rules of React)
- Using component state for animation values (triggers re-renders)

**Quick fixes:**
- Read shared values only in worklets (`useAnimatedStyle`, `useDerivedValue`) - see `shared-values-read-in-worklets.md`
- Access shared values in `useEffect` or callbacks, not during render - see `shared-values-during-render.md`
- Use `useSharedValue` instead of `useState` for animation values - see `re-renders-use-shared-values.md`

### Critical: Re-renders

**Common fixes:**
- Use shared values instead of component state for animations
- Memoize animation objects outside component or with constants
- Memoize frame callbacks with `useCallback`
- Memoize gesture objects with `useMemo`

### High: Animation Calculations

**Common fixes:**
- Use `useDerivedValue` for expensive calculations - see `calculations-use-derived-value.md`
- Batch updates with `scheduleOnUI` - see `calculations-batch-with-schedule-on-ui.md`
- Prefer transform properties over layout properties - see `layout-prefer-transform.md`

## References

Full documentation with code examples in `references/`:

### Shared Values (`shared-values-*`)

| File | Impact | Description |
|------|--------|-------------|
| `shared-values-read-in-worklets.md` | CRITICAL | Read shared values only in worklets, not on JS thread |
| `shared-values-during-render.md` | CRITICAL | Don't read/modify shared values during render |

### Re-renders (`re-renders-*`)

| File | Impact | Description |
|------|--------|-------------|
| `re-renders-use-shared-values.md` | CRITICAL | Use shared values instead of component state for animations |

### Memoization (`memoization-*`)

| File | Impact | Description |
|------|--------|-------------|
| `memoization-animations.md` | HIGH | Memoize animation objects to prevent recreation |
| `memoization-frame-callbacks.md` | HIGH | Memoize frame callbacks with useCallback |
| `memoization-gesture-objects.md` | HIGH | Memoize gesture objects with useMemo |

### Calculations (`calculations-*`)

| File | Impact | Description |
|------|--------|-------------|
| `calculations-use-derived-value.md` | HIGH | Use useDerivedValue to optimize useAnimatedStyle calculations |
| `calculations-batch-with-schedule-on-ui.md` | HIGH | Batch shared value updates with scheduleOnUI |

### Layout (`layout-*`)

| File | Impact | Description |
|------|--------|-------------|
| `layout-prefer-transform.md` | HIGH | Prefer transform over layout properties |

### Limits (`limits-*`)

| File | Impact | Description |
|------|--------|-------------|
| `limits-animated-components.md` | MEDIUM | Limit number of simultaneously animated components |

### Scroll (`scroll-*`)

| File | Impact | Description |
|------|--------|-------------|
| `scroll-handlers-throttle.md` | MEDIUM | Optimize scroll handlers with throttling |

## Problem → Skill Mapping

| Problem | Start With |
|---------|------------|
| Animation feels janky/stuttering | `shared-values-read-in-worklets.md` → `re-renders-use-shared-values.md` |
| Too many re-renders during animation | `re-renders-use-shared-values.md` → `memoization-animations.md` |
| Expensive calculations every frame | `calculations-use-derived-value.md` |
| Layout animations are slow | `layout-prefer-transform.md` |
| Multiple shared value updates cause jank | `calculations-batch-with-schedule-on-ui.md` |
| Frame callback performance issues | `memoization-frame-callbacks.md` |
| Gesture handler reattaches frequently | `memoization-gesture-objects.md` |
| Too many animated components | `limits-animated-components.md` |
| Scroll handler causes performance issues | `scroll-handlers-throttle.md` |


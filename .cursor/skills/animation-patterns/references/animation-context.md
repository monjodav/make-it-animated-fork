# Animation Context Pattern

## Overview

A pattern for creating React contexts to distribute animation-related values across components. The key principle is to avoid keeping state variables that trigger re-renders. Instead, use shared values and other non-reactive values that don't cause component re-renders.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Context Provider                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AnimationContextProvider                            │   │
│  │  - Shared values (useSharedValue)                    │   │
│  │  - Animation configs (constants)                    │   │
│  │  - Non-reactive values                               │   │
│  │  - NO useState, NO useReducer                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Provides
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │   Component A        │  │   Component B            │   │
│  │                      │  │                          │   │
│  │  - Reads shared      │  │  - Reads shared          │   │
│  │    values from ctx   │  │    values from ctx       │   │
│  │  - No re-renders     │  │  - No re-renders         │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Context Provider

Create a provider that only contains values that don't trigger re-renders:

**What it provides:**
- Shared values (`useSharedValue`) - updates on UI thread without re-renders
- Animation configurations (constants) - static values
- Helper functions - pure functions that don't cause re-renders
- Refs - don't trigger re-renders when updated

### 2. Context Hook

Create a custom hook to access the animation context:

- Provides type-safe access to shared values
- Ensures context is used within provider
- Returns only non-reactive values

### 3. Consumer Components

Components that consume the animation context:

- Read shared values in worklets (`useAnimatedStyle`, `useDerivedValue`)
- Access animation configs directly
- Use helper functions as needed
- No re-renders when shared values update

## Pattern Flow

### Initialization
1. Create context with proper TypeScript types
2. Create provider component that initializes shared values
3. Export custom hook for accessing context

### Usage
1. Wrap components in `AnimationContextProvider`
2. Components use hook to access shared values
3. Shared values update on UI thread without triggering re-renders

### Updates
1. Shared values are updated using `.set()` method
2. Updates happen on UI thread
3. Components reading values in worklets react automatically
4. No React re-renders occur

## Key Concepts

### Avoid State Variables

**Don't include state variables** (`useState`, `useReducer`) in animation contexts. These trigger re-renders when updated, defeating the purpose of using shared values for performance.

**What to avoid:**
- `useState` - triggers re-renders
- `useReducer` - triggers re-renders
- Any state management that causes React re-renders

### Use Shared Values

**Prefer shared values** (`useSharedValue`) for animation-related values. These update on the UI thread without triggering React re-renders.

**What to include:**
- `useSharedValue` - updates on UI thread, no re-renders
- Constants - static configuration values
- Helper functions - pure functions
- Refs - don't trigger re-renders

### Context Structure

Animation contexts should only contain:
- Shared values for animation state
- Animation configuration objects (constants)
- Helper functions for calculations
- Refs for imperative handles

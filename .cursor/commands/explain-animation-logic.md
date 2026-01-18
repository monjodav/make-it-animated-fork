# Explain Animation Logic

## Step 1: File Detection (Using detect-animation-files workflow)

Follow the workflow from `.cursor/commands/detect-animation-files.md` to find all files containing the animation search key.

## Step 2: Comprehensive Analysis

After detecting all files, analyze the animation implementation comprehensively.

## Important: Comprehensive Analysis Required

**CRITICAL**: The bullet points in each section are **examples and starting points**, NOT exhaustive lists. You MUST:

- **Identify ALL techniques, patterns, optimizations, and concepts** used in the code, even if not listed
- **Document everything** you find, not just what matches the examples
- **Be thorough** - if an animation uses gestures, layout animations, entering/exiting animations, or any other technique not mentioned, document it
- **Expand sections** as needed to cover all aspects of the implementation
- **Don't limit yourself** to the examples provided - they're guides, not constraints

The goal is a **complete and accurate** analysis of what the code actually does, not just what matches the template examples.

## Analysis Structure

Provide a comprehensive analysis following this hierarchical structure from global to granular:

### 1. Global Overview

- **File Architecture**: List all detected files and their roles
- **Component Hierarchy**: Visual representation of parent-child relationships
- **Entry Point**: Identify where the animation starts (route/page component)
- **Data Source**: Where the initial data comes from

### 2. Feature-Level Analysis

- **Component Responsibilities**: What each component does
- **Inter-Component Communication**: How components pass data and callbacks
- **Shared State**: What state is shared between components
- **Animation Coordination**: How multiple components synchronize animations

### 3. Parent-Child Relationships

- **Props Flow**: What props flow from parent to child
- **State Lifting**: Which state is managed at parent level vs child level
- **Callback Patterns**: How children communicate back to parents (if applicable)
- **Rendering Strategy**: How parent renders children (map, conditional, etc.)

### 4. Component-Level Deep Dive

For each component, analyze:

- **Purpose**: What this component is responsible for
- **State Management**: Local state, shared values, derived values (document ALL state management used)
- **Animation Logic**: What animations this component handles (document ALL animations)
- **Performance Optimizations**: Memoization, range culling, conditional rendering (document ALL optimizations)
- **Key Code Patterns**: Important implementation details
- **Props & Interfaces**: All props, their types, and purposes
- **Hooks Used**: Document ALL hooks (React and Reanimated) used in the component
- **Side Effects**: useEffect, useLayoutEffect, cleanup functions, etc.

### 5. Data Flow Analysis

- **Initial Data**: Where data originates (constants, props, API, etc.)
- **Data Transformation**: How data is modified (extended arrays, derived values)
- **Data Propagation**: How data flows through component tree
- **Data Usage**: Where and how data is consumed

### 6. State Flow Analysis

- **State Types**: Component state vs shared values vs derived values (identify ALL types used)
- **State Updates**: What triggers state changes (intervals, gestures, callbacks, effects, etc. - document ALL triggers)
- **State Synchronization**: How different state values stay in sync
- **State Dependencies**: Which states depend on others
- **Additional State Patterns**: Document any other state management patterns found (context, reducers, refs, etc.)

### 7. Animation Flow Analysis

- **Animation Triggers**: What starts animations (auto-advance, gestures, layout changes, entering/exiting, etc. - document ALL triggers)
- **Animation Values**: Shared values and how they're updated (document ALL shared values used)
- **Derived Animations**: How derived values transform animation values
- **Animation Styles**: How animated styles are applied
- **Animation Timing**: Intervals, durations, spring configs, delays, sequences (document ALL timing mechanisms)
- **Additional Animation Mechanisms**: Document any other animation patterns (layout animations, shared element transitions, etc.)

### 8. Animation Techniques & Patterns

**Document ALL animation techniques found in the code, including but not limited to:**

- **Reanimated Hooks**: useSharedValue, useDerivedValue, useAnimatedStyle, useAnimatedReaction, useFrameCallback, useAnimatedGestureHandler, etc. (document ALL hooks used)
- **Interpolation**: How values are interpolated for smooth transitions
- **Spring Physics**: Spring configurations and their effects
- **Timing Functions**: withTiming, withSpring, withDecay, withRepeat, withSequence, etc. (document ALL used)
- **Entering/Exiting Animations**: FadeIn, SlideIn, etc. (if used)
- **Layout Animations**: Layout animations, shared element transitions (if used)
- **Gesture Animations**: Pan, Pinch, Tap, LongPress gestures (if used)
- **Mathematical Calculations**: Circular path math, bezier curves, easing functions, trigonometric calculations, etc. (document ALL math used)
- **Performance Patterns**: Range culling, memoization, worklet optimization
- **Any Other Techniques**: Document any other animation techniques, libraries, or patterns found

### 9. Performance Optimizations

**Document ALL performance optimizations found, including but not limited to:**

- **Rendering Optimizations**: memo, conditional rendering, pointerEvents, React.memo, useMemo, useCallback, etc. (document ALL used)
- **Animation Optimizations**: Range culling, derived value caching, worklet memoization, etc.
- **Memory Optimizations**: Array extension strategies, cleanup functions, ref management, etc.
- **Worklet Optimizations**: UI thread execution, avoiding JS thread reads, worklet directives
- **Additional Optimizations**: Document any other performance techniques found (lazy loading, virtualization, etc.)

### 10. Key Concepts & Patterns

**Document ALL patterns and concepts found, including but not limited to:**

- **Design Patterns**: Observer, Strategy, Factory, Singleton, etc. (document ALL patterns identified)
- **React Patterns**: Compound components, render props, controlled components, HOCs, hooks patterns, etc. (document ALL used)
- **Reanimated Patterns**: Shared value patterns, derived value chains, worklet patterns, etc.
- **Architecture Patterns**: Container/presenter, smart/dumb components, feature-based organization, etc.
- **Animation Patterns**: Choreographed animations, staggered animations, parallel animations, etc. (if applicable)
- **Any Other Patterns**: Document any other architectural or design patterns found

## Output Format

Structure the output as a comprehensive guide with:

1. **Executive Summary**: 2-3 sentence overview of what this animation does
2. **Visual Hierarchy Diagram**: Text-based representation of component tree
3. **Detailed Sections**: Each section above with:
   - Clear explanations
   - Code snippets with file paths and line numbers (using code reference format)
   - Links to specific code locations
   - Visual flow descriptions where helpful
4. **Code References**: Use the format `startLine:endLine:filepath` for all code snippets
5. **Cross-References**: Link related concepts across sections

## Code Reference Format

When referencing code, use this format:

```
startLine:endLine:filepath
// code content here
```

Example:

```
36:42:src/apps/(a-c)/alma/components/nutrients-carousel/index.tsx
const currentIndex = useDerivedValue(() => {
  return Math.round(animatedIndex.get());
});
```

## Analysis Depth

- **Be Thorough**: Don't skip implementation details - document EVERYTHING found in the code
- **Be Comprehensive**: Go beyond the examples - if something exists in the code, document it
- **Be Clear**: Explain complex concepts in simple terms
- **Be Practical**: Focus on what developers need to understand
- **Be Visual**: Use diagrams, flow charts (text-based), and examples
- **Be Actionable**: Help readers understand how to modify or extend the animation
- **Be Complete**: Don't assume something isn't important just because it's not in the example list - if it's in the code, it's worth documenting

IMPORTANT: No need to create a new file, just analyze the code and provide the output in the chat.

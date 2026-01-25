// daily-steps-counter-animation 🔽

// Spring physics configuration for digit transition animations
// mass: 1 - standard mass, affects inertia
// damping: 12 - moderate damping prevents excessive oscillation
// stiffness: 120 - high stiffness creates snappy, responsive feel
// These values create smooth, natural-feeling transitions without bounce
export const SPRING_CONFIG = {
  mass: 1,
  damping: 12,
  stiffness: 120,
};

// Spring config with overshoot clamping: prevents values from exceeding target
// Used for opacity and scale animations where overshoot would look unnatural
// overshootClamping: true ensures animations settle exactly at target value
export const SPRING_CONFIG_WITH_OVERSHOOT = {
  ...SPRING_CONFIG,
  overshootClamping: true,
};

// daily-steps-counter-animation 🔼

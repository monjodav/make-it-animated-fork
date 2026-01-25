export const SPRING_CONFIG = {
  mass: 1,
  damping: 12,
  stiffness: 120,
};

export const SPRING_CONFIG_WITH_OVERSHOOT = {
  ...SPRING_CONFIG,
  overshootClamping: true,
};

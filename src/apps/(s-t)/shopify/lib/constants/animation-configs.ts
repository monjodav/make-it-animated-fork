// shopify-menu-transition-animation 🔽

/**
 * Spring preset for menu-driven UI translations (e.g., tabs container shift).
 * Why: Provides a quick, controlled settle without bounce; feels responsive while
 * keeping overlay/content layers visually tight.
 *
 * - damping: 34 → suppresses oscillation for a crisp stop (lower = bouncier)
 * - stiffness: 440 → faster acceleration to target (lower = softer/slower)
 *
 * Tuning tips:
 * - If motion feels sluggish, increase stiffness (e.g., 480–520).
 * - If it feels too snappy or jittery on low-end Android, reduce stiffness or
 *   raise damping slightly.
 * - Keep pairs consistent across components that compose a single interaction
 *   to avoid mismatched motion rhythms.
 */
export const MENU_TRANSITION_SPRING_CONFIG = {
  damping: 34,
  stiffness: 440,
};

// shopify-menu-transition-animation 🔼

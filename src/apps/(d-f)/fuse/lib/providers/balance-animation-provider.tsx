import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

// fuse-balance-secure-view-toggle-animation 🔽
// fuse-balance-change-toggle-animation 🔽

// Animation timing: long-press threshold used consistently across components to
// synchronize press feedback + enter/exit motions. Matches common iOS long-press UX.
export const LONG_PRESS_DELAY = 500;

type BalanceChangeView = "percent" | "currency";

type ContextValue = {
  isBalanceSecure: boolean;
  setIsBalanceSecure: (value: boolean) => void;
  balanceChangeView: BalanceChangeView;
  setBalanceChangeView: (value: BalanceChangeView) => void;
  balanceChangeTappedValue: SharedValue<BalanceChangeView>;
  isBalanceSecureTouched: SharedValue<boolean>;
  isBalanceInsecureTouched: SharedValue<boolean>;
};

const BalanceAnimationContext = createContext<ContextValue>({} as ContextValue);

export const BalanceAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBalanceSecure, setIsBalanceSecure] = useState(false);
  const [balanceChangeView, setBalanceChangeView] = useState<BalanceChangeView>("currency");
  // Shared coordination flag: captures the last explicitly tapped view.
  // Why: prevents double-triggering and avoids conflicting animations when
  // Balance and Toggle try to update in the same frame. When set to "percent",
  // the Toggle skips its micro-translation to mirror Fuse's UX.
  const balanceChangeTappedValue = useSharedValue<BalanceChangeView>("currency");

  // Touch states shared across components to drive subtle press transforms
  // on both the secure and insecure presentations (keeps motion in sync as layout swaps).
  const isBalanceSecureTouched = useSharedValue(false);
  const isBalanceInsecureTouched = useSharedValue(false);

  const value = {
    isBalanceSecure,
    setIsBalanceSecure,
    balanceChangeView,
    setBalanceChangeView,
    balanceChangeTappedValue,
    isBalanceSecureTouched,
    isBalanceInsecureTouched,
  };
  return (
    <BalanceAnimationContext.Provider value={value}>{children}</BalanceAnimationContext.Provider>
  );
};

export const useBalanceAnimation = () => {
  const context = useContext(BalanceAnimationContext);

  if (!context) {
    throw new Error("useBalanceAnimation must be used within an BalanceAnimationProvider");
  }

  return context;
};

// fuse-balance-change-toggle-animation 🔼
// fuse-balance-secure-view-toggle-animation 🔼

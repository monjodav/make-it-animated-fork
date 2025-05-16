import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

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
  // NOTE: I add here additional balanceChangeTappedValue to control which value is tapped
  // so if percentage is chosen then I skip animations inside balance-change-toggle and I skip setting balanceChangeView inside balance component.
  // This is the behavior from Fuse app.
  const balanceChangeTappedValue = useSharedValue<BalanceChangeView>("currency");

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

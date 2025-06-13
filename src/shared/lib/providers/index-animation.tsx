import { createContext, FC, PropsWithChildren, useContext } from "react";

type ContextValue = {};

const IndexAnimationContext = createContext<ContextValue>({} as ContextValue);

export const IndexAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const value = {};
  return <IndexAnimationContext.Provider value={value}>{children}</IndexAnimationContext.Provider>;
};

export const useIndexAnimation = () => {
  const context = useContext(IndexAnimationContext);

  if (!context) {
    throw new Error("useIndexAnimation must be used within an IndexAnimationProvider");
  }

  return context;
};

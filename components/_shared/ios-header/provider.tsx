import React, { createContext, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type IosHeaderContextType = {
  listOffsetY: SharedValue<number>;
  headerHeight: SharedValue<number>;
  headerContentHeight: SharedValue<number>;
  bigTitleHeight: SharedValue<number>;
  searchbarHeight: SharedValue<number>;
};

const IosHeaderContext = createContext<IosHeaderContextType | null>(null);

export const useIosHeader = () => {
  const context = useContext(IosHeaderContext);
  if (!context) {
    throw new Error("useIosHeader must be used within an IosHeaderProvider");
  }
  return context;
};

type Props = {
  children: React.ReactNode;
};

export const IosHeaderProvider: React.FC<Props> = ({ children }) => {
  const listOffsetY = useSharedValue(0);

  const headerHeight = useSharedValue(0);
  const headerContentHeight = useSharedValue(0);
  const bigTitleHeight = useSharedValue(0);
  const searchbarHeight = useSharedValue(0);

  return (
    <IosHeaderContext.Provider
      value={{
        listOffsetY,
        headerHeight,
        headerContentHeight,
        bigTitleHeight,
        searchbarHeight,
      }}
    >
      {children}
    </IosHeaderContext.Provider>
  );
};

import React, { createContext, useContext } from "react";
import { SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated";

type IosHeaderContextType = {
  headerHeight: SharedValue<number>;
  headerContentHeight: SharedValue<number>;
  bigTitleHeight: SharedValue<number>;
  searchbarHeight: SharedValue<number>;
  listOffsetY: SharedValue<number>;
  listPaddingTop: SharedValue<number>;
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
  const headerHeight = useSharedValue(0);
  const headerContentHeight = useSharedValue(0);
  const bigTitleHeight = useSharedValue(0);
  const searchbarHeight = useSharedValue(0);

  const listOffsetY = useSharedValue(0);

  const listPaddingTop = useDerivedValue(() => {
    if (!headerHeight.value) {
      return 0;
    }

    return headerHeight.value;
  });

  return (
    <IosHeaderContext.Provider
      value={{
        listOffsetY,
        headerHeight,
        headerContentHeight,
        bigTitleHeight,
        searchbarHeight,
        listPaddingTop,
      }}
    >
      {children}
    </IosHeaderContext.Provider>
  );
};

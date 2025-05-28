import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../store/unread";

type ContextValue = {
  activeChannelIndex: SharedValue<number>;
};

const ActiveChannelIndexContext = createContext<ContextValue>({} as ContextValue);

export const ActiveChannelIndexProvider: FC<PropsWithChildren> = ({ children }) => {
  const unreadChannels = useUnreadStore.use.unreadChannels();

  const activeChannelIndex = useSharedValue(unreadChannels.length - 1);

  const value = { activeChannelIndex };

  return (
    <ActiveChannelIndexContext.Provider value={value}>
      {children}
    </ActiveChannelIndexContext.Provider>
  );
};

export const useActiveChannelIndex = () => {
  const context = useContext(ActiveChannelIndexContext);

  if (!context) {
    throw new Error("useActiveChannelIndex must be used within an ActiveChannelIndexProvider");
  }

  return context;
};

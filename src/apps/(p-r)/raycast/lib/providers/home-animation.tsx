import {
  createContext,
  FC,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Dimensions, TextInput } from "react-native";
import { SharedValue, useSharedValue, withTiming } from "react-native-reanimated";

export const SEARCHBAR_HEIGHT = 40;
export const EDIT_HOME_CONTAINER_WIDTH = 65;
export const SETTINGS_CONTAINER_WIDTH = 65;
export const CANCEL_CONTAINER_WIDTH = 75;
const LEFT_PADDING = 16;

export const SEARCHBAR_FAVORITES_WIDTH =
  Dimensions.get("window").width - EDIT_HOME_CONTAINER_WIDTH - SETTINGS_CONTAINER_WIDTH;
export const SEARCHBAR_COMMANDS_WIDTH =
  Dimensions.get("window").width - CANCEL_CONTAINER_WIDTH - LEFT_PADDING;

export const TRIGGER_DRAG_DISTANCE = -100;
export const FULL_DRAG_DISTANCE = -200;

type ScreenView = "favorites" | "commands";

type ContextValue = {
  screenView: ScreenView;
  setScreenView: (view: ScreenView) => void;
  inputRef: RefObject<TextInput>;
  offsetY: SharedValue<number>;
  blurIntensity: SharedValue<number>;
  onGoToCommands: () => void;
  onGoToFavorites: () => void;
};

const HomeAnimationContext = createContext<ContextValue>({} as ContextValue);

export const HomeAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [screenView, setScreenView] = useState<ScreenView>("favorites");

  const inputRef = useRef<TextInput>(null);

  const offsetY = useSharedValue(0);
  const blurIntensity = useSharedValue(0);

  const onGoToCommands = useCallback(() => {
    setScreenView("commands");
    blurIntensity.value = withTiming(100);
    inputRef.current?.focus();
  }, []);

  const onGoToFavorites = useCallback(() => {
    setScreenView("favorites");
    blurIntensity.value = withTiming(0);
    inputRef.current?.blur();
  }, []);

  const value = {
    screenView,
    setScreenView,
    inputRef,
    offsetY,
    blurIntensity,
    onGoToCommands,
    onGoToFavorites,
  };
  return <HomeAnimationContext.Provider value={value}>{children}</HomeAnimationContext.Provider>;
};

export const useHomeAnimation = () => {
  const context = useContext(HomeAnimationContext);

  if (!context) {
    throw new Error("useHomeAnimation must be used within an HomeAnimationProvider");
  }

  return context;
};

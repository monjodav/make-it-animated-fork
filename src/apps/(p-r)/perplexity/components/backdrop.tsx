import { FC } from "react";
import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

type Props = BottomSheetBackdropProps;

export const Backdrop: FC<Props> = ({ ...props }) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={1}>
      <View className="w-full h-full" style={{ paddingTop: insets.top + 20 }}></View>
    </BottomSheetBackdrop>
  );
};

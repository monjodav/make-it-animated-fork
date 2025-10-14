import { FC, useCallback, useEffect, useRef } from "react";
import BottomSheet, { BottomSheetBackdropProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, View } from "react-native";
import { Backdrop } from "./backdrop";

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const SettingsModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const ref = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isVisible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [isVisible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <Backdrop {...props} />,
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={[350]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleStyle={styles.handleStyle}
      backgroundStyle={styles.backgroundStyle}
      onClose={() => setIsVisible(false)}
      detached
      bottomInset={40}
    >
      <BottomSheetView style={styles.container}>
        <View className="w-[45] h-[6px] mt-3 rounded-full bg-white/30 self-center" />
        <View className="p-4 pt-8"></View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleStyle: {
    display: "none",
  },
  backgroundStyle: {
    marginHorizontal: 16,
    backgroundColor: "#262626",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(64, 64, 64, 0.5)",
  },
  container: {},
});

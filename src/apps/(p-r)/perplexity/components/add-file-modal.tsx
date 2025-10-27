import { FC, useCallback, useEffect, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { Backdrop } from "./backdrop";
import { Globe2, GraduationCap, Receipt, Users2, X } from "lucide-react-native";
import { HorizontalTabs } from "./horizontal-tabs";
import { SourceToggleRow } from "./source-toggle-row";

// perplexity-bottom-sheet-backdrop-animation 🔽

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
};

export const AddFileModal: FC<Props> = ({ isVisible, setIsVisible }) => {
  const ref = useRef<BottomSheet>(null);

  const [webEnabled, setWebEnabled] = useState(true);
  const [academicEnabled, setAcademicEnabled] = useState(false);
  const [financeEnabled, setFinanceEnabled] = useState(false);
  const [socialEnabled, setSocialEnabled] = useState(false);

  useEffect(() => {
    if (isVisible) {
      ref.current?.expand();
    } else {
      ref.current?.close();
    }
  }, [isVisible]);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    if (Platform.OS === "android") {
      return (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
      );
    }
    return <Backdrop {...props} />;
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleStyle={styles.handleStyle}
      backgroundStyle={styles.backgroundStyle}
      onClose={() => setIsVisible(false)}
      detached
      bottomInset={40}
    >
      <BottomSheetView>
        <View className="w-[45] h-[6px] mt-2 rounded-full bg-white/30 self-center" />
        <View className="px-9 pb-5">
          <View className="flex-row items-center mt-1">
            <Text className="text-white text-2xl font-medium flex-1">Sources</Text>
            <Pressable
              hitSlop={8}
              onPress={() => setIsVisible(false)}
              className="p-2 rounded-full bg-neutral-700 items-center justify-center"
            >
              <X size={18} color="white" />
            </Pressable>
          </View>

          <HorizontalTabs />

          <View className="gap-8 mt-8">
            <SourceToggleRow
              icon={<Globe2 size={16} color="white" />}
              title="Web"
              description="Search across the entire internet"
              value={webEnabled}
              onValueChange={setWebEnabled}
            />
            <SourceToggleRow
              icon={<GraduationCap size={16} color="white" />}
              title="Academic"
              description="Search for published academic papers"
              value={academicEnabled}
              onValueChange={setAcademicEnabled}
            />
            <SourceToggleRow
              icon={<Receipt size={16} color="white" />}
              title="Finance"
              description="Search SEC filings"
              value={financeEnabled}
              onValueChange={setFinanceEnabled}
            />
            <SourceToggleRow
              icon={<Users2 size={16} color="white" />}
              title="Social"
              description="Search for discussions and opinions"
              value={socialEnabled}
              onValueChange={setSocialEnabled}
            />
          </View>
        </View>
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
    borderCurve: "continuous",
  },
});

// perplexity-bottom-sheet-backdrop-animation 🔼

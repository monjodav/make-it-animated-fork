import { useSharedValue } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type DragDirection = "up" | "down" | "none";

type Props = {
  upThreshold?: number;
};

export const useDragDirection = ({ upThreshold }: Props = {}) => {
  const dragDirection = useSharedValue<DragDirection>("none");
  const dragDirectionRefY = useSharedValue(0);

  const handleDragDirectionOnBeginDrag = (e: ReanimatedScrollEvent) => {
    "worklet";

    dragDirectionRefY.value = e.contentOffset.y;
  };

  const handleDragDirectionOnScroll = (e: ReanimatedScrollEvent) => {
    "worklet";

    const offsetY = e.contentOffset.y;

    if (offsetY > dragDirectionRefY.value) {
      dragDirection.value = "down";
    }
    if (offsetY < dragDirectionRefY.value - (upThreshold ?? 0)) {
      dragDirection.value = "up";
    }
  };

  return {
    dragDirection,
    handleDragDirectionOnBeginDrag,
    handleDragDirectionOnScroll,
  };
};

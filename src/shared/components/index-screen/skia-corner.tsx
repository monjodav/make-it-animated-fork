import React, { FC } from "react";
import { Path } from "@shopify/react-native-skia";

type Props = {
  path: string;
};

export const SkiaCorner: FC<Props> = ({ path }) => {
  return (
    <Path
      path={path}
      color="#ecfccb"
      style="stroke"
      strokeWidth={3}
      strokeJoin="round"
      strokeCap="round"
    />
  );
};

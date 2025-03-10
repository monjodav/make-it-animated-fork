import { MANUAL_ERROR_CAPTURE } from "@/src/shared/lib/utils/sentry";
import { Redirect, usePathname } from "expo-router";
import React, { FC, useEffect } from "react";

const Screen: FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    MANUAL_ERROR_CAPTURE({
      title: "Unmatched route > Pathname details",
      error: new Error(`Unmatched route: ${pathname}`),
    });
  }, [pathname]);

  return <Redirect href="/" />;
};

export default Screen;

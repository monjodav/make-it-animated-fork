import { Redirect } from "expo-router";
import React, { FC, useEffect } from "react";
import { useAppStore } from "@/src/shared/lib/store/app";

const Screen: FC = () => {
  const setShowUpdateComingMessage = useAppStore.use.setShowUpdateComingMessage();

  useEffect(() => {
    setShowUpdateComingMessage(true);
  }, [setShowUpdateComingMessage]);

  return <Redirect href="/" />;
};

export default Screen;

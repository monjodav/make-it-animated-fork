import React, { FC } from "react";
import { MenuItemsWrapper } from "./menu-items-wrapper";
import { MenuItem } from "./menu-item";
import { Camera, File, Fullscreen, ImagePlus, Images } from "lucide-react-native";
import { Alert } from "react-native";

// grok-attach-file-menu-animation 🔽

const _iconSize = 16;
const _iconColor = "black";

export const MenuItems: FC = () => {
  return (
    <MenuItemsWrapper>
      <MenuItem
        icon={<Camera size={_iconSize} color={_iconColor} />}
        label="Camera"
        onPress={() => Alert.alert("Camera")}
      />
      <MenuItem
        icon={<Images size={_iconSize} color={_iconColor} />}
        label="Photos"
        onPress={() => Alert.alert("Photos")}
      />
      <MenuItem
        icon={<File size={_iconSize} color={_iconColor} />}
        label="Files"
        onPress={() => Alert.alert("Files")}
        className="mb-12"
      />
      <MenuItem
        icon={<ImagePlus size={_iconSize} color="white" />}
        label="Create image"
        iconContainerClassName="bg-transparent border border-white/25"
        onPress={() => Alert.alert("Create image")}
      />
      <MenuItem
        icon={<Fullscreen size={_iconSize} color="white" />}
        label="Edit image"
        iconContainerClassName="bg-transparent border border-white/25"
        onPress={() => Alert.alert("Edit image")}
      />
    </MenuItemsWrapper>
  );
};

// grok-attach-file-menu-animation 🔼

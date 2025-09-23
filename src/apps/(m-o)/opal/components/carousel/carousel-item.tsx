import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CarouselItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
  };
}

const CarouselItem = ({ item }: CarouselItemProps) => {
  return (
    <View
      style={{
        height: 220,
        width: 150,
        backgroundColor: "grey",
        marginRight: 10,
        borderRadius: 30,
        padding: 10,
        borderWidth: 1.5,
        borderColor: "#2D2B2E",
        alignSelf: "flex-start",
        overflow: "hidden",
      }}
    >
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        }
        contentFit="cover"
        className="w-full h-full rounded-2xl"
        placeholder={{ blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.0001)", "black"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
        }}
      />
      <View className="mt-auto">
        <Text className="text-md text-[#fff] font-bold">{item.title}</Text>
        <Text className="text-sm text-[#B0B0B0] font-bold">{item.description}</Text>
        <View className="flex-row justify-center items-center gap-1 rounded-full bg-[#2D2B2E] p-1">
          <Plus size={18} color="white" strokeWidth={3} />
          <Text className="text-md text-[#fff] font-bold">Add </Text>
        </View>
      </View>
    </View>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 5,
  },
});

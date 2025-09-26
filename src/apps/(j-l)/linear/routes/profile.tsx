import { FlatList, View } from "react-native";

export const Profile = () => {
  return (
    <View className="flex-1 bg-linear-back">
      <FlatList
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={() => null}
        ListEmptyComponent={() => {
          return null;
        }}
      />
    </View>
  );
};

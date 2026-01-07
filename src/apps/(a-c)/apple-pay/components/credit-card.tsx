import { Text, View } from "react-native";

type CreditCardProps = {
  bankName: string;
  cardNumber: string;
  currency: string;
  additionalText?: string;
};

export const CreditCard = ({ bankName, cardNumber, currency, additionalText }: CreditCardProps) => {
  return (
    <View
      className="w-full aspect-[1.8/1] rounded-2xl bg-neutral-800 p-6"
      style={{ borderCurve: "continuous" }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">{bankName}</Text>
        <Text className="text-white/70 text-sm">{currency}</Text>
      </View>
      {additionalText && (
        <View className="flex-row items-center gap-2 mb-4">
          <Text className="text-white/90 text-sm">{additionalText}</Text>
        </View>
      )}
      <View className="flex-row items-center justify-between mt-auto">
        <Text className="text-white/60 text-sm">{cardNumber}</Text>
        <View className="flex-row items-center gap-2">
          <View className="size-8 rounded bg-white/10 items-center justify-center">
            <View className="size-6 rounded bg-white/20" />
          </View>
          <Text className="text-white font-semibold text-xs">VISA</Text>
        </View>
      </View>
    </View>
  );
};


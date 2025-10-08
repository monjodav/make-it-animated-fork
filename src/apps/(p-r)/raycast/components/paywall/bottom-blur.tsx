import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const BottomBlur = () => {
  return (
    <>
      <BlurView
        pointerEvents="none"
        tint="dark"
        intensity={8}
        style={[StyleSheet.absoluteFill, { marginTop: 50 }]}
      />
      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[0, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView tint="dark" intensity={18} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["transparent", "black"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.3 }}
          style={StyleSheet.absoluteFill}
        />
      </MaskedView>
    </>
  );
};

export default BottomBlur;

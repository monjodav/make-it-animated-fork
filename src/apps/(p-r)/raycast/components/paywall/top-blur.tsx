import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const TopBlur = () => {
  return (
    <>
      {Platform.OS === "android" ? (
        <LinearGradient
          pointerEvents="none"
          colors={["#800020", "transparent"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <MaskedView
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={["red", "transparent"]}
              locations={[0.75, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <BlurView tint="extraLight" intensity={8} style={StyleSheet.absoluteFill} />

          <MaskedView
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                colors={["#00000022", "#00000000"]}
                locations={[0, 0.7]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            }
          >
            <BlurView tint="extraLight" intensity={18} style={StyleSheet.absoluteFill} />
          </MaskedView>

          <LinearGradient
            colors={["#800020e4", "transparent"]}
            locations={[0, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
      )}
    </>
  );
};

export default TopBlur;

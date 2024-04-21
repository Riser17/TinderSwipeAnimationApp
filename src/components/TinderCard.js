import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  runOnJS,
} from "react-native-gesture-handler";

const screenWidth = Dimensions.get("screen").width;
export const tinderCardWidth = screenWidth * 0.8;

const TinderCard = ({
  user,
  numberofCards,
  curIndex,
  activeIndex,
  onResponse,
}) => {
  const translationX = useSharedValue(0);

  //   useDerivedValue(() => {
  //     activeIndex.value = interpolate(
  //       Math.abs(translationX.value),
  //       [0, 500],
  //       [0, activeIndex.value + 1, 0]
  //     ); //TODO: to chnage the active index
  //   });

  const animatedCard = useAnimatedStyle(() => ({
    opacity: interpolate(
      activeIndex.value,
      [curIndex - 1, curIndex, curIndex + 1], //TODO: curlIndex - 1 is next card from current index, curIndex is current card, curIndex + 1 is previous card
      [1 - 1 / 5, 1, 1]
    ),
    transform: [
      {
        scale: interpolate(
          activeIndex.value,
          [curIndex - 1, curIndex, curIndex + 1],
          [0.95, 1, 1]
        ),
      },
      {
        translateY: interpolate(
          activeIndex.value,
          [curIndex - 1, curIndex, curIndex + 1],
          [-30, 0, 0]
        ),
      },
      {
        translateX: translationX.value, // to transform the card position x axis horizontally,
      },
      {
        rotateZ: `${interpolate(
          translationX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15]
        )}deg`,
      },
    ],
  }));

  const gesture = Gesture.Pan()
    .onChange((event) => {
      //console.log("on translationX", event.translationX);
      translationX.value = event.translationX;
      //activeIndex.value = interpolate() //TODO: Based on translationX we will change activeIndex
      activeIndex.value = interpolate(
        Math.abs(translationX.value),
        [0, 500],
        [curIndex, curIndex + 0.8]
      ); //TODO: to chnage the active index
    })

    .onEnd((event) => {
      //Todo: onEnd has a velocity, based on velocity cal. user pan very fast,change the translateX using Decay
      if (Math.abs(event.velocityX) > 400) {
        translationX.value = withSpring(
          // TODO: When i realease the translation (geasture) it jump back from where it sharted(middle 0)
          //TODO: when swipe the card is moved, it removes/move away from the screen
          Math.sign(event.velocityX) * 500,
          {
            velocity: event.velocityX,
          }
        );
        activeIndex.value = withSpring(curIndex + 1);
        // runOnJS(onResponse)(event.velocityX > 0);
      } else {
        translationX.value = withSpring(0);
      }
    });

  return (
    //TODO: recieve list of gesture
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.card,
          animatedCard,
          {
            zIndex: numberofCards - curIndex,
            //   opacity: 1 - curIndex * 0.2,
            //   transform: [
            //     { translateY: -curIndex * 30 },
            //     // { scale: 1 - curIndex * 0.05 },
            //   ],
          },
        ]}
      >
        <Image
          style={[StyleSheet.absoluteFillObject, styles.image]}
          source={{ uri: user.image }}
        />

        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
        />

        <View style={styles.footer}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default TinderCard;

const styles = StyleSheet.create({
  card: {
    width: tinderCardWidth,
    // height: tinderCardWidth * 1.67,
    aspectRatio: 1 / 1.67,
    borderRadius: 15,
    justifyContent: "flex-end",

    position: "absolute",

    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  image: {
    // width: "100%",
    // height: 100,
    borderRadius: 15,
  },
  overlay: {
    top: "50%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  footer: {
    padding: 10,
  },
  name: {
    fontSize: 24,
    color: "white",
    // fontFamily: "InterBold",
  },
});

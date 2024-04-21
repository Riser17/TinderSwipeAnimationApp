import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TinderCard from "../components/TinderCard";
import {
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const dummuUsers = [
  {
    id: 1,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg",
    name: "Dani",
  },
  {
    id: 2,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/2.jpg",
    name: "Jon",
  },
  {
    id: 3,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/3.jpg",
    name: "Dani3",
  },
  {
    id: 4,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/4.jpeg",
    name: "Alice",
  },
  {
    id: 5,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/5.jpg",
    name: "Dani5",
  },
  {
    id: 6,
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/6.jpg",
    name: "Kelsey",
  },
];

const TinderScreen = () => {
  const [users, setUsers] = useState(dummuUsers);
  const activeIndex = useSharedValue(0);
  const [index, setIndex] = useState(0);

  useAnimatedReaction(
    () => activeIndex.value,
    (value, prev) => {
      if (Math.floor(value) !== index) {
        console.log("Reaction", Math.floor(value));
        runOnJS(setIndex)(Math.floor(value)); // UI Thread
      }
    }
  );

  useEffect(() => {
    if (index > dummuUsers.length - 3) {
      //TODO:WE CAN ADD LOGIG if last two card is left then we can fetch/loading more item from backend
      console.warn("Last 2 cards remaining. Fetch more!");
      setUsers((usrs) => [...usrs, ...dummuUsers.reverse()]);
    }
  }, [index]);

  const onResponse = (res) => {
    console.log("on Response", res); // 'YES' | 'NO'
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Text style={{ top: 70, position: "absolute" }}>
        Current index: {index}
      </Text> */}
      {users.map((user, index) => (
        <TinderCard
          key={`${user.id}-${index}`}
          user={user}
          numberofCards={dummuUsers.length}
          curIndex={index}
          activeIndex={activeIndex}
          //onResponse={onResponse}
        />
      ))}
      {/* <View
        style={{ position: "absolute", bottom: "20", backgroundColor: "red" }}
      >
        <Button
          title="YES"
          onPress={() => (activeIndex.value = activeIndex.value + 1)}
        />
      </View> */}
    </View>
  );
};

export default TinderScreen;

const styles = StyleSheet.create({});

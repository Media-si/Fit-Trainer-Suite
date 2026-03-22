import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { MuscleGroup } from "@/data/exercises";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  muscleGroup: MuscleGroup;
  onPress: () => void;
}

export function MuscleGroupCard({ muscleGroup, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: muscleGroup.color + "30" }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: muscleGroup.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={[styles.overlay, { backgroundColor: muscleGroup.color + "CC" }]} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
          <Ionicons name={muscleGroup.icon as any} size={20} color="#fff" />
        </View>
        <Text style={styles.name}>{muscleGroup.name}</Text>
        <Text style={styles.count}>{muscleGroup.count} exercises</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.15,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 12,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "flex-end",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },
  count: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});

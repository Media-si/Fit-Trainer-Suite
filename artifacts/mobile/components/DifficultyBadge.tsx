import React from "react";
import { StyleSheet, Text, View } from "react-native";

const difficultyColors: Record<string, string> = {
  Beginner: "#4CAF50",
  Intermediate: "#FFB020",
  Advanced: "#FF4444",
};

interface Props {
  difficulty: string;
  size?: "sm" | "md";
}

export function DifficultyBadge({ difficulty, size = "md" }: Props) {
  const color = difficultyColors[difficulty] || "#888";
  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }, size === "sm" && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === "sm" && styles.smText]}>
        {difficulty}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  sm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  smText: {
    fontSize: 11,
  },
});

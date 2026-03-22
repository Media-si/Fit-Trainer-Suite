import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useFavorites } from "@/context/FavoritesContext";
import { Exercise } from "@/data/exercises";

interface Props {
  exercise: Exercise;
  onPress: () => void;
  showMuscleGroup?: boolean;
}

const difficultyColors: Record<string, string> = {
  Beginner: "#4CAF50",
  Intermediate: "#FFB020",
  Advanced: "#FF4444",
};

export function ExerciseCard({ exercise, onPress, showMuscleGroup }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(exercise.id);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(exercise);
  };

  const handleFavPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(exercise);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.88}
      delayLongPress={400}
    >
      <Image
        source={{ uri: exercise.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.meta}>
            {showMuscleGroup && (
              <Text style={styles.muscleGroup}>
                {exercise.muscleGroup.toUpperCase()}
              </Text>
            )}
            <Text style={styles.name} numberOfLines={1}>
              {exercise.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleFavPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={22}
              color={favorited ? Colors.primary : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="repeat" size={12} color={Colors.textSecondary} />
              <Text style={styles.statText}>{exercise.sets} sets</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="flash" size={12} color={Colors.textSecondary} />
              <Text style={styles.statText}>{exercise.reps} reps</Text>
            </View>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColors[exercise.difficulty] + "20" },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: difficultyColors[exercise.difficulty] },
              ]}
            >
              {exercise.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 96,
    height: 96,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  meta: {
    flex: 1,
    marginRight: 8,
  },
  muscleGroup: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});

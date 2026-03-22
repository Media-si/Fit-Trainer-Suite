import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Colors } from "@/constants/colors";
import { useFavorites } from "@/context/FavoritesContext";
import { getExerciseById } from "@/data/exercises";

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * (9 / 16);

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const exercise = getExerciseById(id ?? "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showVideo, setShowVideo] = useState(false);

  if (!exercise) {
    return (
      <View style={[styles.container, styles.errorState]}>
        <Text style={styles.errorText}>Exercise not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const favorited = isFavorite(exercise.id);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(exercise);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: exercise.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Nav */}
          <View style={[styles.navBar, { top: topPadding + 8 }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.navBtn}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFav}
              style={[
                styles.navBtn,
                favorited && { backgroundColor: Colors.primary },
              ]}
            >
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Hero text */}
          <View style={styles.heroText}>
            <View style={styles.muscleGroupTag}>
              <Text style={styles.muscleGroupTagText}>
                {exercise.muscleGroup.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <DifficultyBadge difficulty={exercise.difficulty} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{exercise.sets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{exercise.reps}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{exercise.difficulty}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Perform</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>

        {/* Video */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
          {!showVideo ? (
            <TouchableOpacity
              style={styles.videoPreview}
              onPress={() => setShowVideo(true)}
              activeOpacity={0.88}
            >
              <View style={styles.playButton}>
                <Ionicons name="play" size={28} color="#fff" />
              </View>
              <Text style={styles.videoLabel}>Tap to load video</Text>
            </TouchableOpacity>
          ) : Platform.OS === "web" ? (
            <View style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}>
              <Text style={styles.webVideoText}>
                YouTube video is available in the native app
              </Text>
            </View>
          ) : (
            <View style={[styles.videoContainer, { height: VIDEO_HEIGHT }]}>
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0`,
                }}
                style={styles.webview}
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
              />
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          <View style={styles.tipsCard}>
            {[
              "Maintain proper form throughout every rep",
              "Control the negative (lowering) phase",
              "Breathe out on the exertion, in on the release",
              "Start with lighter weight to perfect technique",
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {},
  errorState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  // Hero
  heroContainer: {
    height: 300,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    gap: 8,
  },
  muscleGroupTag: {
    backgroundColor: Colors.primary + "CC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  muscleGroupTagText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  exerciseName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 30,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  statBox: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 3,
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Video
  videoPreview: {
    height: VIDEO_HEIGHT,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  videoLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  videoContainer: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  webVideoText: {
    color: Colors.textSecondary,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },

  // Tips
  tipsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

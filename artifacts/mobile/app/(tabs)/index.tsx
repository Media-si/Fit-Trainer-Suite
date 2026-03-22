import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MuscleGroupCard } from "@/components/MuscleGroupCard";
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
} from "@/components/NotificationSetup";
import { Colors } from "@/constants/colors";
import { EXERCISES, MUSCLE_GROUPS } from "@/data/exercises";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminder(8, 0);
        setNotificationsEnabled(true);
      }
    };
    setupNotifications();
  }, []);

  const featuredExercise = EXERCISES[Math.floor(Math.random() * 10)];

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: topPadding + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.appName}>FitPro</Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.notifIndicator,
                {
                  backgroundColor: notificationsEnabled
                    ? Colors.success + "20"
                    : Colors.border,
                },
              ]}
            >
              <Ionicons
                name={
                  notificationsEnabled
                    ? "notifications"
                    : "notifications-off"
                }
                size={16}
                color={
                  notificationsEnabled ? Colors.success : Colors.textMuted
                }
              />
            </View>
          </View>
        </View>

        {/* Week strip */}
        <View style={styles.weekStrip}>
          {DAYS_OF_WEEK.map((d, i) => (
            <View
              key={d}
              style={[
                styles.dayChip,
                i === dayIndex && styles.dayChipActive,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  i === dayIndex && styles.dayTextActive,
                ]}
              >
                {d}
              </Text>
            </View>
          ))}
        </View>

        {/* Featured */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Exercise</Text>
        </View>
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() =>
            router.push({
              pathname: "/exercise/[id]",
              params: { id: featuredExercise.id },
            })
          }
          activeOpacity={0.88}
        >
          <View style={styles.featuredBadge}>
            <Ionicons name="flash" size={12} color={Colors.background} />
            <Text style={styles.featuredBadgeText}>TODAY&apos;S PICK</Text>
          </View>
          <Text style={styles.featuredName}>{featuredExercise.name}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredMuscle}>
              {featuredExercise.muscleGroup.toUpperCase()}
            </Text>
            <Text style={styles.featuredDot}>{"\u2022"}</Text>
            <Text style={styles.featuredSets}>
              {featuredExercise.sets} sets {"\u00D7"} {featuredExercise.reps} reps
            </Text>
          </View>
          <View style={styles.featuredArrow}>
            <Ionicons name="arrow-forward" size={16} color={Colors.background} />
          </View>
        </TouchableOpacity>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{EXERCISES.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{MUSCLE_GROUPS.length}</Text>
            <Text style={styles.statLabel}>Muscle Groups</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              {notificationsEnabled ? "ON" : "OFF"}
            </Text>
            <Text style={styles.statLabel}>Daily Alert</Text>
          </View>
        </View>

        {/* Muscle Groups */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Muscle Groups</Text>
        </View>

        <View style={styles.grid}>
          {MUSCLE_GROUPS.map((mg) => (
            <MuscleGroupCard
              key={mg.id}
              muscleGroup={mg}
              onPress={() =>
                router.push({
                  pathname: "/exercises/[muscleGroup]",
                  params: { muscleGroup: mg.id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  appName: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    paddingTop: 4,
  },
  notifIndicator: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 8,
  },
  dayChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayChipActive: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textMuted,
  },
  dayTextActive: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  featuredCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: Colors.background,
    letterSpacing: 0.5,
  },
  featuredName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.background,
    marginBottom: 6,
    lineHeight: 28,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredMuscle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(0,0,0,0.6)",
    letterSpacing: 0.5,
  },
  featuredDot: {
    color: "rgba(0,0,0,0.4)",
    fontSize: 12,
  },
  featuredSets: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(0,0,0,0.6)",
  },
  featuredArrow: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { WorkoutDay, useWorkoutPlanner } from "@/context/WorkoutPlannerContext";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function WorkoutDayCard({
  day,
  onEdit,
  onDelete,
}: {
  day: WorkoutDay;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Workout", `Remove "${day.title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.dayCard}
      onPress={onEdit}
      onLongPress={handleLongPress}
      activeOpacity={0.88}
    >
      <View style={styles.dayCardLeft}>
        <View style={styles.dayLabelContainer}>
          <Text style={styles.dayLabel}>{day.day.slice(0, 3).toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.dayCardContent}>
        <Text style={styles.dayTitle} numberOfLines={1}>
          {day.title}
        </Text>
        {day.exercises.length > 0 && (
          <View style={styles.exerciseChips}>
            {day.exercises.slice(0, 3).map((ex, i) => (
              <View key={i} style={styles.exerciseChip}>
                <Text style={styles.exerciseChipText} numberOfLines={1}>
                  {ex}
                </Text>
              </View>
            ))}
            {day.exercises.length > 3 && (
              <View style={styles.exerciseChip}>
                <Text style={styles.exerciseChipText}>
                  +{day.exercises.length - 3} more
                </Text>
              </View>
            )}
          </View>
        )}
        {day.notes ? (
          <Text style={styles.dayNotes} numberOfLines={2}>
            {day.notes}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

interface AddWorkoutModalProps {
  visible: boolean;
  editingDay: WorkoutDay | null;
  onClose: () => void;
  onSave: (data: { day: string; title: string; notes: string; exercises: string[] }) => void;
}

function AddWorkoutModal({ visible, editingDay, onClose, onSave }: AddWorkoutModalProps) {
  const [selectedDay, setSelectedDay] = useState(editingDay?.day ?? "Monday");
  const [title, setTitle] = useState(editingDay?.title ?? "");
  const [notes, setNotes] = useState(editingDay?.notes ?? "");
  const [exerciseInput, setExerciseInput] = useState("");
  const [exercises, setExercises] = useState<string[]>(editingDay?.exercises ?? []);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      setSelectedDay(editingDay?.day ?? "Monday");
      setTitle(editingDay?.title ?? "");
      setNotes(editingDay?.notes ?? "");
      setExercises(editingDay?.exercises ?? []);
      setExerciseInput("");
    }
  }, [visible, editingDay]);

  const addExercise = () => {
    if (exerciseInput.trim()) {
      setExercises((prev) => [...prev, exerciseInput.trim()]);
      setExerciseInput("");
    }
  };

  const removeExercise = (i: number) => {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a workout title.");
      return;
    }
    onSave({ day: selectedDay, title: title.trim(), notes: notes.trim(), exercises });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modal, { backgroundColor: Colors.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingDay ? "Edit Workout" : "Add Workout"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveBtn}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={[
            styles.modalContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Day picker */}
          <Text style={styles.fieldLabel}>Day of Week</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dayPicker}
          >
            {WEEK_DAYS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dayPickerChip,
                  selectedDay === d && styles.dayPickerChipActive,
                ]}
                onPress={() => setSelectedDay(d)}
              >
                <Text
                  style={[
                    styles.dayPickerText,
                    selectedDay === d && styles.dayPickerTextActive,
                  ]}
                >
                  {d.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Title */}
          <Text style={styles.fieldLabel}>Workout Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Push Day, Upper Body..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />

          {/* Notes */}
          <Text style={styles.fieldLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Goals, tips, or anything you want to remember..."
            placeholderTextColor={Colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Exercises */}
          <Text style={styles.fieldLabel}>Exercises</Text>
          <View style={styles.exerciseInputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Add an exercise..."
              placeholderTextColor={Colors.textMuted}
              value={exerciseInput}
              onChangeText={setExerciseInput}
              onSubmitEditing={addExercise}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={addExercise}
              style={styles.addExerciseBtn}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseRow}>
              <View style={styles.exerciseBullet} />
              <Text style={styles.exerciseRowText} numberOfLines={1}>
                {ex}
              </Text>
              <TouchableOpacity onPress={() => removeExercise(i)}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function PlannerScreen() {
  const { workoutDays, addWorkoutDay, updateWorkoutDay, deleteWorkoutDay, isLoading } =
    useWorkoutPlanner();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);

  const handleSave = (data: {
    day: string;
    title: string;
    notes: string;
    exercises: string[];
  }) => {
    if (editingDay) {
      updateWorkoutDay(editingDay.id, data);
    } else {
      addWorkoutDay(data);
    }
    setEditingDay(null);
  };

  const openAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingDay(null);
    setModalVisible(true);
  };

  const openEdit = (day: WorkoutDay) => {
    setEditingDay(day);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <View>
          <Text style={styles.title}>Planner</Text>
          <Text style={styles.subtitle}>
            {workoutDays.length} {workoutDays.length === 1 ? "session" : "sessions"} planned
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {workoutDays.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-outline" size={40} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No workouts planned</Text>
          <Text style={styles.emptyText}>
            Tap the + button to plan your training week
          </Text>
          <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.emptyAddText}>Plan a Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workoutDays}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutDayCard
              day={item}
              onEdit={() => openEdit(item)}
              onDelete={() => deleteWorkoutDay(item.id)}
            />
          )}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 : insets.bottom + 90,
            },
          ]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddWorkoutModal
        visible={modalVisible}
        editingDay={editingDay}
        onClose={() => {
          setModalVisible(false);
          setEditingDay(null);
        }}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  list: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  dayCardLeft: {},
  dayLabelContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
  },
  dayCardContent: {
    flex: 1,
    gap: 6,
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  exerciseChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  exerciseChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  exerciseChipText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  dayNotes: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyAddText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },

  // Modal
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textPrimary,
  },
  saveBtn: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  textArea: {
    minHeight: 100,
  },
  dayPicker: {
    marginBottom: 4,
  },
  dayPickerChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  dayPickerChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayPickerText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  dayPickerTextActive: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  exerciseInputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  addExerciseBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  exerciseRowText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textPrimary,
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PLANNER_KEY = "@fitpro_workout_plan";

export interface WorkoutDay {
  id: string;
  day: string;
  title: string;
  notes: string;
  exercises: string[];
  createdAt: number;
}

interface WorkoutPlannerContextValue {
  workoutDays: WorkoutDay[];
  addWorkoutDay: (day: Omit<WorkoutDay, "id" | "createdAt">) => void;
  updateWorkoutDay: (id: string, updates: Partial<WorkoutDay>) => void;
  deleteWorkoutDay: (id: string) => void;
  isLoading: boolean;
}

const WorkoutPlannerContext = createContext<WorkoutPlannerContextValue | null>(null);

export function WorkoutPlannerProvider({ children }: { children: React.ReactNode }) {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(PLANNER_KEY);
        if (stored) {
          setWorkoutDays(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load workout plan:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (days: WorkoutDay[]) => {
    try {
      await AsyncStorage.setItem(PLANNER_KEY, JSON.stringify(days));
    } catch (e) {
      console.error("Failed to save workout plan:", e);
    }
  }, []);

  const addWorkoutDay = useCallback(
    (day: Omit<WorkoutDay, "id" | "createdAt">) => {
      const newDay: WorkoutDay = {
        ...day,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      setWorkoutDays((prev) => {
        const next = [...prev, newDay];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateWorkoutDay = useCallback(
    (id: string, updates: Partial<WorkoutDay>) => {
      setWorkoutDays((prev) => {
        const next = prev.map((d) => (d.id === id ? { ...d, ...updates } : d));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const deleteWorkoutDay = useCallback(
    (id: string) => {
      setWorkoutDays((prev) => {
        const next = prev.filter((d) => d.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = useMemo(
    () => ({
      workoutDays,
      addWorkoutDay,
      updateWorkoutDay,
      deleteWorkoutDay,
      isLoading,
    }),
    [workoutDays, addWorkoutDay, updateWorkoutDay, deleteWorkoutDay, isLoading]
  );

  return (
    <WorkoutPlannerContext.Provider value={value}>
      {children}
    </WorkoutPlannerContext.Provider>
  );
}

export function useWorkoutPlanner() {
  const ctx = useContext(WorkoutPlannerContext);
  if (!ctx) throw new Error("useWorkoutPlanner must be used within WorkoutPlannerProvider");
  return ctx;
}

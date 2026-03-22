import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { EXERCISES, Exercise } from "@/data/exercises";

const FAVORITES_KEY = "@fitpro_favorites";

interface FavoritesContextValue {
  favorites: Exercise[];
  favoriteIds: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (exercise: Exercise) => void;
  addFavorite: (exercise: Exercise) => void;
  removeFavorite: (id: string) => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          setFavoriteIds(new Set(ids));
        }
      } catch (e) {
        console.error("Failed to load favorites:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, []);

  const addFavorite = useCallback(
    (exercise: Exercise) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.add(exercise.id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleFavorite = useCallback(
    (exercise: Exercise) => {
      if (favoriteIds.has(exercise.id)) {
        removeFavorite(exercise.id);
      } else {
        addFavorite(exercise);
      }
    },
    [favoriteIds, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  );

  const favorites = useMemo(
    () => EXERCISES.filter((ex) => favoriteIds.has(ex.id)),
    [favoriteIds]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      isLoading,
    }),
    [favorites, favoriteIds, isFavorite, toggleFavorite, addFavorite, removeFavorite, isLoading]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

import { useState, useEffect, useRef, useCallback } from 'react';

interface StorageOptions {
  key: string;
  defaultValue: any;
  debounceMs?: number;
  storageType?: 'localStorage' | 'sessionStorage';
}

interface StorageManager {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const getStorageManager = (type: 'localStorage' | 'sessionStorage'): StorageManager | null => {
  if (typeof window === 'undefined') return null;

  try {
    const storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    // Test storage availability
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return storage;
  } catch {
    // Storage is disabled or unavailable
    console.warn(`${type} is not available, falling back to memory only`);
    return null;
  }
};

export function usePersistentState<T>(options: StorageOptions) {
  const {
    key,
    defaultValue,
    debounceMs = 300,
    storageType = 'localStorage'
  } = options;

  const storage = getStorageManager(storageType);
  const debounceRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);

  // Initialize state with stored value or default
  const [state, setState] = useState<T>(() => {
    if (!storage) return defaultValue;

    try {
      const stored = storage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        // Merge stored values with defaultValue to handle new fields
        if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
          return { ...defaultValue, ...parsed };
        }
        return parsed;
      }
    } catch (error) {
      console.warn(`Failed to parse stored value for key "${key}":`, error);
    }

    return defaultValue;
  });

  // Save to storage with debouncing
  const saveToStorage = useCallback((value: T) => {
    if (!storage) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save to ${storageType} for key "${key}":`, error);
      }
    }, debounceMs);
  }, [key, storageType, debounceMs, storage]);

  // Update state and persist
  const setPersistentState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prevState)
        : newValue;

      // Only save if this is not the initial render
      if (isInitializedRef.current) {
        saveToStorage(nextState);
      }

      return nextState;
    });
  }, [saveToStorage]);

  // Clear stored value
  const clearStoredValue = useCallback(() => {
    if (!storage) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    try {
      storage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from ${storageType} for key "${key}":`, error);
    }
  }, [key, storageType, storage]);

  // Reset to default value and clear storage
  const resetToDefault = useCallback(() => {
    clearStoredValue();
    setState(defaultValue);
  }, [defaultValue, clearStoredValue]);

  // Mark as initialized after first render
  useEffect(() => {
    isInitializedRef.current = true;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Listen for storage events (changes from other tabs/windows)
  useEffect(() => {
    if (!storage || storageType !== 'localStorage') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)
            ? { ...defaultValue, ...parsed }
            : parsed
          );
        } catch (error) {
          console.warn(`Failed to parse storage event value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, storageType, storage]);

  return [state, setPersistentState, resetToDefault, clearStoredValue] as const;
}

// Utility function to clear all app-related storage
export const clearAllAppStorage = (appPrefix: string = 'calculator') => {
  if (typeof window === 'undefined') return;

  const storage = getStorageManager('localStorage');
  if (!storage) return;

  const keysToRemove: string[] = [];

  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(appPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear app storage:', error);
  }
};

// Storage utility functions for manual operations
export const storageUtils = {
  get: <T>(key: string, defaultValue: T, type: 'localStorage' | 'sessionStorage' = 'localStorage'): T => {
    const storage = getStorageManager(type);
    if (!storage) return defaultValue;

    try {
      const stored = storage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T, type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
    const storage = getStorageManager(type);
    if (!storage) return false;

    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string, type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
    const storage = getStorageManager(type);
    if (!storage) return false;

    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  has: (key: string, type: 'localStorage' | 'sessionStorage' = 'localStorage'): boolean => {
    const storage = getStorageManager(type);
    if (!storage) return false;

    try {
      return storage.getItem(key) !== null;
    } catch {
      return false;
    }
  }
};
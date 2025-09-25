import { usePersistentState, clearAllAppStorage } from './usePersistentState';

// Default calculator values type
export interface CalculatorValues {
  localCustomers: number;
  touristCustomers: number;
  localFrequency: number;
  touristFrequency: number;
  targetDishes: number;
  avgGroupSize: number;
  dishesPerPerson: number;
  walkInDaily: number;
  weekdayShowUp: number;
  weekendShowUp: number;
  noShowRate: number;
}

// Storage configuration
const STORAGE_KEY = 'calculator-values';
const DEBOUNCE_MS = 500; // 500ms debounce for better performance

export function useCalculatorState(defaultValues: CalculatorValues) {
  const [values, setValues, resetToDefault, clearStorage] = usePersistentState<CalculatorValues>({
    key: STORAGE_KEY,
    defaultValue: defaultValues,
    debounceMs: DEBOUNCE_MS,
    storageType: 'localStorage'
  });

  // Enhanced reset function that also clears all app storage
  const resetAllValues = () => {
    clearAllAppStorage('calculator');
    resetToDefault();
  };

  // Partial update function for individual field updates
  const updateValue = (key: keyof CalculatorValues, value: number) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Batch update function for multiple fields
  const updateValues = (updates: Partial<CalculatorValues>) => {
    setValues(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Check if values are different from defaults
  const hasUnsavedChanges = () => {
    return JSON.stringify(values) !== JSON.stringify(defaultValues);
  };

  return {
    values,
    setValues,
    updateValue,
    updateValues,
    resetToDefault,
    resetAllValues,
    clearStorage,
    hasUnsavedChanges
  } as const;
}

// Hook for managing calculator preferences (separate from main values)
export function useCalculatorPreferences() {
  return usePersistentState<{
    lastUsedTab?: string;
    showTooltips?: boolean;
    compactMode?: boolean;
  }>({
    key: 'calculator-preferences',
    defaultValue: {
      lastUsedTab: 'calculator',
      showTooltips: true,
      compactMode: false
    },
    debounceMs: 1000,
    storageType: 'localStorage'
  });
}
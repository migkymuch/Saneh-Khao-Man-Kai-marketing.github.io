import React from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { useCalculatorState } from '../hooks/useCalculatorState';

// Example 1: Basic usage with simple state
export function BasicPersistenceExample() {
  const [count, setCount] = usePersistentState({
    key: 'example-counter',
    defaultValue: 0,
    debounceMs: 300
  });

  return (
    <div className="p-4 border rounded">
      <h3>Basic Persistence Example</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Example 2: Complex object state
interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'th';
  showAdvanced: boolean;
  volume: number;
}

export function ComplexStateExample() {
  const [prefs, setPrefs, resetPrefs] = usePersistentState<UserPreferences>({
    key: 'user-preferences',
    defaultValue: {
      theme: 'light',
      language: 'en',
      showAdvanced: false,
      volume: 50
    },
    debounceMs: 500
  });

  const updateTheme = (theme: 'light' | 'dark') => {
    setPrefs(prev => ({ ...prev, theme }));
  };

  const updateVolume = (volume: number) => {
    setPrefs(prev => ({ ...prev, volume }));
  };

  return (
    <div className="p-4 border rounded">
      <h3>Complex State Example</h3>
      <div className="space-y-2">
        <div>
          <label>Theme: </label>
          <select
            value={prefs.theme}
            onChange={(e) => updateTheme(e.target.value as 'light' | 'dark')}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label>Volume: {prefs.volume}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={prefs.volume}
            onChange={(e) => updateVolume(Number(e.target.value))}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={prefs.showAdvanced}
              onChange={(e) => setPrefs(prev => ({ ...prev, showAdvanced: e.target.checked }))}
            />
            Show Advanced Options
          </label>
        </div>

        <button onClick={resetPrefs}>Reset Preferences</button>
      </div>
    </div>
  );
}

// Example 3: Calculator state usage
export function CalculatorStateExample() {
  const { values, updateValue, resetAllValues, hasUnsavedChanges } = useCalculatorState({
    localCustomers: 100,
    touristCustomers: 50,
    localFrequency: 7,
    touristFrequency: 30,
    targetDishes: 200,
    avgGroupSize: 3,
    dishesPerPerson: 2,
    walkInDaily: 20,
    weekdayShowUp: 85,
    weekendShowUp: 75,
    noShowRate: 15
  });

  return (
    <div className="p-4 border rounded">
      <h3>Calculator State Example</h3>
      <div className="space-y-2">
        <div>
          <label>Local Customers: </label>
          <input
            type="number"
            value={values.localCustomers}
            onChange={(e) => updateValue('localCustomers', Number(e.target.value))}
            min="0"
            max="10000"
          />
        </div>

        <div>
          <label>Tourist Customers: </label>
          <input
            type="number"
            value={values.touristCustomers}
            onChange={(e) => updateValue('touristCustomers', Number(e.target.value))}
            min="0"
            max="10000"
          />
        </div>

        <div>
          <label>Target Dishes: </label>
          <input
            type="number"
            value={values.targetDishes}
            onChange={(e) => updateValue('targetDishes', Number(e.target.value))}
            min="50"
            max="500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetAllValues}
            className={hasUnsavedChanges() ? 'text-orange-600' : ''}
          >
            Reset {hasUnsavedChanges() && '●'}
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {hasUnsavedChanges() ? 'You have unsaved changes' : 'No changes from defaults'}
        </div>
      </div>
    </div>
  );
}

// Example 4: SessionStorage usage
export function SessionStorageExample() {
  const [temporaryData, setTemporaryData] = usePersistentState({
    key: 'temp-calculation',
    defaultValue: { result: 0, lastCalculated: null as Date | null },
    debounceMs: 100,
    storageType: 'sessionStorage' // Only persists for this browser session
  });

  const performCalculation = () => {
    const result = Math.random() * 1000;
    setTemporaryData({
      result: Math.round(result),
      lastCalculated: new Date()
    });
  };

  return (
    <div className="p-4 border rounded">
      <h3>Session Storage Example</h3>
      <p>Result: {temporaryData.result}</p>
      <p>Last calculated: {temporaryData.lastCalculated?.toLocaleString() || 'Never'}</p>
      <button onClick={performCalculation}>Calculate Random</button>
      <p className="text-sm text-gray-600 mt-2">
        This data only persists for this browser session
      </p>
    </div>
  );
}

// Usage in a component that shows all examples
export function AllPersistenceExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-bold">Persistence Examples</h2>
      <BasicPersistenceExample />
      <ComplexStateExample />
      <CalculatorStateExample />
      <SessionStorageExample />

      <div className="p-4 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-900">Testing Instructions:</h4>
        <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
          <li>Make changes to any of the examples above</li>
          <li>Refresh the browser - values should persist</li>
          <li>Close and reopen the browser - values should persist (except session storage)</li>
          <li>Open in a new tab - localStorage values sync automatically</li>
          <li>Use reset buttons to clear stored values</li>
        </ol>
      </div>
    </div>
  );
}
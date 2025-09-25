# Persistence Testing Guide

## Overview
This guide provides comprehensive testing instructions for the persistent state functionality implemented in the Customer Rotation Calculator.

## Features Implemented

### ✅ Core Features
- **usePersistentState Hook**: A reusable custom hook for localStorage/sessionStorage persistence
- **useCalculatorState Hook**: Specialized hook for calculator values with debouncing and reset functionality
- **Automatic State Restoration**: Values are automatically restored when the app loads
- **Debounced Updates**: Storage writes are debounced (500ms) to improve performance
- **Cross-tab Synchronization**: Changes in one tab automatically sync to other tabs
- **Reset Functionality**: "รีเซ็ต" button clears all stored values and resets to defaults
- **Visual Indicators**: Reset button shows orange styling when there are unsaved changes

### ✅ Performance Optimizations
- **Debounced Storage Writes**: Prevents excessive localStorage writes during rapid changes
- **Selective Updates**: Only saves when values actually change from defaults
- **Error Handling**: Graceful fallback when localStorage is unavailable (private browsing, etc.)
- **Memory Fallback**: Continues to work even if storage is disabled

## Manual Testing Checklist

### 🧪 Basic Persistence Test
1. **Setup**:
   - Open the calculator app
   - Note current default values in all sliders/inputs

2. **Modify Values**:
   - Change at least 5 different slider values (e.g., Local Customers, Tourist Customers, Target Dishes)
   - Verify the reset button shows orange styling and dot indicator
   - Wait 1 second for debounce to complete

3. **Refresh Test**:
   - Refresh the browser (F5 or Ctrl+R)
   - ✅ **Expected**: All modified values should be restored exactly as set
   - ✅ **Expected**: Reset button should still show orange styling

4. **Browser Close/Reopen Test**:
   - Close the entire browser window
   - Reopen the browser and navigate back to the app
   - ✅ **Expected**: All values should persist exactly as they were

### 🧪 Reset Functionality Test
1. **Test Reset Button**:
   - Modify several calculator values
   - Click the "รีเซ็ต" button
   - ✅ **Expected**: All values return to defaults immediately
   - ✅ **Expected**: Reset button loses orange styling
   - ✅ **Expected**: Success toast appears: "รีเซ็ตค่าเริ่มต้นแล้ว"

2. **Verify Storage Cleared**:
   - After reset, refresh the browser
   - ✅ **Expected**: Values should still be at defaults (not restored from storage)

### 🧪 Cross-Tab Synchronization Test
1. **Setup**:
   - Open the calculator in two browser tabs (Tab A and Tab B)
   - Both should show the same current values

2. **Test Sync**:
   - In Tab A: Modify a slider value (e.g., Local Customers from 100 to 250)
   - Wait 1 second for debounce
   - Switch to Tab B
   - ✅ **Expected**: Tab B should automatically show the updated value (250)

3. **Test Reset Sync**:
   - In Tab A: Click "รีเซ็ต"
   - Switch to Tab B
   - ✅ **Expected**: Tab B should automatically reset to default values

### 🧪 Browser Compatibility Test
Test the following browsers and scenarios:

#### Chrome
- ✅ Normal browsing
- ✅ Incognito mode (should work with session-only storage)

#### Firefox
- ✅ Normal browsing
- ✅ Private browsing mode

#### Edge
- ✅ Normal browsing
- ✅ InPrivate browsing

#### Safari
- ✅ Normal browsing
- ✅ Private browsing mode

### 🧪 Performance Test
1. **Rapid Input Test**:
   - Quickly drag sliders back and forth multiple times
   - Type rapidly in input fields
   - ✅ **Expected**: App remains responsive, no lag
   - ✅ **Expected**: Final values are saved correctly after stopping input

2. **Storage Stress Test**:
   - Open browser developer tools → Application → Local Storage
   - Modify values and watch for storage updates
   - ✅ **Expected**: Storage updates happen only after debounce delay (500ms)
   - ✅ **Expected**: No excessive storage writes during rapid changes

### 🧪 Error Handling Test
1. **Disabled Storage Test**:
   - Open Developer Tools → Console
   - Run: `localStorage.setItem = () => { throw new Error('Storage disabled'); }`
   - Modify calculator values
   - ✅ **Expected**: App continues to work normally (memory-only mode)
   - ✅ **Expected**: Warning message appears in console

2. **Corrupted Storage Test**:
   - Open Developer Tools → Application → Local Storage
   - Find key "calculator-values"
   - Manually edit the JSON to invalid format (e.g., `{invalid json}`)
   - Refresh the page
   - ✅ **Expected**: App loads with default values
   - ✅ **Expected**: Warning message in console about parsing error

## Advanced Testing Scenarios

### Storage Size Limits
1. Test with very large datasets (unlikely but good to verify)
2. Verify graceful handling of localStorage quota exceeded errors

### Edge Cases
1. **Rapid Tab Switching**: Open 5+ tabs, modify values rapidly in different tabs
2. **Network Connectivity**: Test offline scenarios
3. **Browser Extensions**: Test with ad blockers and privacy extensions

## Developer Tools Verification

### Chrome DevTools Inspection
1. Open DevTools (F12)
2. Navigate to **Application** → **Local Storage** → `localhost:3000`
3. Look for keys:
   - `calculator-values`: Main calculator state
   - `calculator-preferences`: User preferences (if implemented)

### Expected Storage Structure
```json
{
  "calculator-values": {
    "localCustomers": 150,
    "touristCustomers": 75,
    "localFrequency": 10,
    "touristFrequency": 45,
    "targetDishes": 300,
    "avgGroupSize": 4,
    "dishesPerPerson": 2.5,
    "walkInDaily": 25,
    "weekdayShowUp": 90,
    "weekendShowUp": 80,
    "noShowRate": 12
  }
}
```

## Debugging Commands

### Console Commands for Testing
```javascript
// Check current stored values
JSON.parse(localStorage.getItem('calculator-values') || '{}')

// Manually set values
localStorage.setItem('calculator-values', JSON.stringify({
  localCustomers: 500,
  touristCustomers: 200
}))

// Clear specific storage
localStorage.removeItem('calculator-values')

// Clear all app storage
Object.keys(localStorage)
  .filter(key => key.startsWith('calculator'))
  .forEach(key => localStorage.removeItem(key))

// Simulate storage disabled
const originalSetItem = localStorage.setItem
localStorage.setItem = () => { throw new Error('Storage disabled') }
// Restore: localStorage.setItem = originalSetItem
```

## Performance Benchmarks

### Expected Performance Characteristics
- **Initial Load**: < 50ms additional overhead for state restoration
- **State Updates**: < 10ms for debounced storage writes
- **Memory Usage**: < 1MB additional for persistence layer
- **Storage Size**: < 1KB for typical calculator values

## Troubleshooting Common Issues

### Issue: Values Don't Persist
**Possible Causes**:
1. Browser in private/incognito mode with strict storage policies
2. Browser extension blocking localStorage
3. Storage quota exceeded
4. JavaScript errors preventing hook execution

**Debugging Steps**:
1. Check browser console for errors
2. Verify localStorage is available: `typeof localStorage !== 'undefined'`
3. Test with extensions disabled

### Issue: Performance Problems
**Possible Causes**:
1. Debounce settings too aggressive
2. Storage writes happening too frequently
3. Large state objects being serialized

**Solutions**:
1. Increase debounce delay
2. Optimize state structure
3. Use partial updates instead of full state replacement

## Success Criteria

✅ **All tests pass**:
- Values persist across browser refresh
- Values persist across browser close/reopen
- Cross-tab synchronization works
- Reset functionality clears storage completely
- Performance remains smooth with rapid inputs
- Graceful fallback when storage is unavailable
- Compatible with all major browsers

This implementation provides enterprise-grade state persistence suitable for production PWA deployment.
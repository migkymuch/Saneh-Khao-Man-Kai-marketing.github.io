import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info } from 'lucide-react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const SliderInput = React.memo(({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  unit = '', 
  tooltip = '',
  icon: Icon 
}: SliderInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize local value and input value
  useEffect(() => {
    setLocalValue(value);
    setInputValue(String(value));
  }, []);

  // Sync with external value changes only when not interacting
  useEffect(() => {
    if (!isDragging && !isInputFocused && value !== localValue) {
      setLocalValue(value);
      setInputValue(String(value));
    }
  }, [value, isDragging, isInputFocused, localValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSliderChange = useCallback((newValue: number[]) => {
    const val = newValue[0];
    setLocalValue(val);
    setInputValue(String(val));
    
    // Immediate update for slider
    onChange(val);
  }, [onChange]);

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    
    // Allow empty input
    if (newInputValue === '') {
      return;
    }
    
    const val = Number(newInputValue);
    
    // Update local value if it's a valid number
    if (!isNaN(val)) {
      setLocalValue(val);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce onChange call while typing
      timeoutRef.current = setTimeout(() => {
        if (val >= min && val <= max) {
          onChange(val);
        }
      }, 500); // 500ms delay for typing
    }
  }, [min, max, onChange]);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const val = Number(inputValue);
    
    // Validate and clamp value on blur
    let finalValue = val;
    if (isNaN(val) || val < min) {
      finalValue = min;
    } else if (val > max) {
      finalValue = max;
    }
    
    setLocalValue(finalValue);
    setInputValue(String(finalValue));
    onChange(finalValue);
  }, [inputValue, min, max, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation and editing keys
    const allowedKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
      'Backspace', 'Delete', 'Tab', 'Enter', 'Home', 'End'
    ];
    const isNumberKey = /^[0-9]$/.test(e.key);
    const isDecimalKey = e.key === '.' && !inputValue.includes('.');
    const isMinusKey = e.key === '-' && inputValue === '' && min < 0;
    
    if (!allowedKeys.includes(e.key) && !isNumberKey && !isDecimalKey && !isMinusKey) {
      e.preventDefault();
    }
    
    // Handle Enter key to apply value and blur
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  }, [inputValue, min]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon 
            className={`w-4 h-4 transition-colors duration-200 ${
              isDragging || isInputFocused ? 'text-blue-600' : 'text-[#761F1C]'
            }`} 
          />
        )}
        <Label 
          className={`text-sm font-medium transition-colors duration-200 ${
            isDragging || isInputFocused ? 'text-blue-700' : ''
          }`}
        >
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info 
                  className={`w-3 h-3 transition-colors duration-200 ${
                    isDragging || isInputFocused ? 'text-blue-500' : 'text-gray-500'
                  }`} 
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div 
          className={`flex-1 transition-all duration-300 ${
            isDragging ? 'scale-[1.02] shadow-lg' : ''
          }`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <Slider
            value={[localValue]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={`w-20 text-center transition-all duration-200 ${
            isDragging || isInputFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
          }`}
          autoComplete="off"
          spellCheck={false}
        />
        {unit && (
          <span 
            className={`text-sm w-8 transition-colors duration-200 ${
              isDragging || isInputFocused ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
});

SliderInput.displayName = 'SliderInput';

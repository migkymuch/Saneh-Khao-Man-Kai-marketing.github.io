import React from 'react';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { calculateMetrics } from '../utils/calculations';

interface CalculatorProps {
  values: any;
  setValues: (values: any) => void;
}

export function Calculator({ values, setValues }: CalculatorProps) {
  const metrics = calculateMetrics(values);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Panel */}
      <div className="lg:col-span-1">
        <InputPanel values={values} setValues={setValues} />
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-2">
        <OutputPanel metrics={metrics} values={values} />
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, Copy } from 'lucide-react';
import { defaultValues } from '../App';
import { calculateMetrics } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Scenario {
  id: string;
  name: string;
  values: any;
}

export function ScenarioComparison() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'ปัจจุบัน',
      values: defaultValues
    }
  ]);

  const addScenario = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `สถานการณ์ ${scenarios.length + 1}`,
      values: { ...defaultValues }
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const duplicateScenario = (scenario: Scenario) => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `${scenario.name} (สำเนา)`,
      values: { ...scenario.values }
    };
    setScenarios([...scenarios, newScenario]);
  };

  const updateScenario = (id: string, field: string, value: number) => {
    setScenarios(scenarios.map(scenario => 
      scenario.id === id 
        ? { ...scenario, values: { ...scenario.values, [field]: value } }
        : scenario
    ));
  };

  // Prepare comparison chart data
  const comparisonData = scenarios.map(scenario => {
    const metrics = calculateMetrics(scenario.values);
    return {
      name: scenario.name,
      capacity: metrics.totalCapacity,
      target: scenario.values.targetDishes,
      gap: metrics.gap
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Scenario Comparison</h2>
          <p className="text-gray-600">เปรียบเทียบสถานการณ์ต่างๆ เพื่อวิเคราะห์ผลกระทบ</p>
        </div>
        <Button onClick={addScenario} className="flex items-center gap-2 bg-[#761F1C] hover:bg-red-800">
          <Plus className="w-4 h-4" />
          เพิ่มสถานการณ์
        </Button>
      </div>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>การเปรียบเทียบ Capacity vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="capacity" fill="#761F1C" name="Capacity" />
                <Bar dataKey="target" fill="#94a3b8" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          const metrics = calculateMetrics(scenario.values);
          const gapColor = metrics.gap >= 0 ? 'text-green-600' : 'text-red-600';
          
          return (
            <Card key={scenario.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateScenario(scenario)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {scenarios.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeScenario(scenario.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">{scenario.values.targetDishes} จาน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{metrics.totalCapacity} จาน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gap:</span>
                    <span className={`font-medium ${gapColor}`}>
                      {metrics.gap >= 0 ? '+' : ''}{metrics.gap}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Base:</span>
                    <span className="font-medium">{metrics.localActiveBase + metrics.touristActiveBase}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant={metrics.gap >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {metrics.gap >= 0 ? 'เกินเป้าหมาย' : 'ต่ำกว่าเป้าหมาย'}
                  </Badge>
                </div>

                {/* Quick Edit Controls */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <label className="text-gray-600">ลูกค้าท้องถิ่น:</label>
                    <input
                      type="number"
                      value={scenario.values.localCustomers}
                      onChange={(e) => updateScenario(scenario.id, 'localCustomers', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center border rounded text-xs"
                      min="0"
                      max="10000"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="text-gray-600">Target จาน:</label>
                    <input
                      type="number"
                      value={scenario.values.targetDishes}
                      onChange={(e) => updateScenario(scenario.id, 'targetDishes', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center border rounded text-xs"
                      min="50"
                      max="500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="text-gray-600">ความถี่ท้องถิ่น:</label>
                    <input
                      type="number"
                      value={scenario.values.localFrequency}
                      onChange={(e) => updateScenario(scenario.id, 'localFrequency', Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center border rounded text-xs"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
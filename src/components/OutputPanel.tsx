import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface OutputPanelProps {
  metrics: any;
  values: any;
}

export function OutputPanel({ metrics, values }: OutputPanelProps) {
  const capacityColor = metrics.totalCapacity >= values.targetDishes ? 'text-green-600' : 'text-red-600';
  const gapColor = metrics.gap >= 0 ? 'text-green-600' : 'text-red-600';

  // Chart data
  const capacityData = [
    {
      name: 'ลูกค้าท้องถิ่น',
      Capacity: metrics.localCapacity,
      Target: values.targetDishes * 0.6, // Assume 60% from locals
    },
    {
      name: 'นักท่องเที่ยว',
      Capacity: metrics.touristCapacity,
      Target: values.targetDishes * 0.3, // Assume 30% from tourists
    },
    {
      name: 'Walk-in',
      Capacity: metrics.walkInCapacity,
      Target: values.targetDishes * 0.1, // Assume 10% from walk-ins
    }
  ];

  const cohortData = [
    { day: 'วันอาทิต์', local: 12, tourist: 8 },
    { day: 'วันจันทร์', local: 14, tourist: 6 },
    { day: 'วันอังคาร', local: 13, tourist: 7 },
    { day: 'วันพุธ', local: 15, tourist: 5 },
    { day: 'วันพฤหัส', local: 14, tourist: 6 },
    { day: 'วันศุกร์', local: 16, tourist: 8 },
    { day: 'วันเสาร์', local: 13, tourist: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Base Local */}
        <Card className="border-l-4 border-l-[#761F1C]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Base (ท้องถิ่น)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#761F1C]">{metrics.localActiveBase}</div>
            <div className="text-xs text-gray-500 mt-1">A = D × τ / μ</div>
          </CardContent>
        </Card>

        {/* Active Base Tourist */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Base (นักท่องเที่ยว)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.touristActiveBase}</div>
            <div className="text-xs text-gray-500 mt-1">A = D × τ / μ</div>
          </CardContent>
        </Card>

        {/* Groups Needed */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Groups ต่อวัน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.groupsPerDay.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">กลุ่ม</div>
          </CardContent>
        </Card>

        {/* Total Capacity */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${capacityColor}`}>{metrics.totalCapacity}</div>
            <div className="text-xs text-gray-500 mt-1">จาน/วัน</div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity vs Target Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#761F1C]" />
            เปรียบเทียบ Target vs Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Target จาน/วัน</span>
                <span className="font-semibold">{values.targetDishes} จาน</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Current Capacity</span>
                <span className={`font-semibold ${capacityColor}`}>{metrics.totalCapacity} จาน</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Gap</span>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${gapColor}`}>
                    {metrics.gap >= 0 ? '+' : ''}{metrics.gap} จาน
                  </span>
                  <Badge variant={metrics.gap >= 0 ? "default" : "destructive"} className="text-xs">
                    {metrics.gap >= 0 ? 'เกินเป้า' : 'ต่ำกว่าเป้า'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="Capacity" fill="#761F1C" />
                  <Bar dataKey="Target" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Rotation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#761F1C]" />
            Cohort Rotation (7 วัน)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="local" stroke="#761F1C" strokeWidth={2} name="ท้องถิ่น" />
                <Line type="monotone" dataKey="tourist" stroke="#2563eb" strokeWidth={2} name="นักท่องเที่ยว" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {metrics.gap < 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>สถานะ: ไม่เพียงพอ</strong> - จำนวน Capacity ปัจจุบันต่ำกว่าเป้าหมาย {Math.abs(metrics.gap)} จาน 
            ควรเพิ่มจำนวนลูกค้าหรือปรับปรุงการบริการ
          </AlertDescription>
        </Alert>
      )}

      {metrics.gap > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>สถานะ: เกินเป้าหมาย</strong> - Capacity เกินเป้าหมาย {metrics.gap} จาน 
            มีศักยภาพในการรองรับลูกค้าเพิ่มเติม
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
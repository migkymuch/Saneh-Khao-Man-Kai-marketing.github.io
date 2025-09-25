import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Calculator } from './components/Calculator';
import { ScenarioComparison } from './components/ScenarioComparison';
import { About } from './components/About';
import { Button } from './components/ui/button';
import { Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useCalculatorState, type CalculatorValues } from './hooks/useCalculatorState';
import { calculateMetrics } from './utils/calculations';
import { aggregateExportData, convertToCSVSections } from './utils/exportData';
import { sectionsToCSV, downloadCSV } from './utils/csvExport';

// Default values for the calculator
export const defaultValues: CalculatorValues = {
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
};

export default function App() {
  const { values, setValues, resetAllValues, hasUnsavedChanges } = useCalculatorState(defaultValues);

  const handleReset = () => {
    resetAllValues();
    toast.success('รีเซ็ตค่าเริ่มต้นแล้ว');
  };

  const handleExport = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('กำลังเตรียมข้อมูลสำหรับส่งออก...');

      // Calculate metrics
      const metrics = calculateMetrics(values);

      // Aggregate all export data
      const exportData = aggregateExportData(values, metrics);

      // Convert to CSV sections
      const csvSections = convertToCSVSections(exportData);

      // Generate CSV content
      const csvContent = sectionsToCSV(csvSections);

      // Download the file
      const success = await downloadCSV(csvContent, {
        filename: undefined, // Will auto-generate timestamp filename
        includeTimestamp: true,
        includeBOM: true // Important for Thai language support
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (success) {
        toast.success('ส่งออกข้อมูลเรียบร้อยแล้ว! 📊', {
          description: 'ไฟล์ CSV ได้ถูกดาวน์โหลดลงในอุปกรณ์ของคุณแล้ว'
        });
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล', {
        description: 'กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <img
              src="/S__3186692.jpg"
              alt="Restaurant Logo"
              className="h-12 w-auto object-contain sm:h-14 md:h-16"
            />
            {/* Title and subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Charm, serif' }}>เสน่ห์ข้าวมันไก่</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1" style={{ fontFamily: 'Sarabun, sans-serif' }}>เครื่องมือคำนวณการหมุนเวียนลูกค้าสำหรับธุรกิจร้านอาหาร</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className={`flex items-center gap-2 ${hasUnsavedChanges() ? 'border-orange-300 text-orange-700 hover:bg-orange-50' : ''}`}
            >
              <RotateCcw className="w-4 h-4" />
              รีเซ็ต
              {hasUnsavedChanges() && (
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-1"></span>
              )}
            </Button>
            <Button onClick={handleExport} className="flex items-center gap-2 bg-[#761F1C] hover:bg-red-800">
              <Download className="w-4 h-4" />
              ส่งออก
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Calculator values={values} setValues={setValues} />
          </TabsContent>

          <TabsContent value="comparison">
            <ScenarioComparison />
          </TabsContent>

          <TabsContent value="about">
            <About />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
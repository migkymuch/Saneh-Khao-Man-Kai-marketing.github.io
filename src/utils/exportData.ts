// Export Data Aggregator for Customer Rotation Calculator

import type { CalculatorValues } from '../hooks/useCalculatorState';
import type { CalculationResults } from './calculations';
import type { CsvSection } from './csvExport';

export interface ExportMetadata {
  exportDate: string;
  exportTime: string;
  appName: string;
  version: string;
  timezone: string;
}

export interface FullExportData {
  metadata: ExportMetadata;
  inputValues: CalculatorValues;
  calculatedResults: CalculationResults;
  analysis: {
    status: string;
    recommendation: string;
    utilizationRate: number;
    capacityStatus: string;
  };
}

/**
 * Creates metadata for the export
 */
export function createExportMetadata(): ExportMetadata {
  const now = new Date();

  return {
    exportDate: now.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    exportTime: now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    appName: 'Customer Rotation Calculator',
    version: '1.0.0',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

/**
 * Creates analysis summary based on calculation results
 */
export function createAnalysisSummary(
  values: CalculatorValues,
  results: CalculationResults
): {
  status: string;
  recommendation: string;
  utilizationRate: number;
  capacityStatus: string;
} {
  const utilizationRate = Math.min(100, (values.targetDishes / results.totalCapacity) * 100);

  let status: string;
  let recommendation: string;
  let capacityStatus: string;

  if (results.gap >= 0) {
    status = 'เกินเป้าหมาย';
    capacityStatus = 'เพียงพอ';
    if (results.gap > values.targetDishes * 0.2) {
      recommendation = 'มีศักยภาพรองรับลูกค้าเพิ่มเติมได้มาก ควรขยายการตลาดหรือเพิ่มเป้าหมาย';
    } else {
      recommendation = 'กำลังการผลิตเหมาะสม มีส่วนเผื่อในการรองรับลูกค้าเพิ่มเติม';
    }
  } else {
    status = 'ต่ำกว่าเป้าหมาย';
    capacityStatus = 'ไม่เพียงพอ';
    if (Math.abs(results.gap) > values.targetDishes * 0.1) {
      recommendation = 'ต้องเพิ่มจำนวนลูกค้าหรือปรับปรุงประสิทธิภาพการบริการอย่างเร่งด่วน';
    } else {
      recommendation = 'ควรเพิ่มจำนวนลูกค้าหรือปรับปรุงอัตราการมาใช้บริการ';
    }
  }

  return {
    status,
    recommendation,
    utilizationRate: Math.round(utilizationRate),
    capacityStatus
  };
}

/**
 * Aggregates all data for export
 */
export function aggregateExportData(
  values: CalculatorValues,
  results: CalculationResults
): FullExportData {
  const metadata = createExportMetadata();
  const analysis = createAnalysisSummary(values, results);

  return {
    metadata,
    inputValues: values,
    calculatedResults: results,
    analysis
  };
}

/**
 * Converts export data to CSV sections with Thai labels
 */
export function convertToCSVSections(exportData: FullExportData): CsvSection[] {
  const sections: CsvSection[] = [];

  // Metadata section
  sections.push({
    title: '🏪 รายงานการวิเคราะห์การหมุนเวียนลูกค้า',
    headers: ['รายการ', 'ค่า'],
    rows: [
      { 'รายการ': 'วันที่ส่งออกข้อมูล', 'ค่า': exportData.metadata.exportDate },
      { 'รายการ': 'เวลาที่ส่งออกข้อมูล', 'ค่า': exportData.metadata.exportTime },
      { 'รายการ': 'ชื่อแอปพลิเคชัน', 'ค่า': exportData.metadata.appName },
      { 'รายการ': 'เวอร์ชัน', 'ค่า': exportData.metadata.version },
      { 'รายการ': 'เขตเวลา', 'ค่า': exportData.metadata.timezone }
    ]
  });

  // Input values section
  sections.push({
    title: '📊 ข้อมูลนำเข้า (Input Parameters)',
    headers: ['พารามิเตอร์', 'ค่า', 'หน่วย', 'คำอธิบาย'],
    rows: [
      {
        'พารามิเตอร์': 'จำนวนลูกค้าท้องถิ่น',
        'ค่า': exportData.inputValues.localCustomers,
        'หน่วย': 'คน',
        'คำอธิบาย': 'จำนวนลูกค้าประจำในพื้นที่'
      },
      {
        'พารามิเตอร์': 'จำนวนลูกค้านักท่องเที่ยว',
        'ค่า': exportData.inputValues.touristCustomers,
        'หน่วย': 'คน',
        'คำอธิบาย': 'จำนวนลูกค้านักท่องเที่ยวที่คาดว่าจะมา'
      },
      {
        'พารามิเตอร์': 'ความถี่การมา (ท้องถิ่น)',
        'ค่า': exportData.inputValues.localFrequency,
        'หน่วย': 'วัน',
        'คำอธิบาย': 'จำนวนวันที่ลูกค้าท้องถิ่นกลับมาใหม่ (τ)'
      },
      {
        'พารามิเตอร์': 'ความถี่การมา (นักท่องเที่ยว)',
        'ค่า': exportData.inputValues.touristFrequency,
        'หน่วย': 'วัน',
        'คำอธิบาย': 'จำนวนวันที่นักท่องเที่ยวกลับมาใหม่ (τ)'
      },
      {
        'พารามิเตอร์': 'Target จานต่อวัน',
        'ค่า': exportData.inputValues.targetDishes,
        'หน่วย': 'จาน',
        'คำอธิบาย': 'เป้าหมายจำนวนจานที่ต้องการขายต่อวัน'
      },
      {
        'พารามิเตอร์': 'ขนาดกลุ่มเฉลี่ย',
        'ค่า': exportData.inputValues.avgGroupSize,
        'หน่วย': 'คน',
        'คำอธิบาย': 'จำนวนคนเฉลี่ยต่อโต๊ะ'
      },
      {
        'พารามิเตอร์': 'จานต่อคนต่อครั้ง (μ)',
        'ค่า': exportData.inputValues.dishesPerPerson,
        'หน่วย': 'จาน',
        'คำอธิบาย': 'จำนวนจานเฉลี่ยที่ลูกค้าหนึ่งคนสั่งต่อครั้ง (μ)'
      },
      {
        'พารามิเตอร์': 'Walk-in ต่อวัน',
        'ค่า': exportData.inputValues.walkInDaily,
        'หน่วย': 'คน',
        'คำอธิบาย': 'จำนวนลูกค้า Walk-in เฉลี่ยต่อวัน'
      },
      {
        'พารามิเตอร์': 'โอกาสมาวันธรรมดา',
        'ค่า': exportData.inputValues.weekdayShowUp,
        'หน่วย': '%',
        'คำอธิบาย': 'โอกาสที่ลูกค้าจะมาในวันธรรมดา'
      },
      {
        'พารามิเตอร์': 'โอกาสมาวันหยุด',
        'ค่า': exportData.inputValues.weekendShowUp,
        'หน่วย': '%',
        'คำอธิบาย': 'โอกาสที่ลูกค้าจะมาในวันหยุด'
      },
      {
        'พารามิเตอร์': 'อัตรา No-show',
        'ค่า': exportData.inputValues.noShowRate,
        'หน่วย': '%',
        'คำอธิบาย': 'เปอร์เซ็นต์ลูกค้าที่จองแล้วไม่มา'
      }
    ]
  });

  // Calculated results section
  sections.push({
    title: '🧮 ผลการคำนวณ (Calculated Results)',
    headers: ['ตัวชี้วัด', 'ค่า', 'หน่วย', 'สูตรการคำนวณ'],
    rows: [
      {
        'ตัวชี้วัด': 'Active Base (ท้องถิ่น)',
        'ค่า': exportData.calculatedResults.localActiveBase,
        'หน่วย': 'คน',
        'สูตรการคำนวณ': 'A = D × τ / μ'
      },
      {
        'ตัวชี้วัด': 'Active Base (นักท่องเที่ยว)',
        'ค่า': exportData.calculatedResults.touristActiveBase,
        'หน่วย': 'คน',
        'สูตรการคำนวณ': 'A = D × τ / μ'
      },
      {
        'ตัวชี้วัด': 'Capacity (ท้องถิ่น)',
        'ค่า': exportData.calculatedResults.localCapacity,
        'หน่วย': 'จาน/วัน',
        'สูตรการคำนวณ': 'C = N × μ × S / τ'
      },
      {
        'ตัวชี้วัด': 'Capacity (นักท่องเที่ยว)',
        'ค่า': exportData.calculatedResults.touristCapacity,
        'หน่วย': 'จาน/วัน',
        'สูตรการคำนวณ': 'C = N × μ × S / τ'
      },
      {
        'ตัวชี้วัด': 'Capacity (Walk-in)',
        'ค่า': exportData.calculatedResults.walkInCapacity,
        'หน่วย': 'จาน/วัน',
        'สูตรการคำนวณ': 'C = W × μ × S'
      },
      {
        'ตัวชี้วัด': 'Total Capacity',
        'ค่า': exportData.calculatedResults.totalCapacity,
        'หน่วย': 'จาน/วัน',
        'สูตรการคำนวณ': 'TC = LC + TouC + WC'
      },
      {
        'ตัวชี้วัด': 'Groups ต่อวัน',
        'ค่า': Number(exportData.calculatedResults.groupsPerDay.toFixed(1)),
        'หน่วย': 'กลุ่ม',
        'สูตรการคำนวณ': 'G = Total Customers / Group Size'
      },
      {
        'ตัวชี้วัด': 'Gap (เกิน/ขาด)',
        'ค่า': exportData.calculatedResults.gap,
        'หน่วย': 'จาน',
        'สูตรการคำนวณ': 'Gap = Total Capacity - Target'
      },
      {
        'ตัวชี้วัด': 'Utilization Rate',
        'ค่า': exportData.calculatedResults.utilizationRate,
        'หน่วย': '%',
        'สูตรการคำนวณ': 'UR = (Target / Total Capacity) × 100'
      }
    ]
  });

  // Analysis summary section
  sections.push({
    title: '📈 สรุปการวิเคราะห์ (Analysis Summary)',
    headers: ['หัวข้อ', 'ผลลัพธ์'],
    rows: [
      { 'หัวข้อ': 'สถานะปัจจุบัน', 'ผลลัพธ์': exportData.analysis.status },
      { 'หัวข้อ': 'สถานะกำลังการผลิต', 'ผลลัพธ์': exportData.analysis.capacityStatus },
      { 'หัวข้อ': 'อัตราการใช้กำลังการผลิต', 'ผลลัพธ์': `${exportData.analysis.utilizationRate}%` },
      { 'หัวข้อ': 'คำแนะนำ', 'ผลลัพธ์': exportData.analysis.recommendation }
    ]
  });

  // Capacity breakdown section
  const totalCapacity = exportData.calculatedResults.totalCapacity;
  sections.push({
    title: '🔍 รายละเอียด Capacity (Capacity Breakdown)',
    headers: ['ประเภทลูกค้า', 'Capacity (จาน/วัน)', '% ของ Total Capacity', 'สัดส่วนที่แนะนำ'],
    rows: [
      {
        'ประเภทลูกค้า': 'ลูกค้าท้องถิ่น',
        'Capacity (จาน/วัน)': exportData.calculatedResults.localCapacity,
        '% ของ Total Capacity': totalCapacity > 0 ? `${((exportData.calculatedResults.localCapacity / totalCapacity) * 100).toFixed(1)}%` : '0%',
        'สัดส่วนที่แนะนำ': '60-70%'
      },
      {
        'ประเภทลูกค้า': 'นักท่องเที่ยว',
        'Capacity (จาน/วัน)': exportData.calculatedResults.touristCapacity,
        '% ของ Total Capacity': totalCapacity > 0 ? `${((exportData.calculatedResults.touristCapacity / totalCapacity) * 100).toFixed(1)}%` : '0%',
        'สัดส่วนที่แนะนำ': '20-30%'
      },
      {
        'ประเภทลูกค้า': 'Walk-in',
        'Capacity (จาน/วัน)': exportData.calculatedResults.walkInCapacity,
        '% ของ Total Capacity': totalCapacity > 0 ? `${((exportData.calculatedResults.walkInCapacity / totalCapacity) * 100).toFixed(1)}%` : '0%',
        'สัดส่วนที่แนะนำ': '10-15%'
      }
    ]
  });

  return sections;
}

/**
 * Creates a simple flat CSV structure (alternative format)
 */
export function createFlatCSVData(exportData: FullExportData): Array<{[key: string]: any}> {
  return [
    // Metadata row
    {
      'ประเภทข้อมูล': 'ข้อมูลการส่งออก',
      'รายการ': 'วันที่ส่งออก',
      'ค่า': exportData.metadata.exportDate,
      'หน่วย': '',
      'คำอธิบาย': 'วันที่ที่ทำการส่งออกข้อมูล'
    },

    // Input parameters
    {
      'ประเภทข้อมูล': 'พารามิเตอร์นำเข้า',
      'รายการ': 'จำนวนลูกค้าท้องถิ่น',
      'ค่า': exportData.inputValues.localCustomers,
      'หน่วย': 'คน',
      'คำอธิบาย': 'จำนวนลูกค้าประจำในพื้นที่'
    },

    // Results
    {
      'ประเภทข้อมูล': 'ผลการคำนวณ',
      'รายการ': 'Total Capacity',
      'ค่า': exportData.calculatedResults.totalCapacity,
      'หน่วย': 'จาน/วัน',
      'คำอธิบาย': 'กำลังการผลิตรวมทั้งหมด'
    },

    // Analysis
    {
      'ประเภทข้อมูล': 'การวิเคราะห์',
      'รายการ': 'สถานะ',
      'ค่า': exportData.analysis.status,
      'หน่วย': '',
      'คำอธิบาย': 'สถานะเปรียบเทียบกับเป้าหมาย'
    }
  ];
}
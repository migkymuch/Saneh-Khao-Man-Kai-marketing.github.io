import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calculator, Users, Target, TrendingUp, Info } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Charm, serif' }}>เกี่ยวกับ เสน่ห์ข้าวมันไก่</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          เครื่องมือคำนวณการหมุนเวียนลูกค้าสำหรับธุรกิจร้านอาหาร ช่วยวิเคราะห์ Active Base และ Capacity 
          เพื่อการวางแผนและปรับปรุงประสิทธิภาพการดำเนินงาน
        </p>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#761F1C]">
              <Users className="w-5 h-5" />
              Active Base (A)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm font-mono">A = D × τ / μ</code>
            </div>
            <ul className="text-sm space-y-1 text-gray-600">
              <li><strong>D</strong> = จำนวนจานต่อวัน (Daily Dishes)</li>
              <li><strong>τ</strong> = ความถี่การมา (Frequency in days)</li>
              <li><strong>μ</strong> = จานต่อคนต่อครั้ง (Dishes per person)</li>
            </ul>
            <p className="text-sm text-gray-700">
              Active Base คือจำนวนลูกค้าที่ต้องมีในระบบเพื่อให้เกิดยอดขายตามเป้าหมาย
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#761F1C]">
              <Target className="w-5 h-5" />
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              ความสามารถในการให้บริการจริงที่คำนวณจาก:
            </p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• จำนวนลูกค้าแต่ละประเภท</li>
              <li>• อัตราการมา (Show-up rate)</li>
              <li>• อัตรา No-show</li>
              <li>• ความถี่การมาของแต่ละกลุ่ม</li>
            </ul>
            <div className="flex gap-2 flex-wrap mt-3">
              <Badge variant="outline" className="text-xs">ลูกค้าท้องถิ่น</Badge>
              <Badge variant="outline" className="text-xs">นักท่องเที่ยว</Badge>
              <Badge variant="outline" className="text-xs">Walk-in</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <Calculator className="w-5 h-5" />
            วิธีการใช้งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">1. ตั้งค่าข้อมูลพื้นฐาน</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• ระบุจำนวนลูกค้าท้องถิ่นและนักท่องเที่ยว</li>
                <li>• ตั้งค่าความถี่การมาของแต่ละกลุ่ม</li>
                <li>• กำหนดเป้าหมายจานต่อวัน</li>
                <li>• ระบุขนาดกลุ่มและจานต่อคน</li>
              </ul>

              <h4 className="font-medium text-gray-900">2. ปรับแต่งการประเมิน</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• ตั้งค่าจำนวน Walk-in ต่อวัน</li>
                <li>• ปรับอัตรา No-show และโอกาสการมา</li>
                <li>• แยกการตั้งค่าวันธรรมดาและวันหยุด</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">3. วิเคราะห์ผลลัพธ์</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• ดู Active Base ที่จำเป็น</li>
                <li>• เปรียบเทียบ Capacity กับ Target</li>
                <li>• วิเคราะห์ Gap และแนวทางปรับปรุง</li>
                <li>• ดูแนวโน้ม Cohort Rotation</li>
              </ul>

              <h4 className="font-medium text-gray-900">4. การใช้งานขั้นสูง</h4>
              <ul className="text-sm space-y-1 text-gray-600 ml-4">
                <li>• ใช้ Scenario Comparison เปรียบเทียบ</li>
                <li>• ส่งออกข้อมูลเพื่อวิเคราะห์เพิ่มเติม</li>
                <li>• ใช้ tooltip เพื่อเข้าใจตัวแปรต่างๆ</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <TrendingUp className="w-5 h-5" />
            ประโยชน์ที่ได้รับ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#761F1C] rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium">วางแผนลูกค้า</h4>
              <p className="text-sm text-gray-600">
                คำนวณจำนวนลูกค้าที่ต้องการเพื่อให้ถึงเป้าหมาย
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#761F1C] rounded-full flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium">ปรับปรุงประสิทธิภาพ</h4>
              <p className="text-sm text-gray-600">
                ระบุช่องว่างและวางแผนการปรับปรุง
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#761F1C] rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium">เพิ่มยอดขาย</h4>
              <p className="text-sm text-gray-600">
                วิเคราะห์ศักยภาพและวางแผนการเติบโต
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Info className="w-5 h-5" />
            หมายเหตุสำคัญ
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <ul className="space-y-1 text-sm">
            <li>• ผลลัพธ์เป็นการประมาณการโดยใช้โมเดลทางคณิตศาสตร์</li>
            <li>• ควรใช้ข้อมูลจริงของธุรกิจเพื่อความแม่นยำ</li>
            <li>• แนะนำให้ปรับปรุงข้อมูลเป็นระยะๆ</li>
            <li>• การคำนวณอิงจากสมมติฐานที่สามารถปรับเปลี่ยนได้</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
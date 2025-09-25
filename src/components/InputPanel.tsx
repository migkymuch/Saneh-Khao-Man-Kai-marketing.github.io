import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SliderInput } from './SliderInput';
import { Users, Calendar, UtensilsCrossed, Percent } from 'lucide-react';

interface InputPanelProps {
  values: any;
  setValues: (values: any) => void;
}

export function InputPanel({ values, setValues }: InputPanelProps) {
  const updateValue = useCallback((key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, [setValues]);

  return (
    <div className="space-y-6">
      {/* Customer Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <Users className="w-5 h-5" />
            จำนวนลูกค้า
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SliderInput
            label="ลูกค้าท้องถิ่น"
            value={values.localCustomers}
            onChange={(val: number) => updateValue('localCustomers', val)}
            min={0}
            max={10000}
            unit="คน"
            tooltip="จำนวนลูกค้าประจำในพื้นที่"
            icon={Users}
          />
          <SliderInput
            label="ลูกค้านักท่องเที่ยว"
            value={values.touristCustomers}
            onChange={(val: number) => updateValue('touristCustomers', val)}
            min={0}
            max={10000}
            unit="คน"
            tooltip="จำนวนลูกค้านักท่องเที่ยวที่คาดว่าจะมา"
            icon={Users}
          />
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <Calendar className="w-5 h-5" />
            ความถี่การมา (τ)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SliderInput
            label="ลูกค้าท้องถิ่น"
            value={values.localFrequency}
            onChange={(val: number) => updateValue('localFrequency', val)}
            min={1}
            max={30}
            unit="วัน"
            tooltip="จำนวนวันที่ลูกค้าท้องถิ่นกลับมาใหม่ (τ)"
            icon={Calendar}
          />
          <SliderInput
            label="ลูกค้านักท่องเที่ยว"
            value={values.touristFrequency}
            onChange={(val: number) => updateValue('touristFrequency', val)}
            min={7}
            max={90}
            unit="วัน"
            tooltip="จำนวนวันที่นักท่องเที่ยวกลับมาใหม่ (τ)"
            icon={Calendar}
          />
        </CardContent>
      </Card>

      {/* Target & Group Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <UtensilsCrossed className="w-5 h-5" />
            เป้าหมายและกลุ่มลูกค้า
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SliderInput
            label="Target จานต่อวัน"
            value={values.targetDishes}
            onChange={(val: number) => updateValue('targetDishes', val)}
            min={50}
            max={500}
            unit="จาน"
            tooltip="เป้าหมายจำนวนจานที่ต้องการขายต่อวัน"
            icon={UtensilsCrossed}
          />
          <SliderInput
            label="ขนาดกลุ่มเฉลี่ย"
            value={values.avgGroupSize}
            onChange={(val: number) => updateValue('avgGroupSize', val)}
            min={1}
            max={8}
            unit="คน"
            tooltip="จำนวนคนเฉลี่ยต่อโต๊ะ"
            icon={Users}
          />
          <SliderInput
            label="จานต่อคนต่อครั้ง (μ)"
            value={values.dishesPerPerson}
            onChange={(val: number) => updateValue('dishesPerPerson', val)}
            min={1}
            max={5}
            unit="จาน"
            tooltip="จำนวนจานเฉลี่ยที่ลูกค้าหนึ่งคนสั่งต่อครั้ง (μ)"
            icon={UtensilsCrossed}
          />
        </CardContent>
      </Card>

      {/* Walk-in & Show-up */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#761F1C]">
            <Percent className="w-5 h-5" />
            Walk-in และ No-show
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SliderInput
            label="Walk-in ต่อวัน"
            value={values.walkInDaily}
            onChange={(val: number) => updateValue('walkInDaily', val)}
            min={0}
            max={100}
            unit="คน"
            tooltip="จำนวนลูกค้า Walk-in เฉลี่ยต่อวัน"
            icon={Users}
          />
          <SliderInput
            label="อัตรา No-show"
            value={values.noShowRate}
            onChange={(val: number) => updateValue('noShowRate', val)}
            min={0}
            max={50}
            unit="%"
            tooltip="เปอร์เซ็นต์ลูกค้าที่จองแล้วไม่มา"
            icon={Percent}
          />
          <SliderInput
            label="โอกาสมาวันธรรมดา"
            value={values.weekdayShowUp}
            onChange={(val: number) => updateValue('weekdayShowUp', val)}
            min={50}
            max={100}
            unit="%"
            tooltip="โอกาสที่ลูกค้าจะมาในวันธรรมดา"
            icon={Percent}
          />
          <SliderInput
            label="โอกาสมาวันหยุด"
            value={values.weekendShowUp}
            onChange={(val: number) => updateValue('weekendShowUp', val)}
            min={50}
            max={100}
            unit="%"
            tooltip="โอกาสที่ลูกค้าจะมาในวันหยุด"
            icon={Percent}
          />
        </CardContent>
      </Card>
    </div>
  );
}
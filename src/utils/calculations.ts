// Calculation utilities for Customer Rotation Calculator

export interface CalculationValues {
  localCustomers: number;
  touristCustomers: number;
  localFrequency: number;    // τ (tau) - days between visits
  touristFrequency: number;  // τ (tau) - days between visits
  targetDishes: number;
  avgGroupSize: number;
  dishesPerPerson: number;   // μ (mu) - dishes per person per visit
  walkInDaily: number;
  weekdayShowUp: number;     // percentage
  weekendShowUp: number;     // percentage
  noShowRate: number;        // percentage
}

export interface CalculationResults {
  localActiveBase: number;
  touristActiveBase: number;
  localCapacity: number;
  touristCapacity: number;
  walkInCapacity: number;
  totalCapacity: number;
  groupsPerDay: number;
  gap: number;
  utilizationRate: number;
}

export function calculateMetrics(values: CalculationValues): CalculationResults {
  // Active Base calculation: A = D × τ / μ
  // Where D = daily dishes, τ = frequency (days), μ = dishes per person
  
  // For locals: assume they contribute 60% of target dishes
  const localDailyDishes = values.targetDishes * 0.6;
  const localActiveBase = Math.round((localDailyDishes * values.localFrequency) / values.dishesPerPerson);
  
  // For tourists: assume they contribute 30% of target dishes
  const touristDailyDishes = values.targetDishes * 0.3;
  const touristActiveBase = Math.round((touristDailyDishes * values.touristFrequency) / values.dishesPerPerson);
  
  // Calculate daily capacity from each customer type
  // Account for show-up rates and no-show rates
  const avgShowUpRate = (values.weekdayShowUp * 5 + values.weekendShowUp * 2) / 7 / 100;
  const effectiveShowRate = avgShowUpRate * (1 - values.noShowRate / 100);
  
  const localCapacity = Math.round((values.localCustomers * effectiveShowRate * values.dishesPerPerson) / values.localFrequency);
  const touristCapacity = Math.round((values.touristCustomers * effectiveShowRate * values.dishesPerPerson) / values.touristFrequency);
  const walkInCapacity = Math.round(values.walkInDaily * values.dishesPerPerson * effectiveShowRate);
  
  const totalCapacity = localCapacity + touristCapacity + walkInCapacity;
  
  // Calculate groups needed per day
  const totalCustomersPerDay = (values.localCustomers / values.localFrequency) + 
                              (values.touristCustomers / values.touristFrequency) + 
                              values.walkInDaily;
  const groupsPerDay = totalCustomersPerDay / values.avgGroupSize;
  
  // Calculate gap (positive = excess capacity, negative = shortage)
  const gap = totalCapacity - values.targetDishes;
  
  // Calculate utilization rate
  const utilizationRate = Math.min(100, (values.targetDishes / totalCapacity) * 100);
  
  return {
    localActiveBase,
    touristActiveBase,
    localCapacity,
    touristCapacity,
    walkInCapacity,
    totalCapacity,
    groupsPerDay,
    gap,
    utilizationRate: Math.round(utilizationRate)
  };
}
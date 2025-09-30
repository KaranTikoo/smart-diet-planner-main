// Mock data for charts
export const weeklyData = [
  { day: "Mon", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Tue", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Wed", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Thu", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Fri", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Sat", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
  { day: "Sun", calories: 0, weight: 0, carbs: 0, protein: 0, fat: 0 },
];

export const generateMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i - 1));
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    
    // Initialize weight and calories to 0
    const weight = 0;
    const calories = 0;
    
    return {
      day,
      weight,
      calories,
    };
  });
};

// Mock data for charts
export const weeklyData = [
  { day: "Mon", calories: 1800, weight: 80.2, carbs: 180, protein: 120, fat: 60 },
  { day: "Tue", calories: 1750, weight: 80.0, carbs: 170, protein: 125, fat: 58 },
  { day: "Wed", calories: 1900, weight: 79.8, carbs: 190, protein: 130, fat: 62 },
  { day: "Thu", calories: 1650, weight: 79.5, carbs: 160, protein: 115, fat: 55 },
  { day: "Fri", calories: 1700, weight: 79.3, carbs: 165, protein: 120, fat: 57 },
  { day: "Sat", calories: 2000, weight: 79.1, carbs: 200, protein: 135, fat: 65 },
  { day: "Sun", calories: 1950, weight: 79.0, carbs: 195, protein: 130, fat: 63 },
];

export const generateMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i - 1));
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    
    // Generate some realistic weight data (slight downward trend)
    const startWeight = 82;
    const dailyVariation = Math.random() * 0.4 - 0.2;
    const trendDecrease = i * 0.1;
    const weight = parseFloat((startWeight - trendDecrease + dailyVariation).toFixed(1));
    
    return {
      day,
      weight,
      calories: 1500 + Math.floor(Math.random() * 600),
    };
  });
};

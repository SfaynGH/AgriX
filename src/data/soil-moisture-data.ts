export const generateSoilMoistureData = (startDate: string, days: number) => {
    const data = [];
    const start = new Date(startDate);
  
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      data.push({
        date: date.toISOString().split("T")[0], // Format YYYY-MM-DD
        moisture: Math.round(Math.random() * (70 - 30) + 30), // Random moisture between 30% and 70%
      });
    }
  
    return data;
  };
  
  export const soilMoistureData = generateSoilMoistureData("2024-01-01", 500);
  
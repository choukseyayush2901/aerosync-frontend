// utils/theme.ts

// 1. Data Shape yahan define kar diya
export interface PollutionData {
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
}

// 2. Default Theme yahan bana di
export const getDefaultTheme = () => ({
  level: "Waiting",
  panelBg: "from-indigo-600 to-blue-800",
  cloud: "",
  plant: "",
  particles: "",
  particleAnim: "",
  statusColor: "text-blue-100",
});

// 3. Dynamic Theme Logic yahan nikal liya
export const getPollutionTheme = (aqiValue: number) => {
  if (aqiValue <= 20) {
    return {
      level: "Excellent",
      panelBg: "from-blue-400 to-emerald-600",
      cloud: "☁️",
      plant: "🌳",
      particles: "✨",
      particleAnim: "animate-pulse",
      statusColor: "text-emerald-100",
    };
  } else if (aqiValue <= 50) {
    return {
      level: "Good",
      panelBg: "from-blue-400 to-yellow-600",
      cloud: "⛅",
      plant: "🌿",
      particles: "🍃",
      particleAnim: "animate-bounce",
      statusColor: "text-yellow-100",
    };
  } else if (aqiValue <= 100) {
    return {
      level: "Average",
      panelBg: "from-slate-500 to-orange-700",
      cloud: "🌫️",
      plant: "🍂",
      particles: "💨",
      particleAnim: "animate-pulse duration-75",
      statusColor: "text-orange-100",
    };
  } else {
    return {
      level: "Bad",
      panelBg: "from-slate-800 to-red-800",
      cloud: "🌩️",
      plant: "🥀",
      particles: "☠️",
      particleAnim: "animate-bounce duration-75",
      statusColor: "text-red-200",
    };
  }
};

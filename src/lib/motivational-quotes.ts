const QUOTES = [
  "Your body is 60% water — keep it topped up! 💧",
  "Even your brain needs water to think clearly 🧠",
  "Small sips, big impact. Keep going! 🌱",
  "Hydration is the foundation of wellness 💪",
  "Water is the best beauty product 🌟",
  "A hydrated body is a happy body 😊",
  "Your plant friend is counting on you! 🌿",
  "Every glass brings you closer to your goal 🎯",
  "Stay consistent, stay healthy 🔥",
  "Your future self thanks you for this glass 🙏",
  "Hydration fuels your energy all day ⚡",
  "Clear skin starts with clear water 💎",
  "You're doing amazing — keep sipping! 🥤",
  "Water: the original superfood 🌊",
];

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

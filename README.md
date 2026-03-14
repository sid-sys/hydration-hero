# 💧 Hydration Hero

A playful, colorful mobile water tracking app where a plant mascot grows as you stay hydrated.

## 🌟 Features

- **Plant mascot**: Grows through stages (sprout → small plant → flowering → blooming tree) based on daily hydration progress.
- **Circular progress ring**: Daily water intake vs. goal tracking.
- **Gamification**: Badges, achievements, and XP/Levels.
- **History & Stats**: Weekly/monthly calendar view and bar charts.
- **Settings**: Customizable water goals, reminder intervals, and cup sizes.

## 🛠️ Technology Stack

- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** & **shadcn/ui** for styling
- **Capacitor** for native mobile deployment
- **Local Storage** for data persistence

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   cd hydration-hero
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Native Deployment (Capacitor)

1. Build the web app:
   ```sh
   npm run build
   ```

2. Add a platform:
   ```sh
   npx cap add ios
   # OR
   npx cap add android
   ```

3. Sync the project:
   ```sh
   npx cap sync
   ```

## 📄 License

MIT

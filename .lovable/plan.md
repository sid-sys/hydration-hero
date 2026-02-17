
# 💧 Water Reminder App — with Plant Mascot & Gamification

## Overview
A playful, colorful mobile water tracking app where a plant mascot grows as you stay hydrated. Built as a PWA-ready web app with Capacitor for native mobile deployment. Data stored locally on the device.

## Pages & Features

### 1. Home / Dashboard
- **Plant mascot** front and center — starts as a seedling, grows through stages (sprout → small plant → flowering → blooming tree) based on daily hydration progress
- Plant shows visual reactions: wilting when behind schedule, perking up when you drink
- **Circular progress ring** showing daily water intake vs. goal (e.g., 8 glasses / 2L)
- Big **"Drink Water" button** — tap to log a glass (with a satisfying splash animation)
- Quick stats: glasses today, current streak, level

### 2. Streak & Gamification
- **Daily streak counter** — consecutive days meeting your water goal
- **Badges & achievements**: "3-Day Streak", "Week Warrior", "30-Day Legend", "First Bloom", etc.
- **XP & Levels** — earn XP for each glass and streak milestones, level up to unlock new plant varieties
- **Plant garden** — a collection view showing all plants you've "grown" by completing daily goals

### 3. History & Stats
- **Weekly/monthly calendar view** showing which days you hit your goal
- Simple bar chart of daily intake over the past week
- Best streak and total water consumed stats

### 4. Settings
- Set daily water goal (number of glasses or milliliters)
- Reminder intervals (every 1h, 2h, custom) — local notifications via Capacitor
- Choose cup size (small/medium/large)
- Reset progress option

## Design
- Bright, playful color palette with greens, blues, and warm accents
- Rounded cards and buttons, bouncy micro-animations
- Confetti or sparkle effects when hitting daily goal
- Plant growth animations as the main visual reward

## Technical Approach
- **Capacitor** for native iOS/Android deployment
- **Local storage** (localStorage) for all data — no backend needed
- **Capacitor Local Notifications** plugin for drink reminders
- Smooth CSS/JS animations for plant growth and interactions

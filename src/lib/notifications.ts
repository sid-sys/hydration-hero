import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getRandomQuote } from "@/lib/motivational-quotes";

export async function setupNotificationActions() {
  if (!Capacitor.isNativePlatform()) return;

  // Register action types for notification buttons
  await LocalNotifications.registerActionTypes({
    types: [
      {
        id: "HYDRATION_REMINDER",
        actions: [
          {
            id: "drink",
            title: "💧 Drink",
            foreground: true, // Opens the app
          },
          {
            id: "snooze",
            title: "😴 Snooze (5 min)",
            foreground: false,
          },
        ],
      },
    ],
  });

  // Listen for action performed
  LocalNotifications.addListener("localNotificationActionPerformed", async (notification) => {
    const actionId = notification.actionId;
    if (actionId === "snooze") {
      // Schedule a follow-up notification in 5 minutes
      const remindAt = new Date(Date.now() + 5 * 60 * 1000);
      const quote = getRandomQuote();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Hey chief, quick reminder! 💧",
            body: `Snooze is over. ${quote}`,
            id: 8888,
            schedule: { at: remindAt },
            sound: undefined,
            smallIcon: "ic_stat_icon",
            iconColor: "#4ade80",
            actionTypeId: "HYDRATION_REMINDER",
          },
        ],
      });
    }
    // "drink" with foreground: true will open the app automatically
  });
}


export async function scheduleReminders(
  intervalHours: number,
  wakeTime = "07:00",
  bedTime = "22:00",
  userName = "chief"
) {
  if (!Capacitor.isNativePlatform()) return;

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  // Cancel existing
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel(pending);
  }

  const [wakeH] = wakeTime.split(":").map(Number);
  const [bedH] = bedTime.split(":").map(Number);

  const notifications = [];
  const now = Date.now();
  
  // Schedule 64 upcoming reminders to ensure coverage for high-frequency settings
  // At 5m intervals, this covers ~5.3 hours of notification history
  for (let i = 1; i <= 64; i++) {
    const triggerMs = now + (intervalHours * 3600 * 1000 * i);
    const triggerDate = new Date(triggerMs);

    const h = triggerDate.getHours();
    // Only schedule if within wake/bed hours
    if (h >= wakeH && h <= bedH) {
      const quote = getRandomQuote();
      notifications.push({
        title: `Hey chief, time to hydrate! 💧`,
        body: `Hey ${userName}! ${quote}`,
        id: 1000 + i,
        schedule: { 
          at: triggerDate,
          allowWhileIdle: true 
        },
        sound: undefined,
        smallIcon: "ic_stat_icon",
        iconColor: "#4ade80",
        actionTypeId: "HYDRATION_REMINDER",
      });
    }
  }


  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}


export async function scheduleWeeklySummary(userName = "chief") {
  if (!Capacitor.isNativePlatform()) return;

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(10, 0, 0, 0);

  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Hey chief, weekly recap! 📊",
        body: `Hey ${userName}! Check out your hydration stats for this week. Keep growing that garden! 🌿`,
        id: 9000,
        schedule: { at: nextSunday },
        sound: undefined,
        smallIcon: "ic_stat_icon",
        iconColor: "#4ade80",
      },
    ],
  });
}

export async function scheduleSampleNotification() {
  if (!Capacitor.isNativePlatform()) return;

  // Schedule a notification for 2 seconds from now to test
  const triggerAt = new Date(Date.now() + 2000);
  const quote = getRandomQuote();

  await LocalNotifications.schedule({
    notifications: [
      {
        title: "Test: Time to hydrate! 💧",
        body: `Testing buttons. ${quote}`,
        id: 7777,
        schedule: { at: triggerAt },
        sound: undefined,
        smallIcon: "ic_stat_icon",
        iconColor: "#4ade80",
        actionTypeId: "HYDRATION_REMINDER",
      },
    ],
  });
}


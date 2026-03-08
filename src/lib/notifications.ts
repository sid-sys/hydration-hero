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
            id: "drink_now",
            title: "💧 Drink Now",
            foreground: true, // Opens the app
          },
          {
            id: "remind_later",
            title: "⏰ Remind in 5 min",
            foreground: false,
          },
        ],
      },
    ],
  });

  // Listen for action performed
  LocalNotifications.addListener("localNotificationActionPerformed", async (notification) => {
    const actionId = notification.actionId;
    if (actionId === "remind_later") {
      // Schedule a follow-up notification in 5 minutes
      const remindAt = new Date(Date.now() + 5 * 60 * 1000);
      const quote = getRandomQuote();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Hey chief, quick reminder! 💧",
            body: `You asked to be reminded. ${quote}`,
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
    // "drink_now" with foreground: true will open the app automatically
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
  for (let i = 1; i <= 16; i++) {
    const triggerDate = new Date();
    triggerDate.setHours(triggerDate.getHours() + intervalHours * i);

    const h = triggerDate.getHours();
    if (h >= wakeH && h <= bedH) {
      const quote = getRandomQuote();
      notifications.push({
        title: `Hey chief, time to hydrate! 💧`,
        body: `Hey ${userName}! ${quote}`,
        id: 1000 + i,
        schedule: { at: triggerDate },
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

export async function cancelReminders() {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel(pending);
  }
}

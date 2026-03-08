import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function scheduleReminders(intervalHours: number) {
  if (!Capacitor.isNativePlatform()) return;

  // Request permission
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  // Cancel existing
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel(pending);
  }

  // Schedule recurring notifications
  const notifications = [];
  for (let i = 1; i <= 12; i++) {
    const triggerDate = new Date();
    triggerDate.setHours(triggerDate.getHours() + intervalHours * i);

    // Only schedule between 7am and 10pm
    if (triggerDate.getHours() >= 7 && triggerDate.getHours() <= 22) {
      notifications.push({
        title: "💧 Time to Hydrate!",
        body: "Your plant is getting thirsty. Drink some water!",
        id: 1000 + i,
        schedule: { at: triggerDate },
        sound: undefined,
        smallIcon: "ic_stat_icon",
        iconColor: "#4ade80",
      });
    }
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

export async function cancelReminders() {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel(pending);
  }
}

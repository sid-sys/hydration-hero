import { Haptics, ImpactStyle } from "@capacitor/haptics";

export async function triggerHaptic() {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Haptics not available (web browser), silently ignore
  }
}

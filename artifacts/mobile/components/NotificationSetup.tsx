// Notifications via expo-notifications are not supported in Expo Go on Android SDK 53+.
// This module is intentionally left as a stub.
// To enable real push/local notifications, use a development build (EAS Build).

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleDailyReminder(
  _hour?: number,
  _minute?: number
): Promise<string | null> {
  return null;
}

export async function cancelAllReminders(): Promise<void> {}

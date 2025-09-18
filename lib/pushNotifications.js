import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { supabase } from './supabase'

// Конфиг поведения (опционально)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null

  const settings = await Notifications.getPermissionsAsync()
  let finalStatus = settings.status
  if (finalStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return null

  const token = (await Notifications.getExpoPushTokenAsync()).data
  // Android канал (опционально)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }
  return token
}

export async function upsertUserPushToken(userId, token) {
  if (!userId || !token) return
  const { error } = await supabase
    .from('users')
    .update({ push_token: token })
    .eq('id', userId)
  if (error) throw error
}

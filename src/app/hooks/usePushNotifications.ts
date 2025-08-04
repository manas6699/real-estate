import { onMessage } from 'firebase/messaging';
import { useEffect } from 'react';
import axios from 'axios';

import { POST_FCM_TOKEN } from '@/config/api';

export const usePushNotifications = (userId: unknown) => {
  useEffect(() => {
    if (!userId) return;

    const getPermissionAndToken = async () => {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');

        // ✅ Dynamically import firebase messaging only in browser
        const { getToken } = await import('firebase/messaging');
        const { messaging } = await import('../../config/firebase');

        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          });

          console.log('FCM Token:', token);

          // ✅ Use Axios to POST token
          await axios.post(POST_FCM_TOKEN, {
            userId,
            fcmToken: token,
          });

          console.log('FCM token sent to backend.');

          // ✅ Add foreground notification handler
          onMessage(messaging, (payload) => {
            console.log('Foreground push received:', payload);

            new Notification(payload.notification?.title ?? '', {
              body: payload.notification?.body ?? '',
              icon: '/icon.png',
            });
          });

        } catch (error) {
          console.error('Error getting or sending FCM token:', error);
        }
      } else {
        console.log('Notification permission denied.');
      }
    };

    getPermissionAndToken();
  }, [userId]);
};

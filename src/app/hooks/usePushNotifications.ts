import { useEffect } from 'react';

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

        const token = await getToken(messaging, {
          vapidKey: process.env.VAPID_KEY
        });

        console.log('FCM Token:', token);

        await fetch('/api/users/save-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, fcmToken: token })
        });
      } else {
        console.log('Notification permission denied.');
      }
    };

    getPermissionAndToken();
  }, [userId]);
};

// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyA2_WS4wTlXPYCxO7QX3XEb2zKY4KGxdyc",
  authDomain: "test-node-with-firebase.firebaseapp.com",
  projectId: "test-node-with-firebase",
  messagingSenderId: "303483129418",
  appId: "1:303483129418:web:f10eef55a11aac4eaa20b3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: payload.data,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

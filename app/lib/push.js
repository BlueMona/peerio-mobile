import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { socket } from '../lib/icebear';
import { when } from 'mobx';

function enablePushNotifications() {
    PushNotification.configure({
        onRegister(token) {
            console.log(`push.js: OS: ${Platform.OS}, TOKEN: ${token.token}`);
            const payload = {};
            payload[Platform.OS] = token.token || token;
            when(() => socket.authenticated, () =>
                 socket.send('/auth/registerMobileDevice', payload)
                     .then(r => console.log('push.js: register result success', r))
                     .catch(e => console.error('push.js: error registering', e)));
        },

        onNotification(notification) {
            console.log('push.js: NOTIFICATION:', notification);
        },

        // GCM sender id
        senderID: '605156423279',

        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        popInitialNotification: true,
        requestPermissions: true
    });
}

module.exports = { enablePushNotifications };

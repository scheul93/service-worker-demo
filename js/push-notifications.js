const pushNotifications = () => {
	'use strict';

	const notifyButton = document.querySelector('.js-notify-btn');

	function init() {
		initSW();
		initNotification();
		notifyButton.addEventListener('click', () => {
			displayNotification();
		});
	}

	function displayNotification() {

		//display a Notification
		if (Notification.permission === 'granted') {
			navigator.serviceWorker.getRegistration().then(reg => {
				const options = {
					body: 'First notification!',
					icon: 'images/notification-flat.png',
					vibrate: [100, 50, 100],
					data: {
						dateOfArrival: Date.now(),
						primaryKey: 1
					},
					actions: [{
							action: 'explore',
							title: 'Go to the site',
							icon: 'images/checkmark.png'
						},
						{
							action: 'close',
							title: 'Close the notification',
							icon: 'images/xmark.png'
						},
					]
				};
				reg.showNotification('Hello world!', options);
			})
		}

	}

	function initNotification() {
		// check for notification support
		if (!('Notification' in window)) {
			console.log('This browser does not support notifications!');
			return;
		}

		//request permission to show notifications
		Notification.requestPermission(status => {
			console.log('Notification permission status:', status);
		});
	}
	

	function initSW() {
		if ('serviceWorker' in navigator) {
			console.log('Service Worker and Push is supported');
	
			navigator.serviceWorker.register('./sw_push_notifications.js')
				.then(swReg => {
					console.log('Service Worker is registered', swReg);
				})
				.catch(err => {
					console.error('Service Worker Error', err);
				});
		}
	}

	

	init();
};

pushNotifications();
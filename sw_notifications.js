//Handle the notificationclose event
self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
  
    console.log('Closed notification: ' + primaryKey);
  });

// Handle the notificationclick event
self.addEventListener('notificationclick', event => {
    console.log('Click!');
});

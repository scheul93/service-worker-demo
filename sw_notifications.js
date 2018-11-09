//Handle the notificationclose event
self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
  
    console.log('Closed notification: ' + primaryKey);
  });

// Handle the notificationclick event
self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;

    switch (action) {
        case 'explore': 
            clients.openWindow('index.html');
            break;
        case 'google': 
            clients.openWindow('https://google.com');
            break;
        default:
            break;
    }
    notification.close();
});

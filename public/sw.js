// Service Worker para manejar notificaciones push de NexoAgent

/**
 * Determina las opciones visuales según el tipo de notificación
 */
function getNotificationOptions(data) {
  const type = data.type || 'mensaje'; // mensaje | modo-humano | cita

  let icon = '/logo.png';
  let badge = '/logo.png';
  let vibrate = [200, 100, 200];
  let silent = false;
  let sound = null;

  // Configurar según el tipo
  switch (type) {
    case 'modo-humano':
      // ROJO - Alta prioridad
      badge = '/badge-urgent.png';
      vibrate = [300, 100, 300, 100, 300]; // Vibración más intensa
      sound = '/sounds/urgent.mp3';
      break;

    case 'mensaje':
      // AZUL - Prioridad normal
      badge = '/badge-message.png';
      vibrate = [200, 100, 200];
      sound = '/sounds/message.mp3';
      break;

    case 'cita':
      // VERDE - Prioridad baja
      badge = '/badge-calendar.png';
      vibrate = [150, 100, 150];
      sound = '/sounds/calendar.mp3';
      break;
  }

  // Opciones base
  const options = {
    body: data.body,
    icon: icon,
    badge: badge,
    vibrate: vibrate,
    silent: silent,
    data: {
      url: data.url || '/',
      empresaId: data.empresaId,
      conversacionId: data.conversacionId,
      type: type,
      sound: sound,
      timestamp: Date.now(),
    },
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag || 'nexoagent-notification',
    renotify: data.renotify || false, // Re-notificar si se actualiza el tag
  };

  // Agregar timestamp para notificaciones
  if (data.timestamp) {
    options.timestamp = data.timestamp;
  }

  // Agregar imagen si existe
  if (data.image) {
    options.image = data.image;
  }

  return options;
}

/**
 * Reproducir sonido personalizado
 * Nota: Los navegadores tienen limitaciones con sonidos en notificaciones
 * Esta es una solución alternativa que funciona en algunos navegadores
 */
async function playNotificationSound(sound) {
  if (!sound) return;

  try {
    // Intentar reproducir el sonido en todos los clientes activos
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

    clients.forEach(client => {
      client.postMessage({
        type: 'PLAY_SOUND',
        sound: sound,
      });
    });
  } catch (error) {
    console.error('Error reproduciendo sonido:', error);
  }
}

self.addEventListener('push', function(event) {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = getNotificationOptions(data);

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      playNotificationSound(options.data.sound),
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const action = event.action;
  const urlToOpen = event.notification.data.url || '/';

  // Manejar acciones específicas
  if (action === 'ignorar') {
    // Solo cerrar la notificación
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Si ya hay una ventana abierta con la URL, enfócala
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(urlToOpen, self.location.origin);

        if (clientUrl.pathname === targetUrl.pathname && 'focus' in client) {
          return client.focus();
        }
      }

      // Si hay alguna ventana abierta de la app, navegar ahí
      if (clientList.length > 0 && clientList[0].navigate) {
        return clientList[0].navigate(urlToOpen).then(client => client.focus());
      }

      // Si no, abrir una nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Manejo de cierre de notificaciones
self.addEventListener('notificationclose', function(event) {
  console.log('Notificación cerrada:', event.notification.tag, 'Tipo:', event.notification.data?.type);

  // Aquí podrías enviar analytics sobre notificaciones cerradas
});

// Manejo de mensajes del cliente (para reproducir sonidos)
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

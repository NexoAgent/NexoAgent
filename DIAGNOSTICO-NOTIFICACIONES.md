# Diagnóstico: Problemas con Notificaciones Push y Modo Humano

## 🔴 Problemas Reportados

1. **No aparecen notificaciones push** (aunque están habilitadas)
2. **No pasa a modo humano** cuando el cliente pide hablar con un humano
3. **No hay notificación** cuando se activa el modo humano

## ✅ Estado de la Configuración

### Variables de Entorno en Vercel
- ✅ `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - Configurada
- ✅ `VAPID_PRIVATE_KEY` - Configurada  
- ✅ `VAPID_SUBJECT` - Configurada

### Código de Detección de Modo Humano
El webhook (`app/api/webhook/route.ts`) tiene las siguientes frases configuradas:

```typescript
const FRASES_HUMANO = [
  "quiero hablar con una persona",
  "quiero hablar con un humano",
  "quiero hablar con un agente",
  "hablar con alguien",
  "atención humana",
  "operador",
  "agente humano",
  "persona real",
];
```

### Flujo Actual
1. Mensaje llega al webhook (`POST /api/webhook`)
2. Se verifica si el mensaje contiene frases de modo humano
3. Si detecta la frase → activa `modoHumano: true`
4. Intenta enviar notificación con `notificarModoHumano()`
5. La función `notificarModoHumano()` busca suscripciones y envía notificación push

## 🔍 Posibles Causas

### 1. Service Worker no registrado
- El Service Worker (`/sw.js`) debe estar registrado para recibir notificaciones
- Verificar en DevTools → Application → Service Workers

### 2. Sin suscripciones activas en la base de datos
- Aunque el botón diga "activadas", puede que no se haya guardado en la BD
- Verificar tabla `PushSubscription` en la base de datos

### 3. Detección case-sensitive o con mayúsculas
- El código usa `.toLowerCase()` pero puede fallar con acentos o variaciones
- Ejemplo: "Quiero hablar con un HUMANO" → debería funcionar
- Ejemplo: "necesito un operador" → no funciona (falta en la lista)

### 4. Errores silenciosos en el webhook
- Los errores están en try-catch con `console.error`
- No se muestran al usuario, solo en logs del servidor

## 🛠️ Soluciones Propuestas

### Solución 1: Mejorar detección de modo humano
Agregar más variaciones de frases:

```typescript
const FRASES_HUMANO = [
  "quiero hablar con una persona",
  "quiero hablar con un humano",
  "quiero hablar con un agente",
  "hablar con alguien",
  "hablar con una persona",
  "atención humana",
  "operador",
  "agente humano",
  "persona real",
  "necesito ayuda humana",
  "necesito un humano",
  "necesito un operador",
  "necesito un agente",
  "asesor humano",
  "representante",
  "soporte humano",
];
```

### Solución 2: Agregar logs detallados
Modificar el webhook para registrar cada intento de detección:

```typescript
console.log(`📝 Analizando mensaje: "${body}"`);
const activaModoHumano = solicitaHumano(body);
console.log(`🎯 ¿Activa modo humano? ${activaModoHumano}`);
```

### Solución 3: Verificar suscripciones en tiempo real
Agregar endpoint para diagnosticar:

```typescript
// GET /api/push/check?empresaId=xxx
export async function GET(request: NextRequest) {
  const empresaId = request.nextUrl.searchParams.get("empresaId");
  const subs = await prisma.pushSubscription.findMany({
    where: { empresaId }
  });
  return NextResponse.json({ 
    subscriptions: subs.length,
    details: subs 
  });
}
```

### Solución 4: Notificación de prueba
Agregar botón "Probar notificación" que envíe una notificación de prueba
inmediatamente al hacer clic.

## 📋 Pasos para Verificar

### En el Cliente (Navegador)
1. Abrir DevTools → Console
2. Ejecutar: `navigator.serviceWorker.getRegistration().then(r => console.log(r))`
3. Debe mostrar el Service Worker registrado en `/sw.js`
4. Ejecutar: `Notification.permission` → debe ser `"granted"`

### En el Servidor (Vercel)
1. Ir a Vercel Dashboard → Logs
2. Filtrar por función: `api/webhook`
3. Buscar logs con los mensajes del cliente
4. Verificar si aparece: "📨 Mensaje de..."

### En la Base de Datos
```sql
-- Verificar suscripciones
SELECT * FROM "PushSubscription";

-- Verificar conversaciones en modo humano
SELECT * FROM "Conversacion" WHERE "modoHumano" = true;

-- Verificar últimos mensajes
SELECT * FROM "Mensaje" ORDER BY "creadoEn" DESC LIMIT 10;
```

## 🚀 Implementación Inmediata

Voy a crear:
1. ✅ Script de diagnóstico detallado
2. ⏳ Mejoras en la detección de frases
3. ⏳ Endpoint de prueba de notificaciones
4. ⏳ Logs más detallados en el webhook
5. ⏳ Panel de debug para notificaciones

## 📞 Prueba Manual

Para probar el modo humano, envía un mensaje por WhatsApp con:
- "quiero hablar con un humano"
- "necesito un agente"
- "operador por favor"

Deberías ver:
1. Respuesta automática: "Entendido, en breve un agente humano te atenderá..."
2. Notificación push en el navegador
3. La conversación marcada con "🚨 Atención humana" en el dashboard


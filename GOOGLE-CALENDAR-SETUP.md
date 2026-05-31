# 📅 Configuración de Google Calendar para NexoAgent

Esta guía te ayudará a configurar la integración con Google Calendar para sincronizar automáticamente las citas.

---

## 🔑 Paso 1: Crear credenciales en Google Cloud

### 1.1 Crear proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Click en el selector de proyectos (arriba a la izquierda)
3. Click en **"NEW PROJECT"**
4. Nombre del proyecto: `NexoAgent` (o el que prefieras)
5. Click en **"CREATE"**

### 1.2 Habilitar Google Calendar API

1. En el menú lateral, ve a **"APIs & Services" > "Library"**
2. Busca **"Google Calendar API"**
3. Click en el resultado
4. Click en **"ENABLE"**

### 1.3 Configurar pantalla de consentimiento OAuth

1. Ve a **"APIs & Services" > "OAuth consent screen"**
2. Selecciona **"External"** (a menos que tengas Google Workspace)
3. Click en **"CREATE"**
4. Llena el formulario:
   - **App name**: NexoAgent
   - **User support email**: tu email
   - **Developer contact information**: tu email
5. Click en **"SAVE AND CONTINUE"**
6. En **"Scopes"**, click en **"ADD OR REMOVE SCOPES"**
7. Busca y selecciona:
   - `https://www.googleapis.com/auth/calendar` (Ver, editar, compartir y eliminar permanentemente todos los calendarios...)
8. Click en **"UPDATE"** y luego **"SAVE AND CONTINUE"**
9. En **"Test users"**, agrega tu email de Google
10. Click en **"SAVE AND CONTINUE"**

### 1.4 Crear credenciales OAuth 2.0

1. Ve a **"APIs & Services" > "Credentials"**
2. Click en **"+ CREATE CREDENTIALS"**
3. Selecciona **"OAuth client ID"**
4. Application type: **"Web application"**
5. Name: `NexoAgent Web Client`
6. **Authorized redirect URIs**, agrega:
   - Para local: `http://localhost:3000/api/google-calendar/callback`
   - Para producción: `https://tu-dominio.com/api/google-calendar/callback`
7. Click en **"CREATE"**
8. Aparecerá un modal con **Client ID** y **Client secret**
9. **Copia ambos valores** (los necesitarás en el siguiente paso)

---

## ⚙️ Paso 2: Configurar variables de entorno

### 2.1 Desarrollo local

Agrega estas líneas a tu archivo `.env.local`:

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar/callback
```

### 2.2 Producción (Render)

1. Ve a tu Web Service en Render
2. Click en **"Environment"** (menú lateral)
3. Agrega las siguientes variables:

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
GOOGLE_REDIRECT_URI=https://nexoagent.onrender.com/api/google-calendar/callback
```

4. Click en **"Save Changes"**
5. Render hará redeploy automáticamente

---

## 🔗 Paso 3: Conectar Google Calendar en la app

### 3.1 En desarrollo local

1. Inicia tu app: `npm run dev`
2. Ve a: `http://localhost:3000/empresa/[id]/agenda`
3. En la sección "Integración Google Calendar", click en **"Conectar con Google"**
4. Autoriza la aplicación en la pantalla de Google
5. Serás redirigido de vuelta y verás "Conectado a Google Calendar" ✅

### 3.2 En producción

1. Ve a: `https://tu-dominio.com/empresa/[id]/agenda`
2. Click en **"Conectar con Google"**
3. Autoriza la aplicación
4. ¡Listo! Las citas se sincronizarán automáticamente

---

## ✅ Paso 4: Verificar que funciona

### Crear una cita de prueba

1. En el módulo Agenda, llena el formulario:
   - **Nombre**: Cliente de Prueba
   - **Teléfono**: 5215512345678
   - **Fecha/hora**: Mañana a las 10:00 AM
   - **Duración**: 60 min
2. Click en **"Crear cita"**
3. Deberías ver:
   - La cita en "Próximas citas"
   - Un enlace "📅 Ver en Google Calendar"
4. Abre tu **Google Calendar** en otra pestaña
5. ¡Deberías ver la cita sincronizada! 🎉

### Pruebas adicionales

- ✅ Confirmar cita → Actualiza en Google Calendar
- ✅ Cancelar cita → Marca como cancelada en Google Calendar
- ✅ Eliminar cita → Se elimina de Google Calendar

---

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa**: La URL de redirección no coincide con la configurada en Google Cloud.

**Solución**:
1. Ve a Google Cloud Console > Credentials
2. Edita tu OAuth client ID
3. Asegúrate de que la **Authorized redirect URI** sea exactamente:
   - Local: `http://localhost:3000/api/google-calendar/callback`
   - Producción: `https://tu-dominio.com/api/google-calendar/callback`

### Error: "Access blocked: This app's request is invalid"

**Causa**: La aplicación no está en modo de prueba o no agregaste tu email como test user.

**Solución**:
1. Ve a Google Cloud Console > OAuth consent screen
2. En "Publishing status", debe decir "Testing"
3. En "Test users", agrega tu email de Google

### Las citas no aparecen en Google Calendar

**Verifica**:
1. Que la integración esté conectada (debe decir "Conectado" en verde)
2. Que las variables de entorno estén configuradas correctamente
3. Revisa los logs de la app para errores

### Token expirado

Los tokens de Google expiran. Si ves errores relacionados:

1. Desconecta Google Calendar en la app
2. Vuelve a conectar
3. Esto generará un nuevo token

---

## 🔒 Seguridad

### Buenas prácticas

- ✅ Nunca compartas tu `GOOGLE_CLIENT_SECRET` públicamente
- ✅ Usa variables de entorno, no hardcodees las credenciales
- ✅ En producción, considera publicar la app (salir de modo "Testing")
- ✅ Revisa periódicamente los permisos otorgados en: https://myaccount.google.com/permissions

### Límites de la API

- **Cuota diaria**: 1,000,000 requests/día (más que suficiente)
- **Rate limit**: 10,000 requests/100 segundos/usuario

---

## 📚 Referencias

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [googleapis npm package](https://www.npmjs.com/package/googleapis)

---

**¡Tu integración con Google Calendar está lista!** 📅✨

Cualquier duda, revisa los logs de la aplicación o contacta a: perofaga@gmail.com

# ✅ Checklist de Configuración Completada

## Google Cloud Console

- [x] Proyecto "NexoAgent" creado
- [x] Google Calendar API habilitada
- [x] OAuth Consent Screen configurado
  - [x] Tipo: External
  - [x] App name: NexoAgent
  - [x] User support email: perofaga@gmail.com
- [x] Scope agregado: `https://www.googleapis.com/auth/calendar`
- [x] Test user agregado: perofaga@gmail.com
- [x] OAuth Client ID creado
  - [x] Type: Web application
  - [x] Name: NexoAgent Web Client
  - [x] Redirect URIs:
    - [x] http://localhost:3000/api/google-calendar/callback
    - [x] https://nexoagent.onrender.com/api/google-calendar/callback

## Credenciales Copiadas

- [x] Client ID guardado
- [x] Client Secret guardado

## Render Configuration

- [x] Variable: GOOGLE_CLIENT_ID agregada
- [x] Variable: GOOGLE_CLIENT_SECRET agregada
- [x] Variable: GOOGLE_REDIRECT_URI agregada
- [x] Cambios guardados
- [ ] Deploy completado (esperando ~5 min)

## Próximos Pasos

1. Esperar deploy de Render
2. Ir a: https://nexoagent.onrender.com/dashboard/empresas
3. Entrar a una empresa > Agenda
4. Click en "Conectar con Google"
5. Autorizar (ignorar warning "app not verified")
6. Crear cita de prueba
7. Verificar en Google Calendar

## Para tus Clientes

Cada cliente que quiera usar Google Calendar deberá:
1. Ir a su Agenda en el dashboard
2. Click en "Conectar con Google"
3. Autorizar con SU cuenta de Google
4. ¡Listo! Sus citas se sincronizarán automáticamente

## Notas Importantes

- La app está en modo "Testing" (máximo 100 usuarios)
- Solo los test users agregados pueden conectar
- Para agregar más test users:
  - Ve a: https://console.cloud.google.com/apis/credentials/consent
  - Click en tu app
  - En "Test users" click "+ ADD USERS"
  - Agrega el email del cliente
  - Click "SAVE"

## Publicar la App (Opcional - Futuro)

Para que CUALQUIER persona pueda conectar sin agregar su email:
1. Ve a OAuth consent screen
2. Click en "PUBLISH APP"
3. Enviar para verificación de Google (toma 1-2 semanas)

Por ahora, con modo Testing es suficiente.

---

**Configuración completada por:** Luis Daniel Fajardo Moreno (perofaga@gmail.com)
**Fecha:** 31 de Mayo, 2026
**Asistido por:** Claude Sonnet 4.5

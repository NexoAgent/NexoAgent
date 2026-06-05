# 🧪 CHECKLIST DE TESTING PRE-LANZAMIENTO

**Fecha:** 2026-06-05  
**Versión:** 1.0.0  
**Status:** ⏳ Pendiente de ejecutar

---

## ⚠️ IMPORTANTE

Este testing debe ejecutarse **DESPUÉS** de que el deploy se complete en Vercel.

**Status actual del deploy:**
- ✅ Código pushed a GitHub (commit `e7790d7`)
- ⏳ Esperando límite de deploys (100/día alcanzado)
- 🔄 Deploy automático cuando se resetee límite

**Opciones para deployar:**
1. Esperar ~24h para reset automático
2. Deploy manual desde Vercel Dashboard
3. Upgrade a Vercel Pro ($20/mes)

---

## 🔐 TESTING DE SEGURIDAD (CRÍTICO)

### 1. Validación de Permisos en Tickets

#### Test 1.1: Usuario CLIENTE solo ve sus tickets
- [ ] Login como CLIENTE (empresa A)
- [ ] Ir a `/empresa/[id]/soporte`
- [ ] Crear un ticket
- [ ] Copiar el ID del ticket
- [ ] Verificar que puedes abrirlo
- [ ] **CRÍTICO:** Logout y login como CLIENTE de empresa B
- [ ] Intentar acceder a `/empresa/[empresa-A-id]/soporte/[ticket-id]`
- [ ] **ESPERADO:** Error "No tienes permisos" y redirect

#### Test 1.2: Usuario PROVEEDOR ve todos los tickets
- [ ] Login como PROVEEDOR
- [ ] Ir a `/dashboard/tickets`
- [ ] Verificar que ves tickets de TODAS las empresas
- [ ] Abrir un ticket de cualquier empresa
- [ ] **ESPERADO:** Acceso exitoso
- [ ] Responder al ticket
- [ ] **ESPERADO:** Mensaje enviado correctamente

#### Test 1.3: Tickets de la misma empresa
- [ ] Crear empresa con 2 usuarios (requiere ejecutar migración multi-usuario)
- [ ] Login como usuario 1
- [ ] Crear ticket
- [ ] Login como usuario 2 (misma empresa)
- [ ] **ESPERADO:** Puede ver el ticket (mismo empresaId)

**Comando para verificar logs:**
```bash
# En servidor o Vercel logs
grep "[obtenerTicket]" logs.txt
# Buscar: "Usuario sin permisos" cuando se bloquea acceso
```

---

### 2. Validación de Webhook Token

#### Test 2.1: Webhook sin token configurado
- [ ] En Vercel, remover temporalmente `WHATSAPP_VERIFY_TOKEN`
- [ ] Hacer GET request: `https://tu-app.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=test&hub.challenge=test123`
- [ ] **ESPERADO:** Status 500 + "Configuración incompleta"
- [ ] **Restaurar** la variable inmediatamente

#### Test 2.2: Webhook con token correcto
- [ ] Asegurar que `WHATSAPP_VERIFY_TOKEN` está configurado
- [ ] GET: `https://tu-app.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=[TU_TOKEN]&hub.challenge=test123`
- [ ] **ESPERADO:** Status 200 + Response body = "test123"

#### Test 2.3: Webhook con token incorrecto
- [ ] GET: `https://tu-app.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=WRONG_TOKEN&hub.challenge=test123`
- [ ] **ESPERADO:** Status 403 + "Verificación fallida"

---

### 3. SQL Injection (Preventivo)

#### Test 3.1: Intentar inyección en búsqueda
- [ ] Login a la app
- [ ] En cualquier campo de búsqueda, ingresar: `'; DROP TABLE "Usuario"; --`
- [ ] **ESPERADO:** Error de validación o búsqueda sin resultados (NO error de SQL)

#### Test 3.2: Inyección en campos de formulario
- [ ] Formulario de crear empresa
- [ ] Nombre: `'; SELECT * FROM "Usuario"; --`
- [ ] **ESPERADO:** Se guarda como texto literal (Prisma protege automáticamente)

---

### 4. XSS (Cross-Site Scripting)

#### Test 4.1: Intentar XSS en nombre de empresa
- [ ] Crear empresa con nombre: `<script>alert('XSS')</script>`
- [ ] Ver el dashboard
- [ ] **ESPERADO:** Texto se escapa, no ejecuta JavaScript

#### Test 4.2: XSS en mensajes de conversación
- [ ] En conversación de WhatsApp, enviar: `<img src=x onerror=alert('XSS')>`
- [ ] Ver la conversación en el dashboard
- [ ] **ESPERADO:** Se muestra como texto, no ejecuta

---

### 5. Autenticación y Sesiones

#### Test 5.1: Acceso sin login
- [ ] Abrir navegador en modo incógnito
- [ ] Intentar acceder a: `/dashboard`
- [ ] **ESPERADO:** Redirect a `/login`
- [ ] Intentar: `/empresa/[id]/conversaciones`
- [ ] **ESPERADO:** Redirect a `/login`
- [ ] Intentar: `/api/empresa/[id]/documentos`
- [ ] **ESPERADO:** 401 o redirect

#### Test 5.2: Sesión expira después de 30 días
- [ ] Login normalmente
- [ ] En DevTools → Application → Cookies
- [ ] Verificar que `next-auth.session-token` tiene Max-Age = 2592000 (30 días)

#### Test 5.3: CLIENTE no accede a admin
- [ ] Login como CLIENTE
- [ ] Intentar acceder a `/admin`
- [ ] **ESPERADO:** Redirect a `/dashboard`

---

## 🚀 TESTING FUNCIONAL

### 6. Flujo Completo de Empresa

#### Test 6.1: Registro de empresa
- [ ] Ir a `/admin/empresas/nueva` (como PROVEEDOR)
- [ ] Crear empresa con:
  - Nombre único
  - RIF único
  - WhatsApp único
  - Usuario principal
- [ ] **ESPERADO:** Empresa creada exitosamente
- [ ] Verificar en `/admin` que aparece

#### Test 6.2: Validación de duplicados
- [ ] Intentar crear otra empresa con el **mismo RIF**
- [ ] **ESPERADO:** Error "Ya existe una empresa con ese RIF"
- [ ] Intentar con mismo **WhatsApp**
- [ ] **ESPERADO:** Error "Ya existe una empresa con ese WhatsApp"

---

### 7. Sistema de Tickets

#### Test 7.1: Crear ticket como cliente
- [ ] Login como CLIENTE
- [ ] Ir a `/empresa/[id]/soporte/nuevo`
- [ ] Crear ticket con:
  - Título
  - Descripción
  - Categoría
  - Prioridad
- [ ] **ESPERADO:** Ticket creado, redirect a `/empresa/[id]/soporte/[ticketId]`

#### Test 7.2: PROVEEDOR responde ticket
- [ ] Login como PROVEEDOR
- [ ] Ir a `/dashboard/tickets`
- [ ] Abrir el ticket creado
- [ ] Responder mensaje
- [ ] Cambiar estado a "EN_PROGRESO"
- [ ] **ESPERADO:** Mensaje visible para cliente

#### Test 7.3: Mensajes internos (solo PROVEEDOR)
- [ ] Como PROVEEDOR en ticket
- [ ] Agregar mensaje con checkbox "Nota interna"
- [ ] **ESPERADO:** Mensaje guardado
- [ ] Login como CLIENTE
- [ ] Abrir mismo ticket
- [ ] **ESPERADO:** Mensaje interno NO visible

---

### 8. Conversaciones WhatsApp

#### Test 8.1: Recibir mensaje
- [ ] Enviar mensaje desde WhatsApp real al número configurado
- [ ] Verificar en `/dashboard/conversaciones`
- [ ] **ESPERADO:** Conversación aparece
- [ ] Abrir conversación
- [ ] **ESPERADO:** Mensaje visible

#### Test 8.2: Responder conversación
- [ ] En la conversación, escribir respuesta
- [ ] Enviar
- [ ] **ESPERADO:** Mensaje enviado al WhatsApp del contacto

---

### 9. Agentes IA

#### Test 9.1: Crear agente
- [ ] Login como empresa
- [ ] Ir a `/empresa/[id]/agentes/nuevo`
- [ ] Crear agente con:
  - Nombre
  - Prompt personalizado
  - Keywords
- [ ] Activar agente
- [ ] **ESPERADO:** Agente creado

#### Test 9.2: Ruteo automático por keywords
- [ ] Configurar agente con keyword "ventas"
- [ ] Enviar mensaje WhatsApp: "Hola, quiero info de ventas"
- [ ] Verificar en dashboard
- [ ] **ESPERADO:** Conversación asignada al agente de ventas

---

### 10. Gestión de Documentos

#### Test 10.1: Subir documento
- [ ] Ir a `/empresa/[id]/conocimiento`
- [ ] Subir PDF (máx 10MB)
- [ ] **ESPERADO:** Documento chunkeado y guardado
- [ ] Ver la lista
- [ ] **ESPERADO:** Documento aparece

#### Test 10.2: Búsqueda semántica
- [ ] Subir documento con contenido conocido
- [ ] En conversación WhatsApp, preguntar sobre ese contenido
- [ ] **ESPERADO:** IA responde usando info del documento

---

### 11. Sistema de Planes

#### Test 11.1: Límite de conversaciones (Trial)
- [ ] Empresa en plan Trial (100 conversaciones/mes)
- [ ] Simular 100 conversaciones (script o manual)
- [ ] Intentar conversación 101
- [ ] **ESPERADO:** Bloqueo + mensaje "Límite alcanzado"

#### Test 11.2: Upgrade de plan
- [ ] Como PROVEEDOR en `/admin/empresas/[id]/plan`
- [ ] Cambiar plan de Trial a Básico
- [ ] **ESPERADO:** Límites actualizados
- [ ] Verificar que cliente ahora puede crear más conversaciones

---

## ⚡ TESTING DE PERFORMANCE

### 12. Carga y Velocidad

#### Test 12.1: Tiempo de carga inicial
- [ ] Abrir DevTools → Network
- [ ] Ir a `/dashboard`
- [ ] **ESPERADO:** < 2 segundos para First Contentful Paint

#### Test 12.2: Queries grandes
- [ ] Crear 100+ conversaciones
- [ ] Abrir `/dashboard/conversaciones`
- [ ] **ESPERADO:** Carga < 3 segundos
- [ ] **NOTA:** Si lento, implementar paginación

#### Test 12.3: Múltiples usuarios concurrentes
- [ ] Abrir 5 pestañas con usuarios diferentes
- [ ] Interactuar simultáneamente
- [ ] **ESPERADO:** Sin errores, respuesta fluida

---

## 📱 TESTING DE UX

### 13. Experiencia de Usuario

#### Test 13.1: Loading states
- [ ] Enviar formulario largo
- [ ] **ESPERADO:** Botón disabled + spinner
- [ ] No poder hacer doble-submit

#### Test 13.2: Mensajes de error claros
- [ ] Provocar error (campo vacío, etc.)
- [ ] **ESPERADO:** Mensaje específico, NO "Algo salió mal"

#### Test 13.3: Responsive design
- [ ] Abrir en móvil (375px)
- [ ] **ESPERADO:** Todo legible y funcional
- [ ] Probar en tablet (768px)
- [ ] **ESPERADO:** Layout adaptado

---

## 🔄 TESTING DE INTEGRACIÓN

### 14. Google Calendar

#### Test 14.1: Conectar calendario
- [ ] Ir a `/empresa/[id]/configuracion`
- [ ] Conectar Google Calendar
- [ ] **ESPERADO:** OAuth exitoso

#### Test 14.2: Crear cita desde WhatsApp
- [ ] Enviar: "Quiero agendar para mañana 3pm"
- [ ] **ESPERADO:** IA sugiere horarios disponibles
- [ ] Confirmar
- [ ] **ESPERADO:** Evento creado en Google Calendar

---

### 15. Notificaciones Push

#### Test 15.1: Suscribirse a notificaciones
- [ ] Login en navegador desktop
- [ ] Permitir notificaciones
- [ ] **ESPERADO:** Suscripción guardada en DB

#### Test 15.2: Recibir notificación
- [ ] Tener app abierta en una pestaña
- [ ] Desde otro usuario, enviar mensaje a tu empresa
- [ ] **ESPERADO:** Notificación push aparece

---

## 📊 RESULTADOS

### Resumen de Testing

| Categoría | Tests | Pasados | Fallidos | Status |
|-----------|-------|---------|----------|--------|
| Seguridad | 13 | - | - | ⏳ Pendiente |
| Funcional | 15 | - | - | ⏳ Pendiente |
| Performance | 3 | - | - | ⏳ Pendiente |
| UX | 3 | - | - | ⏳ Pendiente |
| Integración | 4 | - | - | ⏳ Pendiente |
| **TOTAL** | **38** | **-** | **-** | ⏳ Pendiente |

### Criterio de Aprobación

- ✅ **Listo para Beta:** 35/38 pasando (92%)
- ✅ **Listo para Producción:** 38/38 pasando (100%)

---

## 🐛 BUGS ENCONTRADOS

_Completar durante el testing_

### Bug #1
- **Descripción:**
- **Severidad:** 🔴 / 🟡 / 🟢
- **Pasos para reproducir:**
- **Solución propuesta:**

---

## ✅ APROBACIÓN FINAL

- [ ] Todos los tests críticos (seguridad) pasando
- [ ] Al menos 90% de tests funcionales pasando
- [ ] Performance aceptable (<3s carga)
- [ ] UX sin blockers mayores
- [ ] Bugs críticos resueltos

**Aprobado por:** _________________  
**Fecha:** _________________

---

**🚀 PRÓXIMOS PASOS DESPUÉS DE APROBAR:**

1. Deploy a producción
2. Monitoring activo por 48h
3. Beta con 5-10 clientes
4. Recopilar feedback
5. Iterar y mejorar

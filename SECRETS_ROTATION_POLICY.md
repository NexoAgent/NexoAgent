# 🔐 POLÍTICA DE ROTACIÓN DE SECRETS

**Versión:** 1.0  
**Última actualización:** 2026-06-05  
**Próxima revisión:** 2026-09-05  

---

## 📋 RESUMEN

Esta política define cómo y cuándo rotar secrets críticos del sistema NexoAgent para mantener la seguridad y cumplir con best practices.

**Objetivo:** Minimizar el impacto de secrets comprometidos mediante rotación regular.

---

## 🔑 SECRETS CRÍTICOS

### 1. AUTH_SECRET (NextAuth.js)
**Uso:** Firma de JWT tokens de sesión  
**Impacto si se compromete:** Alguien podría crear tokens falsos y suplantar usuarios  
**Frecuencia de rotación:** Cada 90 días  
**Rotación de emergencia:** Inmediata si se detecta compromiso

#### Proceso de Rotación:

```bash
# 1. Generar nuevo secret
openssl rand -base64 32
# Ejemplo output: kR3mP9xK2wN8vL5jQ7tY1hF4gS6dA0pM

# 2. Actualizar en Vercel
vercel env rm AUTH_SECRET production
vercel env add AUTH_SECRET production
# Pegar el nuevo valor

# 3. Redeploy
vercel deploy --prod

# 4. Notas importantes:
# - Las sesiones antiguas seguirán siendo válidas por 30 días (maxAge)
# - No hay downtime durante la rotación
# - Los usuarios no necesitan volver a hacer login inmediatamente
```

**Impacto en usuarios:**
- ✅ Sin downtime
- ⚠️ Sesiones creadas con el secret antiguo expirarán en 30 días
- ✅ Nuevas sesiones usan el nuevo secret

---

### 2. ANTHROPIC_API_KEY
**Uso:** Acceso a Claude API  
**Impacto si se compromete:** Uso no autorizado de tu cuenta ($$$ costos)  
**Frecuencia de rotación:** Cada 180 días  
**Rotación de emergencia:** Inmediata si se detecta uso anómalo

#### Proceso de Rotación:

```bash
# 1. Generar nueva key en Anthropic
# Ir a: https://console.anthropic.com/settings/keys
# Click: "Create Key"
# Guardar: sk-ant-api03-...

# 2. Actualizar en Vercel
vercel env rm ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY production
# Pegar la nueva key

# 3. Redeploy
vercel deploy --prod

# 4. Revocar key antigua
# En console.anthropic.com → Delete old key
# IMPORTANTE: Esperar 5 minutos después del deploy
```

**Impacto en usuarios:**
- ✅ Sin downtime si se hace correctamente
- ⚠️ 30-60 segundos de posibles errores durante el deploy

---

### 3. DATABASE_URL
**Uso:** Conexión a PostgreSQL (Neon)  
**Impacto si se compromete:** Acceso completo a todos los datos  
**Frecuencia de rotación:** Solo si se compromete  
**Rotación de emergencia:** Inmediata

#### Proceso de Rotación (CRÍTICO):

```bash
# ⚠️ PROCESO COMPLEJO - REQUIERE DOWNTIME BREVE

# 1. Crear nuevo usuario en Neon
# Dashboard → Databases → Connection Details → Create Role
# Nombre: nexoagent_prod_v2
# Password: (generado automático)

# 2. Copiar permisos del usuario antiguo
# SQL Editor:
GRANT ALL PRIVILEGES ON DATABASE nexoagent 
  TO nexoagent_prod_v2;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public 
  TO nexoagent_prod_v2;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public 
  TO nexoagent_prod_v2;

# 3. Construir nueva URL
# postgresql://nexoagent_prod_v2:[PASSWORD]@[HOST]:5432/nexoagent

# 4. Actualizar en Vercel (DOWNTIME EMPIEZA)
vercel env rm DATABASE_URL production
vercel env rm DIRECT_URL production

vercel env add DATABASE_URL production
# Pegar nueva URL con pooling

vercel env add DIRECT_URL production
# Pegar nueva URL directa

# 5. Redeploy
vercel deploy --prod

# 6. Verificar que funciona
curl https://nexoagent-sage.vercel.app/api/health

# 7. Revocar usuario antiguo
# Dashboard → Delete Role: nexoagent_prod_v1
```

**Downtime esperado:** 2-5 minutos  
**Notificar usuarios:** Sí (mantenimiento programado)

---

### 4. WHATSAPP_TOKEN & WHATSAPP_VERIFY_TOKEN
**Uso:** Integración con Meta WhatsApp Business API  
**Impacto si se compromete:** Alguien podría enviar mensajes desde tu número  
**Frecuencia de rotación:** Cada 180 días  
**Rotación de emergencia:** Inmediata

#### Proceso de Rotación:

```bash
# 1. Regenerar token en Meta Business
# Ir a: https://developers.facebook.com/apps/
# Tu App → WhatsApp → Configuration
# Click: "Regenerate Token"

# 2. Actualizar WHATSAPP_TOKEN
vercel env rm WHATSAPP_TOKEN production
vercel env add WHATSAPP_TOKEN production

# 3. Actualizar WHATSAPP_VERIFY_TOKEN (opcional)
# Solo si quieres cambiar el token de verificación
vercel env rm WHATSAPP_VERIFY_TOKEN production
vercel env add WHATSAPP_VERIFY_TOKEN production

# 4. Redeploy
vercel deploy --prod
```

**Impacto en usuarios:**
- ⚠️ Mensajes de WhatsApp podrían fallar por ~1 minuto durante el deploy

---

### 5. GOOGLE_CLIENT_SECRET
**Uso:** OAuth con Google (login + Calendar)  
**Impacto si se compromete:** Alguien podría hacer login como tus usuarios  
**Frecuencia de rotación:** Cada 180 días  
**Rotación de emergencia:** Inmediata

#### Proceso de Rotación:

```bash
# 1. Regenerar secret en Google Cloud Console
# https://console.cloud.google.com/apis/credentials
# Tu OAuth Client → Reset Secret

# 2. Actualizar en Vercel
vercel env rm GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_CLIENT_SECRET production

# 3. Redeploy
vercel deploy --prod
```

**Impacto en usuarios:**
- ⚠️ Los usuarios que usan "Login con Google" podrían necesitar volver a autorizar
- ✅ Usuarios con email/password no se ven afectados

---

## 📅 CALENDARIO DE ROTACIÓN 2026

| Mes | Secrets a Rotar | Responsable |
|-----|----------------|-------------|
| **Junio** | AUTH_SECRET | Dev Team |
| **Julio** | - | - |
| **Agosto** | - | - |
| **Septiembre** | AUTH_SECRET, ANTHROPIC_API_KEY | Dev Team |
| **Octubre** | - | - |
| **Noviembre** | - | - |
| **Diciembre** | AUTH_SECRET, WHATSAPP_TOKEN, GOOGLE_CLIENT_SECRET | Dev Team |

### Recordatorios Automáticos:

```bash
# Agregar a calendario:
- 1 de cada mes: Revisar si hay rotación programada
- 15 días antes: Preparar nueva key
- 1 día antes: Notificar a usuarios (si aplica)
```

---

## 🚨 ROTACIÓN DE EMERGENCIA

### Indicadores de Compromiso:

1. **API Keys:**
   - Uso anómalo de Anthropic API (costos elevados)
   - Requests desde IPs desconocidas
   - Patterns de uso inusuales

2. **DATABASE_URL:**
   - Conexiones desde IPs no autorizadas
   - Queries sospechosas en logs
   - Alertas de Neon

3. **AUTH_SECRET:**
   - Tokens JWT con claims inválidos
   - Sesiones de usuarios no esperados
   - Múltiples logins desde diferentes IPs

### Proceso de Emergencia:

```bash
# 1. CONFIRMAR el compromiso (no pánico)
# Revisar logs, métricas, alertas

# 2. ROTAR inmediatamente el secret comprometido
# Seguir proceso de rotación específico

# 3. REVOCAR acceso antiguo
# Eliminar key/token/usuario anterior

# 4. AUDITAR impacto
# ¿Qué datos fueron accedidos?
# ¿Cuánto tiempo estuvo expuesto?
# ¿Hay que notificar a usuarios?

# 5. DOCUMENTAR incidente
# Qué pasó, cómo se resolvió, lecciones aprendidas

# 6. MEJORAR seguridad
# ¿Cómo prevenir que vuelva a pasar?
```

---

## 🔒 ALMACENAMIENTO SEGURO

### Dónde guardar secrets:

✅ **PERMITIDO:**
- Vercel Environment Variables (producción)
- `.env.local` (desarrollo, gitignored)
- Password managers (1Password, LastPass)
- Secrets managers (AWS Secrets Manager, HashiCorp Vault)

❌ **PROHIBIDO:**
- Código fuente (commits)
- Archivos no ignorados por git
- Slack, Discord, emails
- Screenshots, documentos compartidos
- Trello, Notion, Google Docs

---

## 📊 MÉTRICAS Y MONITOREO

### Alertas configuradas:

```yaml
# Anthropic API
- Alert: Costos > $100/día
  Action: Revisar uso, posible compromiso

# Database
- Alert: Conexiones > 50 simultáneas
  Action: Verificar IPs de origen

# Authentication
- Alert: >100 login failures/hora
  Action: Posible ataque de fuerza bruta

# WhatsApp
- Alert: >1000 mensajes/hora
  Action: Posible abuse
```

---

## ✅ CHECKLIST POST-ROTACIÓN

Después de rotar cualquier secret:

- [ ] Redeploy completado sin errores
- [ ] Health check: `curl /api/health` → 200 OK
- [ ] Funcionalidad verificada (login, API calls, etc.)
- [ ] Secret antiguo revocado/eliminado
- [ ] Documentado en log de rotaciones
- [ ] Calendario actualizado para próxima rotación

---

## 📝 LOG DE ROTACIONES

### Template:

```markdown
## Rotación: [SECRET_NAME]
**Fecha:** YYYY-MM-DD  
**Hora:** HH:MM UTC  
**Razón:** Programada / Emergencia / Compromiso detectado  
**Ejecutado por:** [Nombre]  
**Downtime:** X minutos  
**Issues:** Ninguno / [Descripción]  
**Notas:** [Detalles adicionales]
```

### Historial:

```markdown
## Rotación: AUTH_SECRET (Inicial)
**Fecha:** 2026-06-05  
**Hora:** 10:00 UTC  
**Razón:** Configuración inicial  
**Ejecutado por:** Setup Script  
**Downtime:** 0 minutos  
**Issues:** Ninguno  
**Notas:** Primera configuración del sistema
```

---

## 🎓 TRAINING

### Para nuevo miembro del equipo:

```bash
# 1. Leer esta política completa
# 2. Acceso a Vercel (solo admin)
# 3. Acceso a Neon Dashboard (solo admin)
# 4. Acceso a password manager del equipo
# 5. Práctica de rotación en staging
```

---

## 📞 CONTACTOS DE EMERGENCIA

| Rol | Responsabilidad | Contacto |
|-----|----------------|----------|
| **Admin Principal** | Rotación programada | - |
| **Backup Admin** | Rotación de emergencia | - |
| **Soporte Neon** | Problemas de DB | support@neon.tech |
| **Soporte Vercel** | Problemas de deploy | vercel.com/support |
| **Soporte Anthropic** | Problemas de API | support@anthropic.com |

---

## 🔄 REVISIÓN DE POLÍTICA

Esta política debe revisarse:
- Cada 3 meses (scheduled)
- Después de cada incidente de seguridad
- Cuando cambie la arquitectura del sistema
- Cuando se agreguen nuevos secrets

**Próxima revisión programada:** 2026-09-05

---

## 📚 REFERENCIAS

- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [NextAuth.js Secret Rotation](https://next-auth.js.org/configuration/options#secret)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

**Aprobado por:** [Pendiente]  
**Fecha de aprobación:** [Pendiente]  
**Próxima actualización:** 2026-09-05

# 🚀 Deployment en Render - Guía Paso a Paso

**Plataforma:** Render  
**Database:** PostgreSQL existente  
**Fecha:** 2 de junio, 2026

---

## 📋 Pre-requisitos

✅ Build exitoso localmente  
✅ DATABASE_URL de producción lista  
✅ Git repositorio (GitHub/GitLab)  
✅ Cuenta en Render (gratis)

---

## 🎯 Paso 1: Preparar Repositorio

```bash
# Verificar que todo está commiteado
git status

# Push a GitHub/GitLab si aún no lo has hecho
git remote -v
# Si no tienes remote, agrega uno:
# git remote add origin https://github.com/tu-usuario/nexoagent.git
# git push -u origin main
```

---

## 🌐 Paso 2: Crear Web Service en Render

1. Ve a https://render.com
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repo **nexoagent**

### Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | nexoagent |
| **Region** | Oregon (US West) |
| **Branch** | main |
| **Root Directory** | (dejar vacío) |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

---

## 🔐 Paso 3: Configurar Variables de Entorno

En la sección **"Environment"** de Render, agrega:

### Variables Requeridas:

```env
# Core
NODE_ENV=production
DATABASE_URL=postgresql://tu-connection-string-aqui

# Anthropic
ANTHROPIC_API_KEY=sk-ant-tu-key-aqui

# NextAuth (genera el secret con: openssl rand -base64 32)
NEXTAUTH_URL=https://nexoagent.onrender.com
NEXTAUTH_SECRET=tu-secret-generado-aqui

# WhatsApp
WHATSAPP_TOKEN=tu-token-aqui
WHATSAPP_VERIFY_TOKEN=nexoagent_token
WHATSAPP_PHONE_NUMBER_ID=tu-phone-id-aqui

# Push Notifications (genera con npm run generate-vapid)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu-public-key-aqui
VAPID_PRIVATE_KEY=tu-private-key-aqui
VAPID_SUBJECT=mailto:perofaga@gmail.com
```

### Variables Opcionales (Google Calendar):

```env
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=https://nexoagent.onrender.com/api/google-calendar/callback
```

---

## 🗄️ Paso 4: Ejecutar Migraciones de Database

**IMPORTANTE:** Ejecuta esto ANTES de hacer el primer deploy:

```bash
# Desde tu máquina local, con el DATABASE_URL de producción:
DATABASE_URL="postgresql://tu-production-url" npx prisma migrate deploy
```

Esto aplicará todas las migraciones a tu base de datos de producción.

---

## 🚀 Paso 5: Deploy!

1. Click en **"Create Web Service"**
2. Render automáticamente:
   - Clonará el repo
   - Instalará dependencias
   - Generará Prisma Client
   - Hará build de Next.js
   - Iniciará el servidor

**Tiempo estimado:** 3-5 minutos

---

## ✅ Paso 6: Verificación Post-Deploy

Una vez que el deploy esté **"Live"**:

### 1. Health Check
```bash
curl https://nexoagent.onrender.com/api/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "timestamp": "2026-06-02T..."
}
```

### 2. Probar la UI
Visita: https://nexoagent.onrender.com

### 3. Verificar WhatsApp Webhook
- Ve a tu configuración de WhatsApp Business
- Actualiza el webhook URL a: `https://nexoagent.onrender.com/api/webhook`

---

## 🎨 Paso 7: Configurar Dominio Personalizado (Opcional)

1. En Render Dashboard → Tu servicio → **"Settings"**
2. Sección **"Custom Domain"**
3. Agrega tu dominio (ej: nexoagent.com)
4. Actualiza DNS con los registros que Render te indica
5. Actualiza `NEXTAUTH_URL` a tu nuevo dominio

---

## 📊 Monitoreo

Render incluye:
- ✅ Logs en tiempo real
- ✅ Métricas de CPU/RAM
- ✅ Health checks automáticos
- ✅ Auto-deploy en cada push a main

### Ver Logs:
1. Dashboard → Tu servicio → **"Logs"**
2. O usa Render CLI:
```bash
npm install -g @render/cli
render logs nexoagent
```

---

## ⚡ Auto-Deploy

Render está configurado para auto-deploy en cada push a `main`:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Render automáticamente:
# 1. Detecta el push
# 2. Hace build
# 3. Deploy
# 4. Health check
```

---

## 🔧 Troubleshooting

### Error: Build falla
```bash
# Ver logs completos en Render Dashboard
# Usualmente es por:
# - Variables de entorno faltantes
# - Error en DATABASE_URL
```

### Error: Base de datos no conecta
```bash
# Verificar que DATABASE_URL esté correcta
# Verificar que migraciones se ejecutaron:
DATABASE_URL="..." npx prisma db pull
```

### Error: 503 Service Unavailable
- El free tier se duerme después de 15min de inactividad
- Primera request lo despierta (~30 segundos)
- Upgrade a paid plan ($7/mes) para evitar esto

---

## 💡 Optimizaciones para Free Tier

### 1. Mantener el servicio activo
Usa un cron job (ej: cron-job.org) para hacer ping cada 10 minutos:
```
https://nexoagent.onrender.com/api/health
```

### 2. Reducir cold starts
- Ya implementado: lazy loading
- Ya implementado: code splitting
- Ya implementado: optimistic updates

---

## 📈 Upgrade a Plan Pago

Si necesitas:
- Sin sleep (siempre activo)
- Más RAM/CPU
- Mejor performance

**Plan Starter:** $7/mes
1. Dashboard → Billing
2. Upgrade Service
3. Selecciona plan

---

## 🎉 ¡Listo!

Tu NexoAgent está **LIVE** en:
```
https://nexoagent.onrender.com
```

### Próximos pasos:
1. ✅ Probar todas las funcionalidades
2. ✅ Configurar Sentry para error tracking
3. ✅ Agregar uptime monitoring
4. ✅ Configurar dominio personalizado
5. ✅ Invitar usuarios beta

---

## 📞 Soporte

**Render Docs:** https://render.com/docs  
**NexoAgent Docs:** Ver DEPLOYMENT-GUIDE.md  
**Email:** perofaga@gmail.com

---

**¡Felicitaciones por el deployment!** 🚀🎊

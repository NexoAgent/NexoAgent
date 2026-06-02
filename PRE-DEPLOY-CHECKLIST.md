# ✅ Pre-Deploy Checklist - NexoAgent

**Fecha:** 2 de junio, 2026  
**Plataforma:** Render  
**Status:** READY TO DEPLOY 🚀

---

## 1️⃣ Repositorio Git

- [x] Todo commiteado
- [x] Build exitoso sin errores
- [x] 11 commits clean en `main`
- [ ] **TODO:** Push a GitHub/GitLab

```bash
# Si aún no lo has hecho:
git remote add origin https://github.com/tu-usuario/nexoagent.git
git push -u origin main
```

---

## 2️⃣ Base de Datos

- [x] DATABASE_URL de producción disponible
- [ ] **TODO:** Ejecutar migraciones

```bash
# IMPORTANTE: Hazlo ANTES del primer deploy
DATABASE_URL="postgresql://tu-production-url" npx prisma migrate deploy
```

---

## 3️⃣ Variables de Entorno

Tienes estas claves **YA GENERADAS** en tu `.env.local`:

```env
# ✅ Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFBnPA_Ngs48IdiYrYhUKs1LUQIxm1OUuEfHuV10-Ah0uvJLuBJ3Few2_XHFBiWijV9XvG4OavMX7OsihSWTm68
VAPID_PRIVATE_KEY=Z5QIHlpWu5esN9dsxKpZwpe9opgCzRHWIyVAXfzIavE
VAPID_SUBJECT=mailto:perofaga@gmail.com
```

**Necesitas configurar en Render:**

### Requeridas:
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=postgresql://...` (tu connection string)
- [ ] `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (copiar de arriba)
- [ ] `VAPID_PRIVATE_KEY` (copiar de arriba)
- [ ] `VAPID_SUBJECT=mailto:perofaga@gmail.com`
- [ ] `WHATSAPP_TOKEN=...`
- [ ] `WHATSAPP_VERIFY_TOKEN=nexoagent_token`
- [ ] `WHATSAPP_PHONE_NUMBER_ID=...`
- [ ] `NEXTAUTH_URL=https://nexoagent.onrender.com`
- [ ] `NEXTAUTH_SECRET=...` (genera con: `openssl rand -base64 32`)

### Opcionales (Google Calendar):
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

---

## 4️⃣ Crear Web Service en Render

1. [ ] Ir a https://render.com/dashboard
2. [ ] Click "New +" → "Web Service"
3. [ ] Conectar repositorio GitHub/GitLab
4. [ ] Configurar:
   - **Name:** nexoagent
   - **Build:** `npm install && npx prisma generate && npm run build`
   - **Start:** `npm start`
   - **Plan:** Free
5. [ ] Agregar todas las variables de entorno (sección 3)
6. [ ] Click "Create Web Service"

---

## 5️⃣ Post-Deploy Verification

Una vez deployado:

```bash
# 1. Health check
curl https://nexoagent.onrender.com/api/health

# Debes recibir: {"status":"ok","timestamp":"..."}

# 2. Verificar UI
# Abre en navegador: https://nexoagent.onrender.com
```

---

## 6️⃣ Configurar WhatsApp Webhook

- [ ] Ir a Meta Business / WhatsApp configuración
- [ ] Actualizar webhook URL: `https://nexoagent.onrender.com/api/webhook`
- [ ] Verify token: `nexoagent_token`

---

## 7️⃣ Monitoreo (Opcional pero recomendado)

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitor
- UptimeRobot: https://uptimerobot.com (gratis)
- Hacer ping a: `https://nexoagent.onrender.com/api/health` cada 5 min

---

## 📝 Notas Importantes

### Free Tier de Render:
- ⚠️ Se duerme después de 15 min de inactividad
- Primera request toma ~30s (cold start)
- **Solución:** Uptime monitor que haga ping cada 10 min

### Auto-Deploy:
- ✅ Ya configurado en `render.yaml`
- Cada push a `main` → auto-deploy
- Ver logs en Render Dashboard

---

## 🎯 Orden de Ejecución

**Sigue este orden exacto:**

```bash
# 1. Push a GitHub (si aún no lo hiciste)
git push origin main

# 2. Ejecutar migraciones a DB de producción
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# 3. Crear Web Service en Render
# (seguir pasos de sección 4)

# 4. Verificar deployment
curl https://nexoagent.onrender.com/api/health

# 5. Actualizar webhook de WhatsApp

# 6. ¡LISTO! 🎉
```

---

## 🆘 Troubleshooting

### Build falla
- Verificar todas las variables de entorno
- Revisar logs en Render Dashboard
- Verificar que `DATABASE_URL` sea correcta

### Database no conecta
```bash
# Verificar connection string
DATABASE_URL="..." npx prisma db pull
```

### 503 Error
- Normal en free tier después de inactividad
- Esperar ~30s para que despierte
- Configurar uptime monitor

---

## ✅ Checklist Final

Antes de declarar ÉXITO verifica:

- [ ] Build exitoso en Render
- [ ] Health endpoint responde
- [ ] UI carga correctamente
- [ ] Login funciona (NextAuth)
- [ ] WhatsApp webhook configurado
- [ ] Push notifications funcionan
- [ ] Base de datos conectada
- [ ] No hay errores en logs

---

## 🎉 ¡ÉXITO!

Una vez todo checkado:

**NexoAgent está LIVE en producción** 🚀

```
🌐 URL: https://nexoagent.onrender.com
📧 Email: perofaga@gmail.com
📊 Dashboard: https://render.com/dashboard
```

**¡Felicitaciones por el deployment!** 🎊

---

## 📚 Documentación de Referencia

- `RENDER-DEPLOYMENT.md` - Guía detallada paso a paso
- `DEPLOYMENT-GUIDE.md` - Guía general de deployment
- `README.md` - Overview del proyecto
- `UX-*.md` - Documentación de los 9 módulos

---

**¿Necesitas ayuda?** Revisa `RENDER-DEPLOYMENT.md` para guía completa.

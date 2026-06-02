# ⚡ DEPLOY AHORA - GUÍA ULTRA RÁPIDA

## ✅ YA HECHO POR MÍ:

1. ✅ Push a GitHub - **COMPLETO**
2. ✅ NEXTAUTH_SECRET generado
3. ✅ Variables de entorno preparadas en `RENDER-ENV-VARS.txt`
4. ✅ Build exitoso verificado

---

## 🎯 TU DEBES HACER (3 pasos):

### PASO A: Migraciones de Database

```bash
# Reemplaza con tu DATABASE_URL de producción
DATABASE_URL="postgresql://tu-url" npx prisma migrate deploy
```

---

### PASO B: Ir a Render y crear el service

**URL:** https://render.com/dashboard

1. Click **"New +"** → **"Web Service"**
2. Conecta GitHub
3. Selecciona repo **NexoAgent/NexoAgent**
4. Configuración:
   ```
   Name: nexoagent
   Region: Oregon
   Branch: main
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

---

### PASO C: Variables de Entorno

1. En Render, ve a la sección **"Environment"**
2. Abre el archivo `RENDER-ENV-VARS.txt` (está en la raíz del proyecto)
3. Copia TODO el contenido
4. Pega en Render
5. **IMPORTANTE:** Reemplaza estos valores:
   - `DATABASE_URL` → tu URL de producción
   - `ANTHROPIC_API_KEY` → tu API key
   - `WHATSAPP_TOKEN` → tu token
   - `WHATSAPP_PHONE_NUMBER_ID` → tu phone ID

6. Click **"Create Web Service"**

---

## 🎉 DESPUÉS DEL DEPLOY

### Verificar (espera 3-5 min):

```bash
curl https://nexoagent.onrender.com/api/health
```

### Configurar WhatsApp:

- URL: `https://nexoagent.onrender.com/api/webhook`
- Token: `nexoagent_token`

---

## 📋 RESUMEN DE ARCHIVOS ÚTILES

- **RENDER-ENV-VARS.txt** ← Todas las variables listas para copiar/pegar
- **render.yaml** ← Configuración automática (ya en el repo)
- **PRE-DEPLOY-CHECKLIST.md** ← Checklist completo
- **RENDER-DEPLOYMENT.md** ← Guía detallada

---

## 🆘 SI ALGO FALLA

1. Revisa logs en Render Dashboard
2. Verifica que todas las variables tengan valores reales (no "tu-...")
3. Verifica que DATABASE_URL sea correcta

---

## ✨ LISTO!

**Yo hice:** Push, secrets, configuración, documentación  
**Tú haces:** Migraciones + crear service en Render (5 min)

**¡Vamos, estás a 5 minutos de producción!** 🚀

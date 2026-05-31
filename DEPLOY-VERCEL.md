# 🚀 Deploy en Vercel - NexoAgent

## ⚡ Guía Completa de Deployment

Vercel es la plataforma ideal para Next.js. Este proceso toma ~10 minutos.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Proyecto en GitHub/GitLab/Bitbucket
- ✅ Base de datos Supabase configurada ([ver guía](QUICKSTART-SUPABASE.md))
- ✅ API Key de Anthropic
- ✅ AUTH_SECRET generado

---

## 🚀 Paso 1: Preparar el Repositorio

### 1.1 Verificar que `.gitignore` esté correcto

```bash
# Verificar que estos archivos NO estén en el repo
cat .gitignore | grep -E "\.env|node_modules"
```

Debe contener:
```
.env
.env.local
.env.production
node_modules
.next
```

### 1.2 Hacer Push del Código

```bash
# Verificar que todo esté commiteado
git status

# Si hay cambios, commitear
git add -A
git commit -m "chore: preparar para deploy en Vercel"

# Push a GitHub
git push origin main
```

---

## 🌐 Paso 2: Crear Proyecto en Vercel

### 2.1 Ir a Vercel Dashboard

1. Visita: https://vercel.com/
2. Click **"Sign Up"** o **"Login"**
3. Conecta con tu cuenta de GitHub

### 2.2 Importar Proyecto

1. Click **"Add New..."** → **"Project"**
2. Selecciona tu repositorio `nexoagent`
3. Click **"Import"**

### 2.3 Configurar el Proyecto

**Framework Preset:** Next.js (detectado automáticamente)

**Root Directory:** `./` (dejar por defecto)

**Build Command:**
```bash
prisma generate && next build
```

**Output Directory:** `.next` (dejar por defecto)

**Install Command:**
```bash
npm install
```

---

## 🔐 Paso 3: Configurar Variables de Entorno

En la sección **Environment Variables**, agrega TODAS estas variables:

### 3.1 Variables Requeridas

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# NextAuth
AUTH_SECRET=tu_secret_generado_con_openssl_rand_base64_32

# App URL (cambiar después del primer deploy)
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
```

### 3.2 Variables Opcionales (WhatsApp)

```env
# WhatsApp Business (opcional - para después)
WHATSAPP_VERIFY_TOKEN=nexoagent_webhook_token_2024
WHATSAPP_TOKEN=tu_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
```

### 3.3 Variables Opcionales (Google Calendar)

```env
# Google Calendar (opcional - para después)
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://tu-proyecto.vercel.app/api/google-calendar/callback
```

### 3.4 Variables de Entorno

**IMPORTANTE:** Selecciona todos los ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🎯 Paso 4: Deploy

1. Click **"Deploy"**
2. ⏰ Espera 2-3 minutos mientras se construye
3. 🎉 ¡Deploy completado!

Vercel te dará una URL como:
```
https://nexoagent-xxxxxxxxxx.vercel.app
```

---

## ✅ Paso 5: Configurar Dominio (Opcional)

### 5.1 Usar Dominio Personalizado

Si tienes un dominio propio:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. Click **"Add"**
4. Ingresa tu dominio: `nexoagent.com`
5. Sigue las instrucciones para configurar DNS

### 5.2 Actualizar Variables de Entorno

Una vez tengas tu dominio final:

1. Ve a **Settings** → **Environment Variables**
2. Edita `NEXT_PUBLIC_APP_URL`
3. Cambia a tu dominio real: `https://nexoagent.com`
4. Redeploy el proyecto

---

## 🗄️ Paso 6: Ejecutar Migraciones de Base de Datos

Las migraciones NO se ejecutan automáticamente en Vercel. Debes hacerlo manualmente:

### Opción 1: Desde tu Máquina Local

```bash
# Configurar DIRECT_URL en .env.local con tu DB de producción
DIRECT_URL="postgresql://postgres.[ref]:[password]@...5432/postgres"

# Ejecutar migraciones
npx prisma migrate deploy

# Sembrar datos (opcional, solo la primera vez)
npx tsx prisma/seed-production.ts
```

### Opción 2: Crear Script de Deploy

Crea un script `scripts/deploy-vercel.sh`:

```bash
#!/bin/bash
echo "🚀 Deployando a Vercel..."
echo ""

# Ejecutar migraciones
echo "📦 Ejecutando migraciones..."
npx prisma migrate deploy

# Sembrar datos (comentar después de la primera vez)
echo "🌱 Sembrando datos iniciales..."
npx tsx prisma/seed-production.ts

echo "✅ Deploy completado!"
```

---

## 🧪 Paso 7: Verificar el Deploy

### 7.1 Acceder a la Aplicación

1. Ve a tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Deberías ver la página de login de NexoAgent

### 7.2 Probar Login

**Credenciales por defecto** (si ejecutaste el seed):
- Email: `admin@nexoagent.com`
- Password: `Admin123!`

### 7.3 Verificar Funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Puedes navegar entre secciones
- ✅ Logo se muestra correctamente
- ✅ No hay errores en consola del navegador

---

## 📊 Paso 8: Monitoreo en Vercel

### 8.1 Ver Logs

1. Ve a tu proyecto en Vercel
2. Click en **"Deployments"**
3. Click en tu deployment más reciente
4. Ve a **"Runtime Logs"**

Aquí verás:
- Errores de servidor
- Requests HTTP
- Console.logs

### 8.2 Analytics (Opcional)

Vercel ofrece analytics gratuitos:

1. Ve a **"Analytics"** en tu proyecto
2. Verás:
   - Visitors
   - Top Pages
   - Performance metrics

---

## 🔧 Paso 9: Configuraciones Avanzadas

### 9.1 Configurar Regiones

Por defecto, Vercel deploya en múltiples regiones. Para optimizar:

1. **Settings** → **Functions**
2. Región recomendada para LATAM: **Washington, D.C. (iad1)**

### 9.2 Variables de Entorno por Branch

Para tener ambientes separados:

**Production (main branch):**
- `NEXT_PUBLIC_APP_URL=https://nexoagent.com`

**Preview (otras branches):**
- `NEXT_PUBLIC_APP_URL=https://preview.nexoagent.com`

### 9.3 Build Settings Personalizados

Si necesitas configuraciones especiales, crea `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 🚨 Troubleshooting

### Error: "Build failed - Prisma generate"

**Solución:**
```bash
# Verificar que el build command incluya prisma generate
Build Command: prisma generate && next build
```

### Error: "Can't connect to database"

**Soluciones:**
1. Verifica `DATABASE_URL` en variables de entorno
2. Asegúrate de usar Connection Pooling (puerto 6543)
3. Verifica que `?pgbouncer=true` esté en la URL

### Error: "Module not found: Can't resolve '@/lib/...'"

**Solución:**
Redeploy forzado:
1. Ve a **Deployments**
2. Click en "..." del último deploy
3. Click **"Redeploy"**

### Error: "AUTH_SECRET is not set"

**Solución:**
1. Genera un secret: `openssl rand -base64 32`
2. Agrégalo en **Settings** → **Environment Variables**
3. Redeploy

### Logs muestran "Prisma Client not generated"

**Solución:**
Asegúrate que el build command incluya:
```bash
prisma generate && next build
```

---

## 🔄 Paso 10: Deploy Continuo (CI/CD)

Vercel hace deploy automático cuando:

1. **Pushes a `main`** → Deploy a Production
2. **Pushes a otras branches** → Deploy Preview
3. **Pull Requests** → Deploy Preview con URL única

### Configurar Branch de Producción

1. **Settings** → **Git**
2. **Production Branch:** `main` (o el que uses)

### Proteger la Rama Main

En GitHub:

1. Settings → Branches
2. Add rule para `main`
3. Habilitar:
   - Require pull request reviews
   - Require status checks (Vercel preview)

---

## 📱 Paso 11: Configurar WhatsApp Webhook (Opcional)

Una vez que tu app esté en producción:

1. Ve a Meta Developer Console
2. WhatsApp → Configuration
3. Webhook URL:
   ```
   https://tu-dominio.vercel.app/api/webhook
   ```
4. Verify Token: El mismo que pusiste en `WHATSAPP_VERIFY_TOKEN`
5. Subscribe to: `messages`

---

## 🎯 Checklist Final

- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas (mínimo: DATABASE_URL, DIRECT_URL, ANTHROPIC_API_KEY, AUTH_SECRET)
- [ ] Build completado exitosamente
- [ ] Migraciones ejecutadas en Supabase
- [ ] Datos iniciales sembrados
- [ ] Login funciona con credenciales admin
- [ ] Logo y branding se muestran correctamente
- [ ] No hay errores en Runtime Logs
- [ ] `NEXT_PUBLIC_APP_URL` actualizada con dominio real (si aplica)
- [ ] WhatsApp webhook configurado (opcional)
- [ ] Google Calendar redirect URI actualizado (opcional)

---

## 📊 Métricas de Vercel (Free Tier)

**Límites del Plan Gratuito:**
- ✅ 100 GB Bandwidth/mes
- ✅ Deployments ilimitados
- ✅ Preview deployments
- ✅ Automatic HTTPS
- ✅ Analytics básicos
- ❌ No serverless functions time limit (10s max)

Para producción con más tráfico, considera:
- **Pro Plan:** $20/mes
- **Enterprise:** Custom pricing

---

## 🚀 Próximos Pasos

Después del deploy:

1. ✅ **Configurar dominio personalizado**
2. ✅ **Configurar WhatsApp Business webhook**
3. ✅ **Configurar Google Calendar OAuth**
4. ✅ **Agregar usuarios y empresas**
5. ✅ **Monitorear logs y analytics**
6. ✅ **Configurar backups de base de datos**

---

## 💡 Tips Pro

### Mejor Performance

1. Habilitar **Edge Functions** para rutas públicas
2. Usar **ISR** (Incremental Static Regeneration) donde sea posible
3. Optimizar imágenes con Next.js Image

### Seguridad

1. Habilitar **Deployment Protection**
2. Configurar **Environment Variables** por ambiente
3. Usar **Preview Deployments** para testing

### Monitoreo

1. Integrar Sentry para errores
2. Configurar alertas de uptime
3. Revisar Analytics semanalmente

---

## 📚 Recursos Útiles

- **Vercel Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs
- **Vercel CLI:** https://vercel.com/docs/cli
- **Vercel Analytics:** https://vercel.com/docs/analytics

---

## ✅ Deploy Completado

¡Felicidades! 🎉 NexoAgent está ahora en producción.

**Tu aplicación está disponible en:**
```
https://tu-proyecto.vercel.app
```

**Acceso admin:**
- Email: admin@nexoagent.com
- Password: Admin123!

⚠️ **IMPORTANTE:** Cambia la contraseña del admin inmediatamente.

---

**Fecha:** Mayo 31, 2026  
**Plataforma:** Vercel  
**Estado:** ✅ PRODUCTION READY

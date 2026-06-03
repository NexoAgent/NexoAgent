# 🔄 Migración Paso a Paso: Render → Vercel + Dominio Propio

## 📋 Tabla de Contenidos
1. [Preparación y Backup](#1-preparación-y-backup)
2. [Setup Vercel](#2-setup-vercel)
3. [Migrar Base de Datos](#3-migrar-base-de-datos)
4. [Configurar Variables de Entorno](#4-configurar-variables-de-entorno)
5. [Primer Deploy](#5-primer-deploy)
6. [Dominio Personalizado](#6-dominio-personalizado)
7. [Testing y Verificación](#7-testing-y-verificación)
8. [Apagar Render](#8-apagar-render)

---

## ⏱️ Tiempo Estimado: 45-60 minutos

---

## 1️⃣ Preparación y Backup

### 1.1 Backup de Base de Datos Actual

**Si tu BD está en Render:**

```bash
# Conectarse a tu BD de Render y hacer backup
pg_dump <TU_DATABASE_URL_DE_RENDER> > backup_nexoagent_$(date +%Y%m%d).sql

# Verificar que se creó el archivo
ls -lh backup_nexoagent_*.sql
```

**Guardar este archivo** en un lugar seguro (Dropbox, Google Drive, etc.)

### 1.2 Documentar Variables de Entorno Actuales

En Render Dashboard:
1. Ir a tu servicio de NexoAgent
2. Environment → Copiar TODAS las variables a un archivo temporal
3. Guardar en `env_backup.txt` (NO subir a GitHub)

### 1.3 Verificar Estado Actual del Código

```bash
# Asegurarse de que todo está pusheado a GitHub
git status
git add -A
git commit -m "pre-migration: estado estable antes de migrar a Vercel"
git push origin main
```

✅ **Checkpoint 1:** Backup de BD y variables de entorno guardados localmente

---

## 2️⃣ Setup Vercel

### 2.1 Crear Cuenta en Vercel

1. Ir a: **https://vercel.com/signup**
2. Elegir: **Continue with GitHub**
3. Autorizar acceso a Vercel
4. ✅ Cuenta creada

### 2.2 Importar Proyecto desde GitHub

1. Click en **"Add New..."** → **Project**
2. Buscar tu repositorio: `NexoAgent/NexoAgent`
3. Click **Import**

### 2.3 Configuración Inicial del Proyecto

En la pantalla de configuración:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Next.js (auto-detectado) |
| **Root Directory** | `.` (dejar por defecto) |
| **Build Command** | `npm run build` (auto) |
| **Output Directory** | `.next` (auto) |
| **Install Command** | `npm install` (auto) |

**⚠️ NO hacer deploy todavía** - Primero configurar variables

✅ **Checkpoint 2:** Proyecto importado en Vercel

---

## 3️⃣ Migrar Base de Datos

### Opción A: Migrar a Supabase (RECOMENDADO)

#### 3.1 Crear Proyecto en Supabase

1. Ir a: **https://supabase.com/dashboard**
2. Click **New Project**
3. Configurar:
   - **Name:** nexoagent-production
   - **Database Password:** (generar una segura y guardarla)
   - **Region:** Europe West (más cerca de Portugal)
   - **Pricing Plan:** Free (para empezar)
4. Click **Create new project**
5. Esperar 2-3 minutos a que se provisione

#### 3.2 Obtener Connection String

1. En Supabase, ir a: **Settings** → **Database**
2. Buscar: **Connection string** → **URI**
3. Copiar la cadena (ejemplo):
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
   ```
4. Reemplazar `[YOUR-PASSWORD]` con la contraseña que creaste

#### 3.3 Restaurar Backup en Supabase

```bash
# Restaurar tu backup en la nueva BD de Supabase
psql "postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres" < backup_nexoagent_YYYYMMDD.sql
```

**Alternativa si no tienes psql instalado:**
```bash
# Ejecutar migraciones desde cero (si tu backup es muy grande)
DATABASE_URL="postgresql://postgres.xxxxx..." npx prisma migrate deploy
DATABASE_URL="postgresql://postgres.xxxxx..." npx prisma db seed
```

### Opción B: Mantener BD en Render

Si prefieres mantener la BD en Render (no recomendado a largo plazo):

1. Mantener el mismo `DATABASE_URL` que tienes actualmente
2. Continuar al siguiente paso

✅ **Checkpoint 3:** Base de datos migrada y funcionando

---

## 4️⃣ Configurar Variables de Entorno en Vercel

### 4.1 Acceder a Environment Variables

En Vercel:
1. Ir a tu proyecto
2. **Settings** → **Environment Variables**

### 4.2 Agregar Variables UNA POR UNA

Copiar desde tu `env_backup.txt` y pegar en Vercel:

#### 🗄️ **Base de Datos**
```env
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres
```

**Environments:** Production, Preview, Development (marcar todos)

---

#### 🔐 **Autenticación**
```env
NEXTAUTH_URL=https://nexoagent.vercel.app
NEXTAUTH_SECRET=tu_secret_actual_de_render_o_genera_uno_nuevo
```

**IMPORTANTE:** Cambiar `nexoagent.vercel.app` cuando tengas dominio propio

**Generar nuevo NEXTAUTH_SECRET (opcional):**
```bash
openssl rand -base64 32
```

**Environments:** Production, Preview, Development

---

#### 📱 **Twilio WhatsApp**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_actual
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Environments:** Production, Preview, Development

---

#### 🔔 **Push Notifications**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key
PUSH_NOTIFICATION_EMAIL=mailto:perofaga@gmail.com
```

**Environments:** Production, Preview, Development

---

#### 🤖 **OpenAI (si lo usas)**
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Environments:** Production, Preview, Development

---

### 4.3 Verificar Variables

Ir a **Settings** → **Environment Variables** y verificar que TODAS las variables estén:
- ✅ Agregadas correctamente
- ✅ Asignadas a todos los environments (Production, Preview, Development)

✅ **Checkpoint 4:** Variables de entorno configuradas

---

## 5️⃣ Primer Deploy

### 5.1 Trigger Deploy

1. En Vercel Dashboard, ir a tu proyecto
2. Click **Deployments**
3. Click **Deploy** (botón en la esquina superior derecha)

O desde tu terminal local:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 5.2 Monitorear el Deploy

1. Ver logs en tiempo real en Vercel Dashboard
2. Esperar 2-3 minutos
3. Si hay errores, leerlos cuidadosamente

### 5.3 Errores Comunes y Soluciones

| Error | Solución |
|-------|----------|
| `Prisma Client not generated` | Agregar `postinstall` script en package.json |
| `DATABASE_URL not found` | Verificar que la variable está en Production environment |
| `Build failed: TypeScript errors` | Correr `npm run build` localmente primero |

**Fix para Prisma:**
```bash
# Agregar en package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}

# Commit y push
git add package.json
git commit -m "fix: agregar postinstall para Prisma en Vercel"
git push origin main
```

### 5.4 Verificar Deploy Exitoso

1. Vercel te dará una URL: `https://nexoagent-xxxx.vercel.app`
2. Abrir la URL en el navegador
3. Verificar que la página carga

✅ **Checkpoint 5:** Primera versión deployada en Vercel

---

## 6️⃣ Dominio Personalizado

### 6.1 Comprar Dominio (si aún no tienes uno)

**Opciones recomendadas:**

| Registrar | Precio/año | Pros |
|-----------|-----------|------|
| **Namecheap** | $8-12 | Barato, interfaz simple |
| **Google Domains** | $12 | Integración con Google |
| **GoDaddy** | $12-15 | Popular, soporte 24/7 |
| **Cloudflare** | $9-10 | Incluye CDN gratis |

**Ejemplos de dominios:**
- `nexoagent.com` ($12/año)
- `nexoagent.io` ($30/año)
- `tunombre-crm.com` ($10/año)

**Proceso de compra (ejemplo Namecheap):**
1. Ir a https://www.namecheap.com
2. Buscar dominio disponible: `nexoagent.com`
3. Agregar al carrito
4. Checkout (no comprar extras como WhoisGuard si es personal)
5. Completar pago
6. ✅ Dominio comprado

### 6.2 Agregar Dominio a Vercel

#### En Vercel Dashboard:

1. Ir a tu proyecto NexoAgent
2. **Settings** → **Domains**
3. Click **Add**
4. Escribir tu dominio: `nexoagent.com` (sin www)
5. Click **Add**

#### Vercel te mostrará 2 opciones:

**Opción A: Nameservers (RECOMENDADO - más simple)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Opción B: A Record**
```
76.76.21.21
```

### 6.3 Configurar DNS

#### Si elegiste Nameservers (Opción A):

**En Namecheap:**
1. Login → **Domain List**
2. Click **Manage** en tu dominio
3. **Nameservers** → Cambiar a **Custom DNS**
4. Agregar:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
5. Click **✓** (guardar)
6. ⏱️ Esperar 1-24 horas (usualmente 10-30 minutos)

#### Si elegiste A Record (Opción B):

**En Namecheap:**
1. Login → **Domain List**
2. Click **Manage** en tu dominio
3. **Advanced DNS** → **Add New Record**
4. Tipo: **A Record**
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: Automatic
5. Agregar otro A Record:
   - Host: `www`
   - Value: `76.76.21.21`
   - TTL: Automatic
6. Guardar

### 6.4 Agregar www (opcional pero recomendado)

En Vercel, agregar también:
1. **Settings** → **Domains** → **Add**
2. Escribir: `www.nexoagent.com`
3. Vercel automáticamente redirigirá `www` → `nexoagent.com`

### 6.5 Verificar Propagación DNS

**Herramientas online:**
- https://www.whatsmydns.net
- Escribir tu dominio
- Verificar que apunta a la IP de Vercel

**Desde terminal:**
```bash
# Verificar DNS
dig nexoagent.com

# Debería mostrar 76.76.21.21
```

### 6.6 Actualizar NEXTAUTH_URL

**MUY IMPORTANTE:** Una vez que el dominio funcione:

1. Ir a Vercel → **Settings** → **Environment Variables**
2. Editar `NEXTAUTH_URL`
3. Cambiar de:
   ```
   https://nexoagent.vercel.app
   ```
   A:
   ```
   https://nexoagent.com
   ```
4. **Redeploy** el proyecto para que tome la nueva variable

✅ **Checkpoint 6:** Dominio propio configurado y funcionando

---

## 7️⃣ Testing y Verificación

### 7.1 Checklist de Funcionalidad

Probar en tu dominio nuevo `https://nexoagent.com`:

- [ ] **Login funciona**
  ```
  Usuario: tu_email@ejemplo.com
  ```

- [ ] **Dashboard carga**
  - Ver empresas
  - Ver conversaciones
  - Ver CRM

- [ ] **Base de datos funciona**
  - Crear un contacto de prueba
  - Ver que se guarda
  - Eliminarlo

- [ ] **WhatsApp Sandbox funciona**
  - Enviar mensaje de prueba desde conversación
  - Verificar que llega a WhatsApp

- [ ] **Notificaciones Push**
  - Activar modo humano
  - Verificar que llega la notificación

### 7.2 Performance y Velocidad

Probar velocidad de carga:
1. https://pagespeed.web.dev
2. Ingresar: `https://nexoagent.com`
3. Verificar score > 80

### 7.3 Verificar Logs

```bash
# Ver logs en tiempo real
vercel logs --follow

# O en Dashboard:
# Vercel → Tu proyecto → Logs
```

✅ **Checkpoint 7:** Toda la funcionalidad verificada

---

## 8️⃣ Apagar Render

### 8.1 Esperar 48-72 horas

**No apagar Render inmediatamente.** Esperar 2-3 días para:
- Asegurar que Vercel está estable
- Verificar que usuarios no tienen problemas
- Tener un rollback plan

### 8.2 Desactivar Servicios en Render

Una vez seguro:

1. Login a Render Dashboard
2. Ir a tu servicio de NexoAgent
3. **Settings** → Scroll down
4. Click **Suspend Service**
5. Confirmar

### 8.3 (Opcional) Mantener BD en Render

Si tu BD está en Render y quieres mantenerla temporalmente:
- Solo suspender el servicio web
- Mantener el servicio de PostgreSQL activo
- Vercel se conectará a la BD de Render

### 8.4 Cancelar Plan (después de 1 mes)

Si todo funciona bien después de 1 mes:
1. Render → **Account Settings**
2. **Billing**
3. Cancelar plan / Eliminar servicios

✅ **Checkpoint 8:** Migración completada exitosamente

---

## 🎉 ¡Migración Completa!

### 📊 Resumen Final

| Antes (Render) | Después (Vercel) |
|----------------|------------------|
| ❌ $15-20/mes | ✅ $0/mes (Hobby) o $20/mes (Pro) |
| ⚠️ Slow builds | ✅ Builds ultra-rápidos |
| ⚠️ Cold starts | ✅ Edge Functions siempre activas |
| ⚠️ Manual deploys | ✅ Auto-deploy desde GitHub |

### 🔗 URLs Finales

- **Producción:** https://nexoagent.com
- **Dashboard Vercel:** https://vercel.com/dashboard
- **Analytics:** https://vercel.com/[tu-usuario]/nexoagent/analytics

---

## 🆘 Troubleshooting

### "Domain not verified"
**Solución:** Esperar 24 horas para propagación DNS

### "Build failed"
**Solución:**
```bash
# Limpiar cache y rebuilder
vercel --prod --force
```

### "Database connection failed"
**Solución:** Verificar `DATABASE_URL` en Environment Variables

### "NextAuth error"
**Solución:** Verificar que `NEXTAUTH_URL` tiene tu dominio nuevo

---

## 📞 Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** support@vercel.com
- **Community:** https://github.com/vercel/vercel/discussions

---

## 📅 Mantenimiento Post-Migración

### Primera Semana
- [ ] Monitorear logs diariamente
- [ ] Verificar analytics en Vercel
- [ ] Probar todas las features críticas

### Primer Mes
- [ ] Revisar costos en Vercel Billing
- [ ] Considerar upgrade a Vercel Pro si necesitas más recursos
- [ ] Apagar Render definitivamente

### Continuo
- [ ] Auto-deploys desde GitHub funcionan
- [ ] SSL renovado automáticamente (Vercel lo hace)
- [ ] Backups de BD semanales (si estás en Supabase)

# ✅ Checklist de Migración Render → Vercel

**Imprime esta página y marca cada checkbox a medida que avanzas**

---

## 📦 FASE 1: Preparación (15 min)

- [ ] **1.1** Hacer backup de base de datos
  ```bash
  pg_dump <DATABASE_URL_RENDER> > backup_nexoagent_$(date +%Y%m%d).sql
  ```

- [ ] **1.2** Copiar TODAS las variables de entorno de Render a `env_backup.txt`

- [ ] **1.3** Verificar que código está en GitHub
  ```bash
  git status
  git push origin main
  ```

---

## 🚀 FASE 2: Setup Vercel (10 min)

- [ ] **2.1** Crear cuenta en https://vercel.com (usar GitHub)

- [ ] **2.2** Click "Add New Project" → Buscar `NexoAgent/NexoAgent` → Import

- [ ] **2.3** **NO hacer deploy todavía** - Solo importar

---

## 🗄️ FASE 3: Base de Datos (15 min)

**Opción A: Migrar a Supabase (recomendado)**

- [ ] **3.1** Ir a https://supabase.com → New Project
  - Name: `nexoagent-production`
  - Password: ______________ (guardar!)
  - Region: Europe West

- [ ] **3.2** Settings → Database → Copiar "Connection string (URI)"
  ```
  postgresql://postgres.xxxxx:[PASSWORD]@...
  ```

- [ ] **3.3** Restaurar backup
  ```bash
  psql "postgresql://..." < backup_nexoagent_YYYYMMDD.sql
  ```
  O ejecutar migraciones:
  ```bash
  DATABASE_URL="postgresql://..." npx prisma migrate deploy
  ```

**Opción B: Mantener BD en Render**

- [ ] **3.1** Copiar `DATABASE_URL` actual de Render
- [ ] **3.2** Usar la misma en Vercel

---

## 🔐 FASE 4: Variables de Entorno en Vercel (10 min)

En Vercel → Settings → Environment Variables, agregar:

### Base de Datos
- [ ] `DATABASE_URL` = `postgresql://postgres...` _(Production, Preview, Development)_
- [ ] `DIRECT_URL` = `postgresql://postgres...` _(Production, Preview, Development)_

### Autenticación
- [ ] `NEXTAUTH_URL` = `https://nexoagent.vercel.app` _(cambiar después)_
- [ ] `NEXTAUTH_SECRET` = `____________` _(copiar de Render o generar nuevo)_

### Twilio
- [ ] `TWILIO_ACCOUNT_SID` = `AC____________`
- [ ] `TWILIO_AUTH_TOKEN` = `____________`
- [ ] `TWILIO_WHATSAPP_FROM` = `whatsapp:+14155238886`

### Push Notifications
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = `____________`
- [ ] `VAPID_PRIVATE_KEY` = `____________`
- [ ] `PUSH_NOTIFICATION_EMAIL` = `mailto:perofaga@gmail.com`

### OpenAI (si lo usas)
- [ ] `OPENAI_API_KEY` = `sk-____________`

---

## 🎯 FASE 5: Primer Deploy (5 min)

- [ ] **5.1** En Vercel Dashboard → Click **Deploy**

- [ ] **5.2** Esperar 2-3 minutos

- [ ] **5.3** Abrir URL: `https://nexoagent-xxxx.vercel.app`

- [ ] **5.4** ✅ Verificar que la página carga

---

## 🌐 FASE 6: Dominio Propio (30 min + espera DNS)

### Comprar Dominio (si no tienes)
- [ ] **6.1** Ir a Namecheap/GoDaddy/Cloudflare
- [ ] **6.2** Buscar dominio disponible
- [ ] **6.3** Completar compra
- [ ] **6.4** Dominio comprado: `____________.com`

### Configurar en Vercel
- [ ] **6.5** Vercel → Settings → Domains → Add
- [ ] **6.6** Escribir tu dominio (sin www)

### Configurar DNS
Vercel te mostrará las instrucciones. Elegir una:

**Opción A: Nameservers (más simple)**
- [ ] **6.7** En Namecheap → Domain List → Manage
- [ ] **6.8** Nameservers → Custom DNS
- [ ] **6.9** Agregar:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- [ ] **6.10** Guardar

**Opción B: A Record**
- [ ] **6.7** En Namecheap → Advanced DNS
- [ ] **6.8** Add A Record:
  - Host: `@` → Value: `76.76.21.21`
  - Host: `www` → Value: `76.76.21.21`
- [ ] **6.9** Guardar

### Esperar Propagación
- [ ] **6.11** ⏱️ Esperar 10-60 minutos
- [ ] **6.12** Verificar en https://www.whatsmydns.net

### Actualizar NEXTAUTH_URL
- [ ] **6.13** Vercel → Environment Variables
- [ ] **6.14** Editar `NEXTAUTH_URL` → `https://tu-dominio.com`
- [ ] **6.15** Redeploy el proyecto

---

## 🧪 FASE 7: Testing (15 min)

Probar en `https://tu-dominio.com`:

- [ ] **7.1** Login funciona
- [ ] **7.2** Dashboard carga
- [ ] **7.3** Ver empresas
- [ ] **7.4** Ver conversaciones
- [ ] **7.5** Crear un contacto de prueba
- [ ] **7.6** Eliminar contacto de prueba
- [ ] **7.7** Enviar mensaje WhatsApp de prueba
- [ ] **7.8** Activar modo humano (notificación)

---

## 🛑 FASE 8: Apagar Render (después de 48-72h)

**Esperar 2-3 días antes de apagar Render**

- [ ] **8.1** Fecha para apagar Render: ___/___/2026

Cuando estés seguro:
- [ ] **8.2** Render Dashboard → Settings → Suspend Service
- [ ] **8.3** Confirmar

Después de 1 mes:
- [ ] **8.4** Render → Billing → Cancelar plan

---

## 🎉 ¡Migración Completa!

**URLs finales:**
- Producción: `https://____________.com`
- Vercel Dashboard: https://vercel.com/dashboard

---

## 📞 Si algo sale mal

1. **No apagar Render** hasta estar 100% seguro
2. Revisar logs: `vercel logs --follow`
3. Leer troubleshooting en `MIGRACION_VERCEL.md`
4. Vercel Support: support@vercel.com

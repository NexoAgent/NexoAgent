# 🚀 Guía de Deployment - NexoAgent

## Opción Recomendada: Vercel + Supabase

### 📝 Pre-requisitos

- [ ] Cuenta en GitHub (ya tienes el repo)
- [ ] Cuenta en Vercel (gratis)
- [ ] Cuenta en Supabase (gratis)
- [ ] Cuenta en Twilio configurada

---

## 🗄️ Paso 1: Base de Datos en Supabase

### 1.1 Crear Proyecto
1. Ir a https://supabase.com
2. Click "New Project"
3. Nombre: `nexoagent-production`
4. Región: Europe West (para tus usuarios)
5. **Guardar la contraseña de BD**

### 1.2 Obtener Connection String
1. Settings → Database
2. Copiar "Connection string" (URI mode)
3. Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### 1.3 Ejecutar Migraciones
```bash
DATABASE_URL="postgresql://postgres:..." npx prisma migrate deploy
```

---

## 🌐 Paso 2: Deploy en Vercel

### 2.1 Conectar Repositorio
1. Ir a https://vercel.com
2. Click "Add New Project"
3. Importar repo: `NexoAgent/NexoAgent`
4. Framework: Next.js (auto)

### 2.2 Variables de Entorno

DATABASE_URL, NEXTAUTH_SECRET, TWILIO_*, VAPID_*, etc.

### 2.3 Deploy
Click "Deploy" → Esperar 2 min → ✅ Listo

---

## 💰 Costos

- **Gratis:** $0/mes (Vercel Hobby + Supabase Free)
- **Producción:** ~$45-95/mes (Vercel Pro + Supabase Pro + Twilio)

Ver archivo completo para más detalles...

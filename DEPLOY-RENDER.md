# 🚀 Configuración en Render

## ⚠️ IMPORTANTE: Variables de Entorno

Antes de que funcione el login, debes agregar esta variable de entorno en Render:

### 1. Ve a tu servicio en Render Dashboard
https://dashboard.render.com/

### 2. Ve a "Environment" en el menú izquierdo

### 3. Agrega esta variable:

```
Key:   AUTH_SECRET
Value: RHeKQT8o2KgYzDVxfg4ylYybKZdT8fRbkduYz7BVa7c=
```

**IMPORTANTE**: Usa el valor exacto de arriba (o genera uno nuevo con `openssl rand -base64 32`)

### 4. Click en "Save Changes"

El servicio se reiniciará automáticamente.

---

## 📦 Después del deploy

Una vez que el deploy termine exitosamente:

### 1. Ve a "Shell" en el menú izquierdo de Render

### 2. Ejecuta estos comandos:

```bash
# Aplicar migraciones de base de datos
npx prisma migrate deploy

# Crear usuario proveedor inicial
npx tsx prisma/seed.ts
```

Deberías ver:
```
✅ Usuario proveedor creado:
   Email: perofaga@gmail.com
   Password: nexoagent2026
   Rol: PROVEEDOR
```

---

## ✅ Probar el sistema

1. Ve a: `https://nexoagent.onrender.com/login`

2. Ingresa:
   - Email: `perofaga@gmail.com`
   - Password: `nexoagent2026`

3. Deberías ver el panel de administración en `/admin`

4. Crea una empresa de prueba y un usuario CLIENTE

5. Logout y prueba el login con el usuario CLIENTE

---

## 🔧 Variables de entorno requeridas en Render

Asegúrate de tener TODAS estas variables configuradas:

```
DATABASE_URL              (ya está - de Neon)
ANTHROPIC_API_KEY         (ya está)
AUTH_SECRET               ⚠️ AGREGAR AHORA
GOOGLE_CLIENT_ID          (ya está)
GOOGLE_CLIENT_SECRET      (ya está)
GOOGLE_REDIRECT_URI       (debe ser https://nexoagent.onrender.com/api/google-calendar/callback)
WHATSAPP_VERIFY_TOKEN     (ya está)
TWILIO_ACCOUNT_SID        (ya está)
TWILIO_AUTH_TOKEN         (ya está)
TWILIO_WHATSAPP_FROM      (ya está)
```

---

## 🐛 Si algo falla

**Error: "server configuration problem"**
→ Falta AUTH_SECRET, agrégalo en Environment

**Error: "Internal Server Error" en login**
→ Verifica que el seed se haya ejecutado correctamente

**Error: No puedo crear empresas**
→ Asegúrate de que las migraciones se aplicaron con `npx prisma migrate deploy`

**Error: Usuario no encontrado**
→ Ejecuta de nuevo: `npx tsx prisma/seed.ts` (es idempotente, no crea duplicados)

---

## 📝 Cambiar contraseña del proveedor

Después del primer login, cambia la contraseña por seguridad:

1. (Por ahora) Conéctate al Shell de Render
2. Ejecuta:
```bash
npx tsx -e "
import { prisma } from './lib/prisma.js';
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('TU_NUEVA_CONTRASEÑA', 10);
await prisma.usuario.update({
  where: { email: 'perofaga@gmail.com' },
  data: { password: hash }
});
console.log('Contraseña actualizada');
process.exit(0);
"
```

---

**Última actualización**: 31 Mayo 2026

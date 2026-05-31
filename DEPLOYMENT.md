# 🚀 Guía de Deployment - NexoAgent

## Pre-requisitos de producción

### 1. Base de datos PostgreSQL
- [ ] Crear base de datos en proveedor cloud (Supabase, Neon, Railway, etc.)
- [ ] Obtener `DATABASE_URL` de conexión
- [ ] Ejecutar migraciones: `npx prisma migrate deploy`

### 2. Variables de entorno
Configurar en tu plataforma de hosting:

```env
# Esenciales
DATABASE_URL=postgresql://user:password@host:5432/database
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# WhatsApp (Meta Business)
WHATSAPP_VERIFY_TOKEN=tu_token_secreto
WHATSAPP_TOKEN=tu_meta_token
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id

# Opcional
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### 3. Configuración de WhatsApp Business API

#### En Meta Developer Console:
1. Ve a https://developers.facebook.com/apps
2. Selecciona tu app o crea una nueva
3. Agrega el producto "WhatsApp"
4. En Configuration > Webhooks:
   - **Callback URL**: `https://tu-dominio.com/api/webhook`
   - **Verify Token**: El mismo valor que pusiste en `WHATSAPP_VERIFY_TOKEN`
   - **Webhook Fields**: Suscríbete a `messages`
5. En API Setup:
   - Copia el **Phone Number ID**
   - Copia el **Access Token** (temporal o permanente)

---

## Deployment en Vercel (Recomendado)

### Paso 1: Conectar repositorio
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Paso 2: Configurar proyecto
En el dashboard de Vercel:
1. Settings > Environment Variables
2. Agrega todas las variables de `.env.example`
3. Build Command: `npm run build`
4. Output Directory: `.next`

### Paso 3: Configurar base de datos
```bash
# Desde tu local con la DATABASE_URL de producción
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Paso 4: Verificar deployment
- [ ] Health check: `https://tu-dominio.com/api/health`
- [ ] Dashboard: `https://tu-dominio.com/dashboard`
- [ ] Webhook: Envía mensaje de prueba vía WhatsApp

---

## Deployment en Railway

### Paso 1: Crear proyecto
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar
railway init
```

### Paso 2: Agregar PostgreSQL
```bash
railway add --plugin postgresql
```

### Paso 3: Configurar variables
```bash
railway variables set ANTHROPIC_API_KEY=sk-ant-...
railway variables set WHATSAPP_VERIFY_TOKEN=tu_token
railway variables set WHATSAPP_TOKEN=tu_meta_token
railway variables set WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
```

### Paso 4: Deploy
```bash
railway up
```

---

## Deployment en DigitalOcean App Platform

### Paso 1: Crear App
1. Ve a Apps > Create App
2. Conecta tu repositorio GitHub
3. Selecciona la rama `main`

### Paso 2: Configurar build
- **Build Command**: `npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: 3000
- **Environment Variables**: Agregar todas desde `.env.example`

### Paso 3: Agregar base de datos
1. Add Resource > Database > PostgreSQL
2. Conectar a la App
3. Copiar `DATABASE_URL` a las variables de entorno

### Paso 4: Deploy
Click en "Create Resources"

---

## Checklist post-deployment

### Verificaciones básicas
- [ ] La app carga correctamente
- [ ] El health check responde: `/api/health`
- [ ] El dashboard es accesible: `/dashboard`
- [ ] Puedes crear una empresa de prueba
- [ ] El webhook responde correctamente al verification challenge de Meta

### Verificaciones de WhatsApp
- [ ] Enviar mensaje de prueba al número configurado
- [ ] Verificar que el webhook recibe el mensaje (check logs)
- [ ] Verificar que la IA responde correctamente
- [ ] Probar cambio a modo humano ("quiero hablar con una persona")
- [ ] Probar automatizaciones (primer mensaje, palabra clave)

### Verificaciones de módulos
- [ ] **CRM**: Crear y editar contacto
- [ ] **Conocimiento**: Subir documento PDF
- [ ] **Memoria**: Agregar productos, horarios, precios
- [ ] **Automatizaciones**: Crear y activar regla
- [ ] **Agenda**: Crear cita y cambiar estado
- [ ] **Analíticas**: Ver estadísticas y gráficos

### Seguridad
- [ ] Variables de entorno están en el servidor (no en código)
- [ ] API keys no están expuestas en el frontend
- [ ] Database connection string es segura
- [ ] HTTPS habilitado en producción
- [ ] Webhook token configurado correctamente

---

## Troubleshooting

### Error: Database connection failed
**Solución**: Verifica que `DATABASE_URL` esté correctamente configurada y que la base de datos acepte conexiones externas.

```bash
# Probar conexión
psql "postgresql://user:password@host:5432/database"
```

### Error: Prisma Client not generated
**Solución**: Asegúrate de que `prisma generate` se ejecute en el build.

```bash
# En package.json ya está configurado:
"build": "prisma generate && next build"
```

### Error: Webhook verification failed (403)
**Solución**: Verifica que `WHATSAPP_VERIFY_TOKEN` en tu servidor coincida con el configurado en Meta.

### Error: Cannot connect to WhatsApp
**Solución**: 
1. Verifica que el número de WhatsApp esté verificado en Meta
2. Revisa que `WHATSAPP_PHONE_NUMBER_ID` sea correcto
3. Asegúrate de que el token no haya expirado

### Error: Anthropic API rate limit
**Solución**: 
1. Verifica tu plan de Anthropic
2. Implementa rate limiting en tu app
3. Considera caché de respuestas frecuentes

---

## Monitoreo en producción

### Logs recomendados
```bash
# Vercel
vercel logs

# Railway
railway logs

# DigitalOcean
doctl apps logs <app-id>
```

### Métricas a monitorear
- [ ] Tasa de respuesta del webhook (<1s ideal)
- [ ] Errores de API de Anthropic
- [ ] Uso de base de datos (conexiones activas)
- [ ] Tiempo de respuesta de páginas
- [ ] Cantidad de mensajes procesados por día

### Herramientas recomendadas
- **Sentry**: Tracking de errores
- **Vercel Analytics**: Métricas de performance
- **LogRocket**: Session replay y debugging
- **Uptime Robot**: Monitoring de disponibilidad

---

## Backup y recuperación

### Backup de base de datos
```bash
# Exportar schema y datos
pg_dump -h host -U user -d database > backup.sql

# Restaurar
psql -h host -U user -d database < backup.sql
```

### Backup de documentos
Los documentos están en la base de datos. Considera:
- Backups automáticos diarios de PostgreSQL
- Snapshots semanales
- Replicación en otra región (opcional)

---

## Escalamiento

### Cuando escalar
- Más de 1000 conversaciones diarias
- Tiempo de respuesta > 3 segundos
- Base de datos > 10GB
- Múltiples empresas activas

### Opciones de escalamiento
1. **Vertical**: Aumentar recursos del servidor (CPU/RAM)
2. **Horizontal**: Múltiples instancias con load balancer
3. **Database**: PostgreSQL con read replicas
4. **Cache**: Redis para mensajes frecuentes
5. **Queue**: Bull/BullMQ para procesamiento asíncrono

---

## Contacto y soporte

- Email: perofaga@gmail.com
- Documentación: Ver README.md
- Issues: GitHub Issues

**¡Tu NexoAgent está listo para producción! 🚀**

# 🔒 Guía de Seguridad - NexoAgent

## Principios de seguridad implementados

### 1. Protección de datos sensibles
- ✅ Variables de entorno para todas las credenciales
- ✅ `.env` y `.env.local` en `.gitignore`
- ✅ No hay API keys hardcodeadas en el código
- ✅ Database connection strings nunca expuestas al cliente

### 2. Validación de inputs
- ✅ Validación de FormData en todas las Server Actions
- ✅ Sanitización de strings con `.trim()`
- ✅ Validación de tipos en TypeScript
- ✅ Prisma ORM previene SQL injection

### 3. Autenticación de webhooks
- ✅ Token de verificación para webhook de WhatsApp
- ✅ Validación de origen en GET request
- ✅ Manejo seguro de errores (no expone internals)

---

## Vulnerabilidades conocidas y mitigaciones

### XSS (Cross-Site Scripting)
**Estado**: ✅ Mitigado

- React escapa automáticamente el contenido en JSX
- No se usa `dangerouslySetInnerHTML`
- Mensajes de usuarios se muestran como texto plano

### SQL Injection
**Estado**: ✅ Mitigado

- Uso exclusivo de Prisma ORM con queries parametrizadas
- No hay raw SQL queries en el código
- Validación de tipos en TypeScript

### CSRF (Cross-Site Request Forgery)
**Estado**: ⚠️ Requiere implementación

**Recomendación para producción**:
```bash
npm install @edge-runtime/cookies
```

Agregar validación de origen en Server Actions.

### Rate Limiting
**Estado**: ⚠️ No implementado

**Recomendación para producción**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Ejemplo de implementación:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
  // ... resto del código
}
```

### Information Disclosure
**Estado**: ✅ Mitigado

- Mensajes de error genéricos al usuario
- Logs detallados solo en servidor (console.error)
- No se exponen stack traces al cliente

---

## Mejores prácticas de seguridad

### Variables de entorno

**❌ MAL**:
```typescript
const apiKey = "sk-ant-api03-xxxxx"; // Hardcoded
```

**✅ BIEN**:
```typescript
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
```

### Validación de inputs

**❌ MAL**:
```typescript
await prisma.contacto.create({
  data: { nombre, telefono } // Sin validar
});
```

**✅ BIEN**:
```typescript
if (!telefono?.trim()) {
  throw new Error("Teléfono requerido");
}

await prisma.contacto.create({
  data: { 
    nombre: nombre?.trim() || null,
    telefono: telefono.trim() 
  }
});
```

### Manejo de errores

**❌ MAL**:
```typescript
catch (error) {
  return Response.json({ error: error.message }); // Expone detalles
}
```

**✅ BIEN**:
```typescript
catch (error) {
  console.error("Error procesando documento:", error);
  return Response.json({ 
    error: "Error al procesar el archivo" 
  }, { status: 500 });
}
```

---

## Checklist de seguridad para producción

### Configuración básica
- [ ] Todas las variables sensibles en `.env` (no en código)
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] HTTPS habilitado (Vercel/Railway lo hacen automáticamente)
- [ ] Headers de seguridad configurados

### Autenticación y autorización
- [ ] Implementar NextAuth.js o similar
- [ ] Proteger rutas del dashboard con middleware
- [ ] Validar permisos de usuario por empresa
- [ ] Sesiones con cookies seguras (httpOnly, secure, sameSite)

### Rate Limiting
- [ ] Implementar rate limiting en endpoints públicos
- [ ] Webhook de WhatsApp: máx 100 req/min por IP
- [ ] API de documentos: máx 10 uploads/hora por empresa
- [ ] Login attempts: máx 5 intentos/15 min

### Logging y monitoreo
- [ ] Sentry para tracking de errores
- [ ] Logs estructurados (JSON)
- [ ] No loguear información sensible (passwords, tokens)
- [ ] Alertas para comportamiento anómalo

### Base de datos
- [ ] Connection pool configurado (max 10 conexiones)
- [ ] Backups automáticos diarios
- [ ] Encriptación en tránsito (SSL)
- [ ] Encriptación en reposo (provider dependiente)
- [ ] Usuarios de BD con mínimos privilegios

### WhatsApp API
- [ ] Webhook token suficientemente aleatorio (32+ chars)
- [ ] Validar firma de Meta (si disponible)
- [ ] No procesar mensajes antiguos (>5 min)
- [ ] Timeout de 10s para llamadas a Claude

---

## Reporte de vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** abras un issue público
2. Envía un email a: perofaga@gmail.com
3. Incluye:
   - Descripción de la vulnerabilidad
   - Pasos para reproducirla
   - Impacto potencial
   - Sugerencias de mitigación (opcional)

Tiempo de respuesta: 48 horas

---

## Headers de seguridad recomendados

Agregar en `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

---

## Auditoría de dependencias

```bash
# Verificar vulnerabilidades conocidas
npm audit

# Arreglar automáticamente (cuidado con breaking changes)
npm audit fix

# Ver detalles
npm audit --json
```

### Dependencias actuales (sin vulnerabilidades críticas conocidas)
- `next`: 16.2.6
- `react`: 19.2.4
- `@anthropic-ai/sdk`: 0.100.1
- `prisma`: 7.8.0

---

## OWASP Top 10 - Estado

| Vulnerabilidad | Estado | Notas |
|---|---|---|
| A01: Broken Access Control | ⚠️ | Falta autenticación multi-tenant |
| A02: Cryptographic Failures | ✅ | Env vars, HTTPS, Prisma ORM |
| A03: Injection | ✅ | Prisma previene SQL injection |
| A04: Insecure Design | ✅ | Arquitectura revisada |
| A05: Security Misconfiguration | ⚠️ | Falta headers de seguridad |
| A06: Vulnerable Components | ✅ | Dependencias actualizadas |
| A07: Auth Failures | ⚠️ | Falta autenticación |
| A08: Software & Data Integrity | ✅ | NPM lockfile, git |
| A09: Logging Failures | ⚠️ | Logs básicos, falta Sentry |
| A10: SSRF | ✅ | No hay requests a URLs de usuario |

---

## Recursos adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [Meta WhatsApp Security](https://developers.facebook.com/docs/whatsapp/overview/security)

---

**Última actualización**: 2026-05-31

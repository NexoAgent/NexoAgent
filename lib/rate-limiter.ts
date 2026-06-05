/**
 * Rate Limiter simple en memoria
 * Previene abuse de API endpoints
 *
 * NOTA: En producción con múltiples instancias, considerar:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel Edge Config
 * - Cloudflare Rate Limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Almacén en memoria (se reinicia con cada deploy)
const store = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Número máximo de requests permitidos en el período
   * @default 60
   */
  limit?: number;

  /**
   * Ventana de tiempo en segundos
   * @default 60 (1 minuto)
   */
  windowSeconds?: number;
}

export interface RateLimitResult {
  /**
   * Si el request está permitido
   */
  allowed: boolean;

  /**
   * Requests restantes en la ventana actual
   */
  remaining: number;

  /**
   * Timestamp cuando se resetea el límite (unix timestamp)
   */
  resetAt: number;

  /**
   * Límite total configurado
   */
  limit: number;
}

/**
 * Verifica si un identificador (IP, userId, etc.) ha excedido el rate limit
 *
 * @param identifier - Identificador único (IP, userId, apiKey, etc.)
 * @param options - Opciones de rate limiting
 * @returns Resultado con allowed, remaining, resetAt
 *
 * @example
 * ```typescript
 * const result = checkRateLimit(request.ip, { limit: 10, windowSeconds: 60 });
 * if (!result.allowed) {
 *   return new Response("Too Many Requests", {
 *     status: 429,
 *     headers: {
 *       'X-RateLimit-Limit': result.limit.toString(),
 *       'X-RateLimit-Remaining': '0',
 *       'X-RateLimit-Reset': result.resetAt.toString(),
 *     }
 *   });
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 60;
  const windowMs = (options.windowSeconds ?? 60) * 1000;
  const now = Date.now();

  // Obtener o crear entrada
  let entry = store.get(identifier);

  // Si no existe o expiró, crear nueva
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    store.set(identifier, entry);
  }

  // Incrementar contador
  entry.count++;

  // Determinar si está permitido
  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);

  return {
    allowed,
    remaining,
    limit,
    resetAt: entry.resetAt,
  };
}

/**
 * Middleware helper para Next.js API routes
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *   const rateLimit = await rateLimitMiddleware(ip, { limit: 10, windowSeconds: 60 });
 *
 *   if (!rateLimit.allowed) {
 *     return rateLimit.response;
 *   }
 *
 *   // ... tu código normal
 * }
 * ```
 */
export async function rateLimitMiddleware(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<{ allowed: boolean; response?: Response; result: RateLimitResult }> {
  const result = checkRateLimit(identifier, options);

  if (!result.allowed) {
    return {
      allowed: false,
      result,
      response: new Response(
        JSON.stringify({
          error: "Too Many Requests",
          limit: result.limit,
          resetAt: result.resetAt,
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.resetAt.toString(),
            "Retry-After": Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return {
    allowed: true,
    result,
  };
}

/**
 * Resetear manualmente el rate limit de un identificador
 * Útil para testing o casos especiales
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Obtener estadísticas actuales del rate limiter
 */
export function getRateLimitStats(): {
  totalIdentifiers: number;
  activeIdentifiers: number;
} {
  const now = Date.now();
  const active = Array.from(store.values()).filter((entry) => entry.resetAt > now).length;

  return {
    totalIdentifiers: store.size,
    activeIdentifiers: active,
  };
}

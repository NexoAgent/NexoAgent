/**
 * Sistema de logging profesional
 * - En desarrollo: todos los logs visibles
 * - En producción: solo errores y warnings críticos
 * - Previene exposición de datos sensibles en producción
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger para debugging (solo desarrollo)
 * En producción se ignora completamente
 */
function debug(...args: any[]): void {
  if (isDevelopment) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Logger para información general
 * En producción solo si es crítico
 */
function info(...args: any[]): void {
  if (isDevelopment) {
    console.info('[INFO]', ...args);
  }
  // En producción: silencioso (evita llenar logs)
}

/**
 * Logger para warnings
 * Siempre se registra pero con prefix
 */
function warn(...args: any[]): void {
  console.warn('[WARN]', ...args);
}

/**
 * Logger para errores
 * SIEMPRE se registra (crítico)
 */
function error(...args: any[]): void {
  console.error('[ERROR]', ...args);
}

/**
 * Logger para datos sensibles (NUNCA en producción)
 * Útil para debugging de datos sin exponerlos en prod
 */
function sensitive(label: string, data: any): void {
  if (isDevelopment) {
    console.log(`[SENSITIVE] ${label}:`, data);
  } else {
    console.log(`[SENSITIVE] ${label}: [REDACTED]`);
  }
}

/**
 * Logger para requests HTTP
 * En producción solo registra método y path (sin query params ni body)
 */
function http(method: string, path: string, details?: any): void {
  if (isDevelopment) {
    console.log(`[HTTP] ${method} ${path}`, details);
  } else {
    // En producción: solo método y path sin detalles
    console.log(`[HTTP] ${method} ${path}`);
  }
}

/**
 * Logger para queries de base de datos
 * En producción solo registra el modelo, no los datos
 */
function db(operation: string, model: string, details?: any): void {
  if (isDevelopment) {
    console.log(`[DB] ${operation} ${model}`, details);
  } else {
    // En producción: solo operación y modelo
    console.log(`[DB] ${operation} ${model}`);
  }
}

/**
 * Medir tiempo de ejecución
 */
function time(label: string): void {
  if (isDevelopment) {
    console.time(label);
  }
}

function timeEnd(label: string): void {
  if (isDevelopment) {
    console.timeEnd(label);
  }
}

export const logger = {
  debug,
  info,
  warn,
  error,
  sensitive,
  http,
  db,
  time,
  timeEnd,

  // Helpers
  isDevelopment,
  isProduction,
};

export default logger;

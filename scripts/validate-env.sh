#!/bin/bash

# Script de validación de variables de entorno
# Asegura que todas las variables críticas estén configuradas

set -e

echo "🔍 Validando variables de entorno..."

# Variables críticas requeridas
REQUIRED_VARS=(
  "DATABASE_URL"
  "DIRECT_URL"
  "AUTH_SECRET"
  "ANTHROPIC_API_KEY"
  "WHATSAPP_VERIFY_TOKEN"
  "WHATSAPP_TOKEN"
  "WHATSAPP_PHONE_NUMBER_ID"
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
)

# Variables opcionales pero recomendadas
OPTIONAL_VARS=(
  "RESEND_API_KEY"
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY"
  "VAPID_PRIVATE_KEY"
  "VAPID_SUBJECT"
  "GOOGLE_REDIRECT_URI"
  "NEXTAUTH_URL"
)

MISSING=()
MISSING_OPTIONAL=()

# Verificar variables requeridas
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING+=("$var")
  else
    echo "✅ $var"
  fi
done

# Verificar variables opcionales
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_OPTIONAL+=("$var")
  else
    echo "✅ $var (opcional)"
  fi
done

echo ""

# Reportar resultados
if [ ${#MISSING[@]} -gt 0 ]; then
  echo "❌ FALTAN VARIABLES CRÍTICAS:"
  for var in "${MISSING[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "📝 Configúralas en tu archivo .env o en Vercel"
  exit 1
fi

if [ ${#MISSING_OPTIONAL[@]} -gt 0 ]; then
  echo "⚠️  Variables opcionales no configuradas:"
  for var in "${MISSING_OPTIONAL[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "💡 Estas variables son opcionales pero mejoran la funcionalidad"
fi

echo ""
echo "✅ Todas las variables críticas están configuradas"
echo "🚀 Sistema listo para producción"

exit 0

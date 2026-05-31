#!/bin/bash

# Script para verificar que el proyecto esté listo para Vercel
# Uso: ./scripts/check-vercel-ready.sh

set -e

echo "🔍 Verificando que NexoAgent esté listo para Vercel"
echo "===================================================="
echo ""

ERRORS=0
WARNINGS=0

# Verificar que .gitignore esté correcto
echo "📁 Verificando .gitignore..."
if grep -q ".env" .gitignore && grep -q "node_modules" .gitignore; then
  echo "✅ .gitignore está correcto"
else
  echo "❌ .gitignore falta .env o node_modules"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Verificar que no haya archivos .env en el repo
echo "🔐 Verificando que no haya archivos sensibles..."
if git ls-files | grep -q "\.env"; then
  echo "⚠️  Archivos .env encontrados en el repositorio"
  echo "   Estos archivos NO deberían estar commiteados"
  git ls-files | grep "\.env"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✅ No hay archivos .env en el repositorio"
fi
echo ""

# Verificar que package.json tenga los scripts correctos
echo "📦 Verificando package.json..."
if grep -q '"build":' package.json; then
  BUILD_CMD=$(grep '"build":' package.json)
  if [[ $BUILD_CMD == *"prisma generate"* ]]; then
    echo "✅ Build script incluye prisma generate"
  else
    echo "⚠️  Build script NO incluye prisma generate"
    echo "   Recomendado: \"build\": \"prisma generate && next build\""
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo "❌ No se encontró script 'build' en package.json"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Verificar que prisma schema tenga directUrl
echo "🗄️  Verificando configuración de Prisma..."
if grep -q "directUrl" prisma/schema.prisma; then
  echo "✅ Prisma schema tiene directUrl configurado"
else
  echo "❌ Prisma schema NO tiene directUrl"
  echo "   Necesario para Supabase Connection Pooling"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Verificar que exista .env.example
echo "📋 Verificando documentación de variables..."
if [ -f .env.example ]; then
  echo "✅ .env.example existe"

  # Contar variables requeridas
  REQUIRED_VARS=("DATABASE_URL" "ANTHROPIC_API_KEY" "AUTH_SECRET")
  MISSING_VARS=0

  for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "$var" .env.example; then
      echo "⚠️  $var no está en .env.example"
      MISSING_VARS=$((MISSING_VARS + 1))
    fi
  done

  if [ $MISSING_VARS -eq 0 ]; then
    echo "✅ Todas las variables requeridas están documentadas"
  else
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo "⚠️  .env.example no existe"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Verificar que el build local funcione
echo "🏗️  Verificando build local..."
echo "   (Esto puede tardar un momento...)"
if npm run build > /dev/null 2>&1; then
  echo "✅ Build local exitoso"
else
  echo "❌ Build local falló"
  echo "   Ejecuta 'npm run build' para ver los errores"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Verificar estado de git
echo "🔄 Verificando estado de Git..."
if git diff-index --quiet HEAD --; then
  echo "✅ No hay cambios sin commitear"
else
  echo "⚠️  Hay cambios sin commitear"
  echo "   Commitea los cambios antes de deployar"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Verificar que esté en branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "✅ Estás en la rama main"
else
  echo "⚠️  No estás en la rama main (estás en: $CURRENT_BRANCH)"
  echo "   Vercel deployará automáticamente desde main"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Verificar que tenga remote configurado
echo "🌐 Verificando repositorio remoto..."
if git remote -v | grep -q "origin"; then
  REMOTE_URL=$(git remote get-url origin)
  echo "✅ Remote origin configurado: $REMOTE_URL"

  if [[ $REMOTE_URL == *"github.com"* ]] || [[ $REMOTE_URL == *"gitlab.com"* ]]; then
    echo "✅ Repositorio en plataforma soportada por Vercel"
  else
    echo "⚠️  Repositorio no está en GitHub/GitLab"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo "❌ No hay remote 'origin' configurado"
  echo "   Necesitas un repositorio en GitHub/GitLab para Vercel"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Resumen
echo "=================================================="
echo "📊 RESUMEN"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ ¡Todo listo para deployar en Vercel!"
  echo ""
  echo "Próximos pasos:"
  echo "1. Ve a https://vercel.com/new"
  echo "2. Importa tu repositorio"
  echo "3. Configura las variables de entorno"
  echo "4. Deploy!"
  echo ""
  echo "Ver guía completa: DEPLOY-VERCEL.md"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo "⚠️  Listo con $WARNINGS advertencia(s)"
  echo ""
  echo "Puedes proceder con el deploy, pero revisa las advertencias."
  echo ""
  echo "Ver guía completa: DEPLOY-VERCEL.md"
  exit 0
else
  echo "❌ Encontrados $ERRORS error(es) y $WARNINGS advertencia(s)"
  echo ""
  echo "Por favor, corrige los errores antes de deployar."
  echo "Ver guía completa: DEPLOY-VERCEL.md"
  exit 1
fi

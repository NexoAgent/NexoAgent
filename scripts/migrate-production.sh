#!/bin/bash

echo "🔄 Aplicando migraciones a base de datos de producción..."
echo ""

# Verificar que exista DATABASE_URL en producción
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL no está configurada"
  echo "Ejecuta: export DATABASE_URL=<tu-url-de-produccion>"
  exit 1
fi

echo "📊 Base de datos: ${DATABASE_URL:0:30}..."
echo ""

# Aplicar migraciones
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migraciones aplicadas correctamente"
  echo ""
  echo "🌱 ¿Deseas ejecutar el seed? (y/n)"
  read -r response

  if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌱 Ejecutando seed..."
    npx prisma db seed

    if [ $? -eq 0 ]; then
      echo ""
      echo "✅ Seed ejecutado correctamente"
      echo ""
      echo "📋 Planes creados:"
      echo "   • STARTER - \$49 USD/mes"
      echo "   • BUSINESS - \$149 USD/mes"
      echo "   • CORPORATIVO - \$399 USD/mes"
    else
      echo ""
      echo "❌ Error ejecutando seed"
      exit 1
    fi
  fi

  echo ""
  echo "✅ Proceso completado"
  echo ""
  echo "🔗 Verifica en: https://nexoagent-sage.vercel.app/admin/planes"
else
  echo ""
  echo "❌ Error aplicando migraciones"
  exit 1
fi
